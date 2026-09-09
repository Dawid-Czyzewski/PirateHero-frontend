import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { CheckCircle2, Coins, Gem, Swords } from 'lucide-react';
import { toast } from 'sonner';
import { useUser } from '@/hooks/useUser';
import { ApiHttpError } from '@/lib/api/ApiHttpError';
import { patchUserFromRewardResponse } from '@/lib/game/patchUserFromRewardResponse';
import { queryKeys } from '@/lib/query/queryKeys';
import {
  claimWeeklyArenaFameTier,
  fetchWeeklyArenaFame,
  type WeeklyArenaFameTier,
} from '@/services/weeklyArenaFameService';

function TierRow({
  tier,
  fameEarned,
  claimingTier,
  onClaim,
}: {
  tier: WeeklyArenaFameTier;
  fameEarned: number;
  claimingTier: number | null;
  onClaim: (tier: number) => void;
}) {
  const { t } = useTranslation();
  const progress = Math.min(100, (fameEarned / Math.max(1, tier.threshold)) * 100);
  const busy = claimingTier === tier.tier;

  return (
    <div className="space-y-1.5 rounded-lg border border-border/40 bg-card/40 px-3 py-2">
      <div className="flex items-center justify-between gap-2 text-xs">
        <span className="font-semibold text-foreground">
          {t('weeklyArenaFame.tierLabel', { tier: tier.tier, threshold: tier.threshold })}
        </span>
        <span className="text-muted-foreground">
          {Math.min(fameEarned, tier.threshold)} / {tier.threshold}
        </span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-muted/60">
        <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${progress}%` }} />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
          <span className="inline-flex items-center gap-0.5">
            <Coins className="h-3 w-3 text-primary" aria-hidden />
            {tier.rewards.gold}
          </span>
          <span className="inline-flex items-center gap-0.5">
            <Gem className="h-3 w-3 text-blue-400" aria-hidden />
            {tier.rewards.diamonds}
          </span>
        </div>
        {tier.claimed ? (
          <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400">
            <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />
            {t('weeklyArenaFame.claimed')}
          </span>
        ) : (
          <button
            type="button"
            disabled={!tier.canClaim || busy}
            onClick={() => onClaim(tier.tier)}
            className="rounded-md bg-primary/90 px-2.5 py-1 text-[11px] font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busy ? t('loading') : t('weeklyArenaFame.claim')}
          </button>
        )}
      </div>
    </div>
  );
}

export function WeeklyArenaFamePanel() {
  const { t } = useTranslation();
  const { updateUser } = useUser();
  const queryClient = useQueryClient();
  const [claimingTier, setClaimingTier] = useState<number | null>(null);

  const q = useQuery({
    queryKey: queryKeys.weeklyArenaFame(),
    queryFn: fetchWeeklyArenaFame,
    staleTime: 15_000,
  });

  const onClaim = useCallback(
    async (tier: number) => {
      if (claimingTier !== null) return;
      setClaimingTier(tier);
      try {
        const result = await claimWeeklyArenaFameTier(tier);
        updateUser(patchUserFromRewardResponse(result.updatedUser));
        queryClient.setQueryData(queryKeys.weeklyArenaFame(), result.status);
        toast.success(
          t('weeklyArenaFame.claimSuccess', {
            gold: result.rewards.gold,
            diamonds: result.rewards.diamonds,
          })
        );
        if (result.titleGranted) {
          toast.success(t('weeklyArenaFame.titleUnlocked'));
        }
      } catch (err) {
        const msg =
          err instanceof ApiHttpError && err.message
            ? t(err.message)
            : t('weeklyArenaFame.claimFailed');
        toast.error(msg);
      } finally {
        setClaimingTier(null);
      }
    },
    [claimingTier, queryClient, t, updateUser]
  );

  if (q.isPending || q.isError || !q.data) {
    return null;
  }

  const status = q.data;
  const maxThreshold = status.tiers[status.tiers.length - 1]?.threshold ?? 600;
  const overall = Math.min(100, (status.fameEarned / maxThreshold) * 100);

  return (
    <section className="space-y-2 rounded-xl border border-primary/20 bg-primary/5 p-3">
      <div className="flex items-center gap-2">
        <Swords className="h-4 w-4 text-primary" aria-hidden />
        <h2 className="text-sm font-semibold text-foreground">{t('weeklyArenaFame.title')}</h2>
        <span className="ml-auto text-xs text-muted-foreground">
          {t('weeklyArenaFame.fameThisWeek', { fame: status.fameEarned })}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-muted/60">
        <div className="h-full rounded-full bg-primary/80" style={{ width: `${overall}%` }} />
      </div>
      <div className="grid gap-2 sm:grid-cols-3">
        {status.tiers.map((tier) => (
          <TierRow
            key={tier.tier}
            tier={tier}
            fameEarned={status.fameEarned}
            claimingTier={claimingTier}
            onClaim={(n) => void onClaim(n)}
          />
        ))}
      </div>
    </section>
  );
}
