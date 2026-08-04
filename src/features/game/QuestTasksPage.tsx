import { useCallback, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  CheckCircle2,
  Clock,
  Coins,
  Crown,
  Gem,
  Gift,
  Package,
  Sparkles,
  Trophy,
} from 'lucide-react';
import { usePageMeta } from '@/hooks/usePageMeta';
import { useUser } from '@/hooks/useUser';
import { useQuestData } from '@/hooks/useQuestData';
import LevelUpModal from '@/components/modal/LevelUpModal';
import type { LevelUpInfo } from '@/components/modal/LevelUpModal';
import { gamePageTitleH1Class } from '@/features/game/layout/gamePageTitleClasses';
import type { QuestTasksPageProps } from '@/features/game/gamePageTypes';
import type { CaptainQuestReward, CaptainQuestRow } from '@/features/game/questTasks/captainQuestTypes';
import { CaptainQuestClaimModal } from '@/features/game/questTasks/CaptainQuestClaimModal';
import {
  mapClaimResponseToReward,
  mapUserQuestToHistoryEntry,
  mapUserQuestToRow,
  sortActiveUserQuestsForDisplay,
} from '@/features/game/questTasks/questApiMappers';
import { resolveQuestDisplayTexts } from '@/features/game/questTasks/resolveQuestDisplayTexts';
import { resolveNewLevelForModal } from '@/features/game/questTasks/resolveQuestClaimLevelUp';
import { applyCaptainQuestRewardOptimistic } from '@/features/game/questTasks/applyCaptainQuestRewardOptimistic';
import { claimQuestReward } from '@/services/questTaskService';
import { queryKeys } from '@/lib/query/queryKeys';
import { ApiHttpError } from '@/lib/api/ApiHttpError';
import type { GameUser, GameUserLevel } from '@/types/gameUser';
import type { UserQuestsResponse } from '@/types/userQuests';
import { patchUserFromRewardResponse } from '@/lib/game/patchUserFromRewardResponse';

const RARITY_CLASS: Record<string, string> = {
  common: 'text-muted-foreground',
  rare: 'text-blue-400',
  epic: 'text-purple-400',
  legendary: 'text-primary',
};

function formatQuestTitleRewardLine(codes: string[] | undefined, t: TFunction): string | null {
  if (!codes || codes.length === 0) return null;
  const titles = codes
    .map((code) => {
      const name = t(`titles.${code}.name`);
      return name === `titles.${code}.name` ? code : String(name);
    })
    .join(', ');
  return String(t('questTasksPage.rewardTitleLine', { titles }));
}

function RewardBadge({ reward, t }: { reward: CaptainQuestReward; t: TFunction }) {
  if (reward.type === 'gold') {
    return (
      <span className="inline-flex flex-wrap items-center gap-1 font-semibold text-primary">
        <Coins className="h-4 w-4 shrink-0" aria-hidden />
        <span>{reward.amount}</span>
        {reward.bonusExperience ? (
          <span className="inline-flex items-center gap-1 text-amber-200">
            <Sparkles className="h-3.5 w-3.5 shrink-0" aria-hidden />+{reward.bonusExperience}
          </span>
        ) : null}
      </span>
    );
  }
  if (reward.type === 'premium') {
    return (
      <span className="inline-flex items-center gap-1 font-semibold text-cyan-300">
        <Gem className="h-4 w-4 shrink-0" aria-hidden />
        {reward.amount}
      </span>
    );
  }
  if (reward.type === 'experience') {
    return (
      <span className="inline-flex items-center gap-1 font-semibold text-amber-200">
        <Sparkles className="h-4 w-4 shrink-0" aria-hidden />
        {reward.amount}
      </span>
    );
  }
  const label = reward.itemName ?? (reward.itemNameKey ? t(reward.itemNameKey) : t('questTasksPage.rewards.randomItem'));
  return (
    <span
      className={`inline-flex items-center gap-1 font-semibold ${RARITY_CLASS[reward.rarity] ?? 'text-foreground'}`}
    >
      <Package className="h-4 w-4 shrink-0" aria-hidden />
      {label}
    </span>
  );
}

