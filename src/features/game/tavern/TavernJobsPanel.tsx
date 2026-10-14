import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { CheckCircle2, Coins, Gem, Timer } from 'lucide-react';
import { toast } from 'sonner';
import { ApiHttpError } from '@/lib/api/ApiHttpError';
import { useUser } from '@/hooks/useUser';
import { queryKeys } from '@/lib/query/queryKeys';
import { formatMissionTimeShort } from '@/features/game/missions/formatMissionTime';
import {
  cancelTavernJob,
  completeTavernJob,
  fetchTavernStatus,
  startTavernJob,
  type TavernJobOffer,
} from '@/services/tavernService';

function formatRemaining(seconds: number): string {
  return formatMissionTimeShort(Math.max(0, seconds) * 1000);
}

export function TavernJobsPanel() {
  const { t } = useTranslation();
  const { fetchUserData, setUser } = useUser();
  const queryClient = useQueryClient();
  const [busy, setBusy] = useState(false);
  const [tick, setTick] = useState(0);

  const q = useQuery({
    queryKey: queryKeys.tavern(),
    queryFn: fetchTavernStatus,
    refetchInterval: 15_000,
  });

  useEffect(() => {
    if (!q.data?.activeJob || q.data.activeJob.readyToComplete) return;
    const id = window.setInterval(() => setTick((n) => n + 1), 1000);
    return () => window.clearInterval(id);
  }, [q.data?.activeJob?.id, q.data?.activeJob?.readyToComplete]);

  const status = q.data;
  const active = status?.activeJob ?? null;
  const remaining = active?.endsAt
    ? Math.max(0, Math.floor((new Date(active.endsAt).getTime() - Date.now()) / 1000))
    : active
      ? Math.max(0, active.remainingSeconds)
      : 0;
  const ready = Boolean(active && (active.readyToComplete || remaining <= 0));
  void tick;

  const run = useCallback(
    async (fn: () => Promise<void>) => {
      if (busy) return;
      setBusy(true);
      try {
        await fn();
      } catch (err) {
        const msg =
          err instanceof ApiHttpError && err.message ? t(err.message) : t('tavernPage.jobs.actionFailed');
        toast.error(msg);
      } finally {
        setBusy(false);
      }
    },
    [busy, t]
  );

  const onStart = (offer: TavernJobOffer) =>
    void run(async () => {
      const next = await startTavernJob(offer.id);
      queryClient.setQueryData(queryKeys.tavern(), next);
      toast.success(t('tavernPage.jobs.started'));
      setTick(0);
      await fetchUserData();
    });

  const onComplete = () =>
    void run(async () => {
      const result = await completeTavernJob();
      queryClient.setQueryData(queryKeys.tavern(), result.status);
      setUser((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          gold: Number(prev.gold ?? 0) + result.rewardGold,
          diamonds: Number(prev.diamonds ?? 0) + result.rewardDiamonds,
        };
      });
      toast.success(
        t('tavernPage.jobs.completed', {
          gold: result.rewardGold,
          diamonds: result.rewardDiamonds,
        })
      );
      setTick(0);
      await fetchUserData();
    });

  const onCancel = () =>
    void run(async () => {
      const next = await cancelTavernJob();
      queryClient.setQueryData(queryKeys.tavern(), next);
      toast.success(t('tavernPage.jobs.cancelled'));
      setTick(0);
      await fetchUserData();
    });

  if (q.isPending) {
    return <p className="text-sm text-muted-foreground">{t('loading')}</p>;
  }

  if (q.isError || !status) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-destructive">{t('tavernPage.jobs.loadFailed')}</p>
        <button
          type="button"
          onClick={() => void q.refetch()}
          className="cursor-pointer rounded-lg bg-primary px-4 py-2 font-heading text-xs uppercase tracking-wide text-primary-foreground"
        >
          {t('tavernPage.jobs.retry')}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4" aria-label={t('tavernPage.jobs.ariaLabel')}>
      <p className="text-sm text-muted-foreground">{t('tavernPage.jobs.subtitle')}</p>

      {active ? (
        <div className="rounded-xl border border-primary/30 bg-primary/5 px-4 py-4 sm:px-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex min-w-0 items-start gap-3">
              <Timer className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden />
              <div>
                <p className="font-heading text-sm font-bold text-foreground sm:text-base">
                  {t(active.titleKey)}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {ready
                    ? t('tavernPage.jobs.ready')
                    : t('tavernPage.jobs.inProgress', { time: formatRemaining(remaining) })}
                </p>
                <p className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <Coins className="h-3.5 w-3.5 text-primary" aria-hidden />
                    +{active.rewardGold}
                  </span>
                  {active.rewardDiamonds > 0 ? (
                    <span className="inline-flex items-center gap-1">
                      <Gem className="h-3.5 w-3.5 text-blue-400" aria-hidden />
                      +{active.rewardDiamonds}
                    </span>
                  ) : null}
                </p>
              </div>
            </div>
            <div className="flex w-full flex-col gap-2 sm:w-auto sm:min-w-[9rem]">
              <button
                type="button"
                disabled={busy || !ready}
                onClick={onComplete}
                className={`cursor-pointer rounded-lg px-3 py-2 font-heading text-[11px] uppercase tracking-wide ${
                  ready
                    ? 'bg-primary text-primary-foreground'
                    : 'cursor-not-allowed border border-border bg-muted/40 text-muted-foreground'
                }`}
              >
                {t('tavernPage.jobs.complete')}
              </button>
              {!ready ? (
                <button
                  type="button"
                  disabled={busy}
                  onClick={onCancel}
                  className="cursor-pointer rounded-lg border border-border bg-muted/40 px-3 py-2 font-heading text-[11px] uppercase tracking-wide text-muted-foreground hover:bg-muted/60 disabled:opacity-50"
                >
                  {t('tavernPage.jobs.cancel')}
                </button>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}

      <ul className="space-y-3">
        {status.offers.map((offer) => {
          const isActiveOffer = active?.id === offer.id;
          const canStart = !active && !offer.started && !offer.completed;
          return (
            <li
              key={offer.id}
              className="rounded-xl border border-border bg-card px-4 py-4 sm:px-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-heading text-sm font-bold text-foreground sm:text-base">
                    {t(offer.titleKey)}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {t('tavernPage.jobs.duration', { minutes: offer.durationMinutes })}
                  </p>
                  <p className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <Coins className="h-3.5 w-3.5 text-primary" aria-hidden />
                      +{offer.rewardGold}
                    </span>
                    {offer.rewardDiamonds > 0 ? (
                      <span className="inline-flex items-center gap-1">
                        <Gem className="h-3.5 w-3.5 text-blue-400" aria-hidden />
                        +{offer.rewardDiamonds}
                      </span>
                    ) : null}
                  </p>
                </div>
                {offer.completed ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary">
                    <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />
                    {t('tavernPage.jobs.offerDone')}
                  </span>
                ) : isActiveOffer ? (
                  <span className="text-xs font-semibold text-primary">
                    {t('tavernPage.jobs.offerActive')}
                  </span>
                ) : canStart ? (
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => onStart(offer)}
                    className="cursor-pointer rounded-lg bg-primary px-3 py-2 font-heading text-[11px] uppercase tracking-wide text-primary-foreground disabled:opacity-50"
                  >
                    {t('tavernPage.jobs.start')}
                  </button>
                ) : (
                  <span className="text-xs text-muted-foreground">
                    {t('tavernPage.jobs.offerUnavailable')}
                  </span>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
