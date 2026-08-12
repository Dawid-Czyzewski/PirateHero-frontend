import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { CheckCircle2, Coins, Gift, Swords, Target } from 'lucide-react';
import { toast } from 'sonner';
import { usePageMeta } from '@/hooks/usePageMeta';
import { useUser } from '@/hooks/useUser';
import { gamePageTitleH1Class } from '@/features/game/layout/gamePageTitleClasses';
import { ApiHttpError } from '@/lib/api/ApiHttpError';
import { patchUserFromRewardResponse } from '@/lib/game/patchUserFromRewardResponse';
import { queryKeys } from '@/lib/query/queryKeys';
import {
  claimDailyChallengeBonus,
  claimDailyChallengeSlot,
  fetchDailyChallenges,
  type DailyChallengeItem,
  type DailyChallengeType,
} from '@/services/dailyChallengeService';

function challengeLabel(
  type: DailyChallengeType,
  target: number,
  t: (key: string, opts?: Record<string, unknown>) => string
): string {
  switch (type) {
    case 'missions':
      return t('dailyChallengesPage.doMissions', { count: target });
    case 'arena_wins':
      return t('dailyChallengesPage.winFights', { count: target });
    case 'gold_spent':
      return t('dailyChallengesPage.spendGold', { amount: target });
    default:
      return type;
  }
}

function ChallengeIcon({ type }: { type: DailyChallengeType }) {
  if (type === 'missions') return <Target className="h-5 w-5 text-primary" aria-hidden />;
  if (type === 'arena_wins') return <Swords className="h-5 w-5 text-primary" aria-hidden />;
  return <Coins className="h-5 w-5 text-primary" aria-hidden />;
}