type ClaimModalState = {
  open: boolean;
  questTitle: string | null;
  reward: CaptainQuestReward | null;
  rewardLoading: boolean;
  rewardTitleLine: string | null;
};

const initialClaimModal: ClaimModalState = {
  open: false,
  questTitle: null,
  reward: null,
  rewardLoading: false,
  rewardTitleLine: null,
};

export default function QuestTasksPage({ goBack: _goBack, onRewardClaimed }: QuestTasksPageProps) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { user, updateUser, fetchUserData } = useUser();
  const queryClient = useQueryClient();
  const { quests: apiQuests, loading, error, loadQuests, updateQuestStatus } = useQuestData(user);

  const [tab, setTab] = useState<'active' | 'history'>('active');
  const [claimModal, setClaimModal] = useState<ClaimModalState>(initialClaimModal);
  const [claimingId, setClaimingId] = useState<string | number | null>(null);
  const [levelUpModalOpen, setLevelUpModalOpen] = useState(false);
  const [levelUpInfo, setLevelUpInfo] = useState<LevelUpInfo | null>(null);
  const claimInFlightRef = useRef(false);
  const pendingLevelUpRef = useRef<LevelUpInfo | null>(null);
  const claimModalOpenRef = useRef(false);

  const activeRows = useMemo(() => {
    return sortActiveUserQuestsForDisplay(apiQuests.filter((q) => !q.isRewardClaimed)).map((q) => {
      const row = mapUserQuestToRow(q);
      const texts = resolveQuestDisplayTexts(q, t);
      return { ...row, ...texts };
    });
  }, [apiQuests, t]);

  const historyEntries = useMemo(() => {
    return apiQuests
      .map((q) => {
        const entry = mapUserQuestToHistoryEntry(q);
        if (!entry) return null;
        const texts = resolveQuestDisplayTexts(q, t);
        return {
          ...entry,
          title: texts.title,
          rewardDescription: texts.rewardDescription,
          rewardTitleCodes: texts.rewardTitleCodes,
        };
      })
      .filter((e): e is NonNullable<typeof e> => e !== null)
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [apiQuests, t]);

  usePageMeta({
    title: t('questTasksPage.seoTitle'),
    description: t('questTasksPage.seoDescription'),
    openGraph: true,
  });

  const closeClaimModal = useCallback(() => {
    claimModalOpenRef.current = false;
    setClaimModal(initialClaimModal);
    const pending = pendingLevelUpRef.current;
    if (pending) {
      pendingLevelUpRef.current = null;
      setLevelUpInfo(pending);
      setLevelUpModalOpen(true);
    }
  }, []);

  const openLevelUpAfterClaim = useCallback((info: LevelUpInfo) => {
    if (claimModalOpenRef.current) {
      pendingLevelUpRef.current = info;
      return;
    }
    pendingLevelUpRef.current = null;
    setLevelUpInfo(info);
    setLevelUpModalOpen(true);
  }, []);

  const closeLevelUpModal = useCallback(() => {
    setLevelUpModalOpen(false);
    setLevelUpInfo(null);
  }, []);

  const handleLevelUpDistributePoints = useCallback(() => {
    navigate('/game/character');
    closeLevelUpModal();
  }, [navigate, closeLevelUpModal]);

  const claimQuest = useCallback(
    async (row: CaptainQuestRow) => {
      if (row.progress < row.goal || row.id === undefined || row.id === null || claimingId !== null) return;
      if (claimInFlightRef.current) return;
      if (!user) return;

      claimInFlightRef.current = true;
      setClaimingId(row.id);

      const levelBeforeClaim: GameUserLevel | undefined = user.level
        ? { name: String(user.level.name), expToNextLevel: Number(user.level.expToNextLevel ?? 100) }
        : undefined;
      const snapshotUser: GameUser = { ...user };
      const isItemReward = row.reward.type === 'item';

      const finishBackgroundClaim = async (data: Awaited<ReturnType<typeof claimQuestReward>>) => {
        await updateUser(patchUserFromRewardResponse(data.updatedUser));

        const optimisticLevel: GameUserLevel | null = pendingLevelUpRef.current
          ? {
              name: pendingLevelUpRef.current.name,
              expToNextLevel: pendingLevelUpRef.current.expToNextLevel ?? 0,
            }
          : null;
        const levelUpResolved = resolveNewLevelForModal(
          data,
          optimisticLevel,
          levelBeforeClaim,
          data.updatedUser
        );

        if (levelUpResolved) {
          openLevelUpAfterClaim({
            name: levelUpResolved.name,
            expToNextLevel: levelUpResolved.expToNextLevel,
          });
          await fetchUserData();
        }

        if (user.id) {
          await queryClient.invalidateQueries({ queryKey: queryKeys.userQuests(user.id) });
        }
        await loadQuests();
        if (data.unclaimedCount !== undefined) {
          await onRewardClaimed(data.unclaimedCount);
        } else {
          await onRewardClaimed();
        }
      };

      const rollbackClaim = async (err: unknown) => {
        pendingLevelUpRef.current = null;
        claimModalOpenRef.current = false;
        setClaimModal(initialClaimModal);
        setLevelUpInfo(null);
        setLevelUpModalOpen(false);
        await updateUser(snapshotUser);
        updateQuestStatus(row.id, { isRewardClaimed: false });
        const msg =
          err instanceof ApiHttpError ? err.message : err instanceof Error ? err.message : t('errorClaimingReward');
        toast.error(msg);
        void loadQuests();
        void onRewardClaimed();
      };

      try {
        if (!isItemReward) {
          const { updatedUser, levelUpResult } = applyCaptainQuestRewardOptimistic(user, row.reward);
          await updateUser(patchUserFromRewardResponse(updatedUser));

          if (levelUpResult) {
            pendingLevelUpRef.current = {
              name: String(levelUpResult.name),
              expToNextLevel: Number(levelUpResult.expToNextLevel),
            };
          } else {
            pendingLevelUpRef.current = null;
          }

          updateQuestStatus(row.id, {
            isRewardClaimed: true,
            isCompleted: true,
            completedAt: new Date().toISOString(),
          });

          if (user.id) {
            let nextUnclaimed = 0;
            queryClient.setQueryData<UserQuestsResponse>(queryKeys.userQuests(user.id), (old) => {
              if (!old) return old;
              nextUnclaimed = Math.max(0, (old.unclaimedCount ?? 1) - 1);
              return {
                ...old,
                unclaimedCount: nextUnclaimed,
                hasUnclaimedRewards: nextUnclaimed > 0,
              };
            });
            void onRewardClaimed(nextUnclaimed);
          }

          claimModalOpenRef.current = true;
          setClaimModal({
            open: true,
            questTitle: row.title,
            reward: row.reward,
            rewardLoading: false,
            rewardTitleLine: formatQuestTitleRewardLine(row.rewardTitleCodes, t),
          });
          setLevelUpInfo(null);
          setLevelUpModalOpen(false);
          setClaimingId(null);

          void claimQuestReward(row.id)
            .then((data) => finishBackgroundClaim(data))
            .catch((err: unknown) => rollbackClaim(err))
            .finally(() => {
              claimInFlightRef.current = false;
            });
          return;
        }

        claimModalOpenRef.current = true;
        setClaimModal({
          open: true,
          questTitle: row.title,
          reward: row.reward,
          rewardLoading: true,
          rewardTitleLine: formatQuestTitleRewardLine(row.rewardTitleCodes, t),
        });

        const data = await claimQuestReward(row.id);
        const resolvedReward = mapClaimResponseToReward(data);

        await updateUser(patchUserFromRewardResponse(data.updatedUser));
        updateQuestStatus(row.id, {
          isRewardClaimed: true,
          isCompleted: true,
          completedAt: new Date().toISOString(),
        });

        const levelUpResolved = resolveNewLevelForModal(data, null, levelBeforeClaim, data.updatedUser);
        if (levelUpResolved) {
          pendingLevelUpRef.current = {
            name: levelUpResolved.name,
            expToNextLevel: levelUpResolved.expToNextLevel,
          };
          await fetchUserData();
        } else {
          pendingLevelUpRef.current = null;
        }

        if (user.id) {
          await queryClient.invalidateQueries({ queryKey: queryKeys.userQuests(user.id) });
        }
        await loadQuests();
        if (data.unclaimedCount !== undefined) {
          await onRewardClaimed(data.unclaimedCount);
        } else {
          await onRewardClaimed();
        }

        claimModalOpenRef.current = true;
        setClaimModal({
          open: true,
          questTitle: row.title,
          reward: resolvedReward,
          rewardLoading: false,
          rewardTitleLine: formatQuestTitleRewardLine(row.rewardTitleCodes, t),
        });
        setLevelUpInfo(null);
        setLevelUpModalOpen(false);
      } catch (err) {
        await rollbackClaim(err);
      } finally {
        if (isItemReward) {
          claimInFlightRef.current = false;
          setClaimingId(null);
        }
      }
    },
    [
      claimingId,
      fetchUserData,
      loadQuests,
      onRewardClaimed,
      openLevelUpAfterClaim,
      queryClient,
      t,
      updateQuestStatus,
      updateUser,
      user,
    ]
  );

  const dateLocale = i18n.language?.toLowerCase().startsWith('pl') ? 'pl-PL' : 'en-GB';

  return (
    <section className="w-full space-y-6" aria-label={t('questTasksPage.pageAriaLabel')}>
      <CaptainQuestClaimModal
        isOpen={claimModal.open}
        onClose={closeClaimModal}
        questTitle={claimModal.questTitle}
        reward={claimModal.reward}
        rewardLoading={claimModal.rewardLoading}
        rewardTitleLine={claimModal.rewardTitleLine}
      />

      <LevelUpModal
        isOpen={levelUpModalOpen}
        onClose={closeLevelUpModal}
        onDistributePoints={handleLevelUpDistributePoints}
        newLevel={levelUpInfo}
      />

      <h1 className={gamePageTitleH1Class}>{t('questTasksPage.title')}</h1>

      <div className="w-full space-y-6">
        {loading && (
          <div className="rounded-lg border border-border/40 bg-card/25 p-8 text-center text-muted-foreground">
            {t('loadingQuests')}
          </div>
        )}

        {!loading && error && (
          <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
            {error}
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="flex gap-1 rounded-lg border border-border p-1">
              <button
                type="button"
                className={`flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-md px-3 py-2 text-sm font-heading font-bold transition-colors ${
                  tab === 'active'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted/30 hover:text-foreground'
                }`}
                onClick={() => setTab('active')}
              >
                <Trophy className="h-4 w-4 shrink-0" aria-hidden />
                {t('questTasksPage.tabActive')}
              </button>
              <button
                type="button"
                className={`flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-md px-3 py-2 text-sm font-heading font-bold transition-colors ${
                  tab === 'history'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted/30 hover:text-foreground'
                }`}
                onClick={() => setTab('history')}
              >
                <Clock className="h-4 w-4 shrink-0" aria-hidden />
                {t('questTasksPage.tabHistory')}
              </button>
            </div>

            {tab === 'active' && (
              <div className="space-y-3">
                {activeRows.length === 0 ? (
                  <div className="rounded-lg border border-border/40 bg-card/25 p-8 text-center text-muted-foreground shadow-sm">
                    {t('questTasksPage.allDone')}
                  </div>
                ) : (
                  activeRows.map((q) => {
                    const Icon = q.Icon;
                    const ready = q.progress >= q.goal;
                    const pct = q.goal > 0 ? Math.min(100, Math.round((q.progress / q.goal) * 100)) : 0;
                    const busy = claimingId === q.id;
                    return (
                      <div
                        key={String(q.id)}
                        className={`rounded-lg border bg-card/25 p-4 shadow-sm transition-all sm:p-5 ${
                          ready ? 'border-primary/60 shadow-lg shadow-primary/10' : 'border-border/40'
                        }`}
                      >
                        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
                          <div className="flex min-w-0 flex-1 items-start gap-3 sm:items-center sm:gap-4">
                            <div
                              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${
                                ready ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'
                              }`}
                            >
                              <Icon className="h-6 w-6" aria-hidden />
                            </div>
                            <div className="min-w-0 w-full flex-1">
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <h2 className="font-heading text-lg font-semibold text-foreground">{q.title}</h2>
                                <RewardBadge reward={q.reward} t={t} />
                              </div>
                              <p className="mb-2 text-xs text-muted-foreground">{q.description}</p>
                              {q.rewardDescription ? (
                                <p className="mb-2 text-xs italic text-primary/80">{q.rewardDescription}</p>
                              ) : null}
                              {q.rewardTitleCodes && q.rewardTitleCodes.length > 0 ? (
                                <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-amber-200/90">
                                  <Crown className="h-3.5 w-3.5 shrink-0" aria-hidden />
                                  {formatQuestTitleRewardLine(q.rewardTitleCodes, t)}
                                </p>
                              ) : null}
                              <div className="flex items-center gap-3">
                                <div className="h-2 min-w-0 flex-1 overflow-hidden rounded-full bg-muted">
                                  <div
                                    className="h-full rounded-full bg-primary transition-[width]"
                                    style={{ width: `${pct}%` }}
                                  />
                                </div>
                                <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                                  {q.progress}/{q.goal}
                                </span>
                              </div>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => void claimQuest(q)}
                            disabled={!ready || busy}
                            className={`inline-flex w-full shrink-0 cursor-pointer items-center justify-center gap-2 rounded-lg border-2 px-4 py-2.5 text-sm font-black uppercase tracking-wide transition sm:w-auto ${
                              ready && !busy
                                ? 'border-primary bg-primary text-primary-foreground hover:bg-primary/90'
                                : 'cursor-not-allowed border-border bg-muted/40 text-muted-foreground opacity-70'
                            }`}
                          >
                            <Gift className="h-4 w-4" aria-hidden />
                            {busy
                              ? t('questTasksPage.claiming')
                              : ready
                                ? t('questTasksPage.claim')
                                : t('questTasksPage.inProgress')}
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {tab === 'history' && (
              <div className="rounded-lg border border-border/40 bg-card/25 p-5 shadow-sm sm:p-6">
                <h2 className="mb-4 flex items-center gap-2 font-heading text-lg font-bold uppercase tracking-wide text-primary">
                  <CheckCircle2 className="h-5 w-5 shrink-0" aria-hidden />
                  {t('questTasksPage.historyTitle')}
                </h2>
                {historyEntries.length === 0 ? (
                  <p className="text-sm text-muted-foreground">{t('questTasksPage.noHistory')}</p>
                ) : (
                  <ul className="space-y-2">
                    {historyEntries.map((c, i) => (
                      <li
                        key={`${c.title}-${c.date.getTime()}-${i}`}
                        className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-border bg-muted/20 p-3"
                      >
                        <div className="min-w-0">
                          <div className="font-medium text-foreground">{c.title}</div>
                          <div className="text-xs text-muted-foreground">
                            {c.date.toLocaleString(dateLocale)}
                          </div>
                          {c.rewardTitleCodes && c.rewardTitleCodes.length > 0 ? (
                            <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-amber-200/80">
                              <Crown className="h-3 w-3 shrink-0" aria-hidden />
                              {formatQuestTitleRewardLine(c.rewardTitleCodes, t)}
                            </p>
                          ) : null}
                        </div>
                        <RewardBadge reward={c.reward} t={t} />
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
