import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { CheckCircle2, Coins, ScrollText, Swords, Target } from 'lucide-react';
import { toast } from 'sonner';
import { usePageMeta } from '@/hooks/usePageMeta';
import { useUser } from '@/hooks/useUser';
import { gamePageTitleH1Class } from '@/features/game/layout/gamePageTitleClasses';
import { ApiHttpError } from '@/lib/api/ApiHttpError';
import { patchUserFromRewardResponse } from '@/lib/game/patchUserFromRewardResponse';
import { queryKeys } from '@/lib/query/queryKeys';
import {
  claimWeeklyContract,
  fetchWeeklyContract,
  type WeeklyContractType,
} from '@/services/weeklyContractService';

function contractLabel(
  type: WeeklyContractType,
  target: number,
  t: (key: string, opts?: Record<string, unknown>) => string
): string {
  switch (type) {
    case 'missions':
      return t('weeklyContractPage.doMissions', { count: target });
    case 'arena_wins':
      return t('weeklyContractPage.winFights', { count: target });
    case 'gold_spent':
      return t('weeklyContractPage.spendGold', { amount: target });
    default:
      return type;
  }
}

function ContractIcon({ type }: { type: WeeklyContractType }) {
  if (type === 'missions') return <Target className="h-5 w-5 text-primary" aria-hidden />;
  if (type === 'arena_wins') return <Swords className="h-5 w-5 text-primary" aria-hidden />;
  return <Coins className="h-5 w-5 text-primary" aria-hidden />;
}

export default function WeeklyContractPage() {
  const { t } = useTranslation();
  const { updateUser } = useUser();
  const queryClient = useQueryClient();
  const [claiming, setClaiming] = useState(false);

  usePageMeta({
    title: t('weeklyContractPage.seoTitle'),
    description: t('weeklyContractPage.seoDescription'),
  });

  const q = useQuery({
    queryKey: queryKeys.weeklyContract(),
    queryFn: fetchWeeklyContract,
  });

  const claim = useCallback(async () => {
    if (claiming) return;
    setClaiming(true);
    try {
      const result = await claimWeeklyContract();
      updateUser(patchUserFromRewardResponse(result.updatedUser));
      queryClient.setQueryData(queryKeys.weeklyContract(), result.status);
      toast.success(
        t('weeklyContractPage.claimSuccess', {
          gold: result.rewards.gold,
          diamonds: result.rewards.diamonds,
        })
      );
      if (result.titleGranted) {
        toast.success(t('weeklyContractPage.titleUnlocked'));
      }
    } catch (err) {
      const msg =
        err instanceof ApiHttpError && err.message
          ? t(err.message)
          : t('weeklyContractPage.claimFailed');
      toast.error(msg);
    } finally {
      setClaiming(false);
    }
  }, [claiming, queryClient, t, updateUser]);

  if (q.isPending) {
    return (
      <section className="w-full space-y-4">
        <h1 className={gamePageTitleH1Class}>{t('weeklyContractPage.title')}</h1>
        <p className="text-sm text-muted-foreground">{t('loading')}</p>
      </section>
    );
  }

  if (q.isError || !q.data) {
    return (
      <section className="w-full space-y-4">
        <h1 className={gamePageTitleH1Class}>{t('weeklyContractPage.title')}</h1>
        <p className="text-sm text-destructive">{t('weeklyContractPage.loadFailed')}</p>
        <button
          type="button"
          onClick={() => void q.refetch()}
          className="cursor-pointer rounded-lg bg-primary px-4 py-2 font-heading text-xs uppercase tracking-wide text-primary-foreground"
        >
          {t('weeklyContractPage.retry')}
        </button>
      </section>
    );
  }

  const status = q.data;
  const pct = Math.min(100, Math.round((status.progress / Math.max(1, status.targetValue)) * 100));

  return (
    <section className="w-full space-y-6" aria-label={t('weeklyContractPage.pageAriaLabel')}>
      <div>
        <h1 className={gamePageTitleH1Class}>{t('weeklyContractPage.title')}</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          {t('weeklyContractPage.subtitle', { start: status.weekStart, end: status.weekEnd })}
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card px-4 py-4 sm:px-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            <ContractIcon type={status.type} />
            <div>
              <p className="font-heading text-sm font-bold text-foreground sm:text-base">
                {contractLabel(status.type, status.targetValue, t)}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {status.progress}/{status.targetValue}
                {status.rewardClaimed ? ` · ${t('weeklyContractPage.claimed')}` : ''}
              </p>
            </div>
          </div>
          <button
            type="button"
            disabled={!status.canClaim || claiming}
            onClick={() => void claim()}
            className={`inline-flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 font-heading text-[11px] uppercase tracking-wide ${
              status.canClaim
                ? 'bg-primary text-primary-foreground'
                : 'cursor-not-allowed border border-border bg-muted/40 text-muted-foreground'
            }`}
          >
            {status.rewardClaimed ? <CheckCircle2 className="h-3.5 w-3.5" aria-hidden /> : null}
            {status.rewardClaimed
              ? t('weeklyContractPage.claimed')
              : claiming
                ? t('weeklyContractPage.claiming')
                : status.canClaim
                  ? t('weeklyContractPage.claim')
                  : t('weeklyContractPage.inProgress')}
          </button>
        </div>
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted/80">
          <div
            className="h-full bg-gradient-to-r from-primary to-yellow-300"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          {t('weeklyContractPage.rewardLine', {
            gold: status.rewards.gold,
            diamonds: status.rewards.diamonds,
          })}
        </p>
        <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
          <ScrollText className="h-3.5 w-3.5" aria-hidden />
          {t('weeklyContractPage.titleRewardHint')}
        </p>
      </div>
    </section>
  );
}