export default function DailyChallengesPage() {
  const { t } = useTranslation();
  const { user, updateUser } = useUser();
  const queryClient = useQueryClient();
  const [claimingSlot, setClaimingSlot] = useState<number | 'bonus' | null>(null);

  usePageMeta({
    title: t('dailyChallengesPage.seoTitle'),
    description: t('dailyChallengesPage.seoDescription'),
  });

  const q = useQuery({
    queryKey: queryKeys.dailyChallenges(),
    queryFn: fetchDailyChallenges,
    enabled: Boolean(user?.id),
    staleTime: 30_000,
  });

  const claimSlot = useCallback(
    async (item: DailyChallengeItem) => {
      if (!item.canClaim || claimingSlot !== null) return;
      setClaimingSlot(item.slot);
      try {
        const result = await claimDailyChallengeSlot(item.slot);
        await updateUser(patchUserFromRewardResponse(result.updatedUser));
        queryClient.setQueryData(queryKeys.dailyChallenges(), result.status);
        toast.success(
          t('dailyChallengesPage.claimSuccess', {
            gold: result.rewards.gold,
            exp: result.rewards.exp ?? 0,
          })
        );
      } catch (err) {
        const msg =
          err instanceof ApiHttpError && err.message
            ? t(err.message)
            : t('dailyChallengesPage.claimFailed');
        toast.error(msg);
      } finally {
        setClaimingSlot(null);
      }
    },
    [claimingSlot, queryClient, t, updateUser]
  );

  const claimBonus = useCallback(async () => {
    if (claimingSlot !== null) return;
    setClaimingSlot('bonus');
    try {
      const result = await claimDailyChallengeBonus();
      await updateUser(patchUserFromRewardResponse(result.updatedUser));
      queryClient.setQueryData(queryKeys.dailyChallenges(), result.status);
      toast.success(
        t('dailyChallengesPage.bonusSuccess', {
          gold: result.rewards.gold,
          diamonds: result.rewards.diamonds ?? 0,
        })
      );
    } catch (err) {
      const msg =
        err instanceof ApiHttpError && err.message
          ? t(err.message)
          : t('dailyChallengesPage.claimFailed');
      toast.error(msg);
    } finally {
      setClaimingSlot(null);
    }
  }, [claimingSlot, queryClient, t, updateUser]);

  if (q.isPending) {
    return (
      <section className="w-full space-y-4">
        <h1 className={gamePageTitleH1Class}>{t('dailyChallengesPage.title')}</h1>
        <p className="text-sm text-muted-foreground">{t('loading')}</p>
      </section>
    );
  }

  if (q.isError || !q.data) {
    return (
      <section className="w-full space-y-4">
        <h1 className={gamePageTitleH1Class}>{t('dailyChallengesPage.title')}</h1>
        <p className="text-sm text-destructive">{t('dailyChallengesPage.loadFailed')}</p>
        <button
          type="button"
          onClick={() => void q.refetch()}
          className="cursor-pointer rounded-lg bg-primary px-4 py-2 font-heading text-xs uppercase tracking-wide text-primary-foreground"
        >
          {t('dailyChallengesPage.retry')}
        </button>
      </section>
    );
  }

  const { challenges, bonus } = q.data;

  return (
    <section className="w-full space-y-6" aria-label={t('dailyChallengesPage.pageAriaLabel')}>
      <div>
        <h1 className={gamePageTitleH1Class}>{t('dailyChallengesPage.title')}</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          {t('dailyChallengesPage.subtitle')}
        </p>
      </div>

      <ul className="space-y-3">
        {challenges.map((item) => {
          const pct = Math.min(100, Math.round((item.progress / Math.max(1, item.targetValue)) * 100));
          return (
            <li
              key={item.slot}
              className="rounded-xl border border-border bg-card px-4 py-4 sm:px-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex min-w-0 items-start gap-3">
                  <ChallengeIcon type={item.type} />
                  <div>
                    <p className="font-heading text-sm font-bold text-foreground sm:text-base">
                      {challengeLabel(item.type, item.targetValue, t)}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {item.progress}/{item.targetValue}
                      {item.rewardClaimed ? ` · ${t('dailyChallengesPage.claimed')}` : ''}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  disabled={!item.canClaim || claimingSlot !== null}
                  onClick={() => void claimSlot(item)}
                  className={`cursor-pointer rounded-lg px-3 py-2 font-heading text-[11px] uppercase tracking-wide ${
                    item.canClaim
                      ? 'bg-primary text-primary-foreground'
                      : 'cursor-not-allowed border border-border bg-muted/40 text-muted-foreground'
                  }`}
                >
                  {item.rewardClaimed
                    ? t('dailyChallengesPage.claimed')
                    : claimingSlot === item.slot
                      ? t('dailyChallengesPage.claiming')
                      : item.canClaim
                        ? t('dailyChallengesPage.claim')
                        : t('dailyChallengesPage.inProgress')}
                </button>
              </div>
              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted/80">
                <div
                  className="h-full bg-gradient-to-r from-primary to-yellow-300"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                {t('dailyChallengesPage.rewardLine', {
                  gold: item.rewards.gold,
                  exp: item.rewards.exp,
                })}
              </p>
            </li>
          );
        })}
      </ul>

      <div className="rounded-xl border border-primary/30 bg-primary/5 px-4 py-4 sm:px-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <Gift className="h-5 w-5 text-primary" aria-hidden />
            <div>
              <p className="font-heading text-sm font-bold text-foreground sm:text-base">
                {t('dailyChallengesPage.bonusTitle')}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {t('dailyChallengesPage.bonusHint')}
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                {t('dailyChallengesPage.bonusRewardLine', {
                  gold: bonus.rewards.gold,
                  diamonds: bonus.rewards.diamonds,
                })}
              </p>
            </div>
          </div>
          <button
            type="button"
            disabled={!bonus.canClaim || claimingSlot !== null}
            onClick={() => void claimBonus()}
            className={`inline-flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 font-heading text-[11px] uppercase tracking-wide ${
              bonus.canClaim
                ? 'bg-primary text-primary-foreground'
                : 'cursor-not-allowed border border-border bg-muted/40 text-muted-foreground'
            }`}
          >
            {bonus.claimed ? <CheckCircle2 className="h-3.5 w-3.5" aria-hidden /> : null}
            {bonus.claimed
              ? t('dailyChallengesPage.claimed')
              : claimingSlot === 'bonus'
                ? t('dailyChallengesPage.claiming')
                : bonus.canClaim
                  ? t('dailyChallengesPage.claimBonus')
                  : t('dailyChallengesPage.bonusLocked')}
          </button>
        </div>
      </div>
    </section>
  );
}
