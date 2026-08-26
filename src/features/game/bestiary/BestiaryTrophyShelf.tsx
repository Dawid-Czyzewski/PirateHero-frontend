import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Award, CheckCircle2, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { ApiHttpError } from '@/lib/api/ApiHttpError';
import { patchUserFromRewardResponse } from '@/lib/game/patchUserFromRewardResponse';
import { queryKeys } from '@/lib/query/queryKeys';
import { useUser } from '@/hooks/useUser';
import {
  claimBestiaryTrophy,
  fetchBestiaryTrophies,
  type BestiaryTrophyItem,
} from '@/services/bestiaryTrophyService';

function trophyLabel(code: string, t: (key: string) => string): string {
  return t(`bestiaryPage.trophies.codes.${code}`);
}

function TrophyCard({
  trophy,
  claiming,
  onClaim,
}: {
  trophy: BestiaryTrophyItem;
  claiming: boolean;
  onClaim: (code: string) => void;
}) {
  const { t } = useTranslation();
  const locked = !trophy.unlocked;

  return (
    <div
      className={`flex flex-col gap-2 rounded-lg border p-3 ${
        trophy.canClaim
          ? 'border-primary/50 bg-primary/5'
          : locked
            ? 'border-border/40 bg-muted/20 opacity-70'
            : 'border-border bg-card'
      }`}
    >
      <div className="flex items-start gap-2">
        {locked ? (
          <Lock className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
        ) : trophy.rewardClaimed ? (
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
        ) : (
          <Award className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
        )}
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold leading-tight">{trophyLabel(trophy.code, t)}</p>
          <p className="mt-0.5 text-[10px] text-muted-foreground">
            {t('bestiaryPage.trophies.target', { count: trophy.targetCount })}
          </p>
          <p className="mt-1 text-[10px] text-muted-foreground">
            {t('bestiaryPage.trophies.reward', {
              gold: trophy.rewards.gold,
              diamonds: trophy.rewards.diamonds,
            })}
          </p>
        </div>
      </div>
      {trophy.canClaim ? (
        <button
          type="button"
          className="cursor-pointer rounded-md bg-primary px-2 py-1.5 text-[11px] font-bold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
          disabled={claiming}
          onClick={() => onClaim(trophy.code)}
        >
          {claiming ? t('bestiaryPage.trophies.claiming') : t('bestiaryPage.trophies.claim')}
        </button>
      ) : null}
      {trophy.rewardClaimed ? (
        <p className="text-[10px] font-semibold text-primary">{t('bestiaryPage.trophies.claimed')}</p>
      ) : null}
    </div>
  );
}

export function BestiaryTrophyShelf() {
  const { t } = useTranslation();
  const { updateUser } = useUser();
  const queryClient = useQueryClient();
  const [claimingCode, setClaimingCode] = useState<string | null>(null);

  const q = useQuery({
    queryKey: queryKeys.bestiaryTrophies(),
    queryFn: fetchBestiaryTrophies,
    staleTime: 30_000,
  });

  const onClaim = useCallback(
    async (code: string) => {
      if (claimingCode) return;
      setClaimingCode(code);
      try {
        const result = await claimBestiaryTrophy(code);
        updateUser(patchUserFromRewardResponse(result.updatedUser));
        queryClient.setQueryData(queryKeys.bestiaryTrophies(), result.status);
        toast.success(
          t('bestiaryPage.trophies.claimSuccess', {
            gold: result.rewards.gold,
            diamonds: result.rewards.diamonds,
          })
        );
        if (result.titleGranted) {
          toast.success(t('bestiaryPage.trophies.titleUnlocked'));
        }
      } catch (err) {
        const msg =
          err instanceof ApiHttpError && err.message
            ? t(err.message)
            : t('bestiaryPage.trophies.claimFailed');
        toast.error(msg);
      } finally {
        setClaimingCode(null);
      }
    },
    [claimingCode, queryClient, t, updateUser]
  );

  if (q.isPending || q.isError || !q.data) {
    return null;
  }

  const { trophies, discoveredCount, total } = q.data;
  const next = trophies.find((row) => !row.unlocked);

  return (
    <section className="space-y-3 rounded-xl border border-border/60 bg-card/40 p-3 sm:p-4">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="font-heading text-sm font-bold uppercase tracking-wider">
            {t('bestiaryPage.trophies.title')}
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">{t('bestiaryPage.trophies.hint')}</p>
        </div>
        {next ? (
          <p className="text-[11px] text-muted-foreground">
            {t('bestiaryPage.trophies.next', {
              current: discoveredCount,
              target: next.targetCount,
              total,
            })}
          </p>
        ) : (
          <p className="text-[11px] font-semibold text-primary">{t('bestiaryPage.trophies.complete')}</p>
        )}
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {trophies.map((trophy) => (
          <TrophyCard
            key={trophy.code}
            trophy={trophy}
            claiming={claimingCode === trophy.code}
            onClaim={(code) => void onClaim(code)}
          />
        ))}
      </div>
    </section>
  );
}
