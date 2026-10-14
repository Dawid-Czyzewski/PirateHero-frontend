import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Coins, Gem, Timer } from 'lucide-react';
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
      <div className="space-y-2">
        <p className="text-sm text-destructive">{t('tavernPage.jobs.loadFailed')}</p>
        <button
          type="button"
          className="text-sm text-primary underline"
          onClick={() => void q.refetch()}
        >
          {t('tavernPage.jobs.retry')}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5" aria-label={t('tavernPage.jobs.ariaLabel')}>
      <p className="text-sm text-muted-foreground">{t('tavernPage.jobs.subtitle')}</p>

      {active ? (
        <div className="space-y-3 rounded-lg border border-primary/25 bg-primary/5 p-4">
          <p className="text-base font-semibold">{t(active.titleKey)}</p>
          <div className="flex items-center gap-2 text-sm font-medium">
            <Timer className="h-4 w-4 text-primary" aria-hidden />
            {ready
              ? t('tavernPage.jobs.ready')
              : t('tavernPage.jobs.inProgress', { time: formatRemaining(remaining) })}
          </div>
          <p className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
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
          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              disabled={busy || !ready}
              onClick={onComplete}
              className="w-full rounded-lg bg-primary px-4 py-3 text-sm font-bold uppercase tracking-wide text-primary-foreground disabled:opacity-50 sm:flex-1"
            >
              {t('tavernPage.jobs.complete')}
            </button>
            {!ready ? (
              <button
                type="button"
                disabled={busy}
                onClick={onCancel}
                className="w-full rounded-lg border border-border px-4 py-3 text-sm font-semibold text-muted-foreground hover:bg-muted/30 disabled:opacity-50 sm:flex-1"
              >
                {t('tavernPage.jobs.cancel')}
              </button>
            ) : null}
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
              className={`space-y-3 rounded-lg border px-4 py-4 ${
                isActiveOffer ? 'border-primary/40 bg-primary/5' : 'border-border/50 bg-card/20'
              }`}
            >
              <div className="space-y-1">
                <p className="text-base font-semibold">{t(offer.titleKey)}</p>
                <p className="text-xs text-muted-foreground">
                  {t('tavernPage.jobs.duration', { minutes: offer.durationMinutes })}
                </p>
                <p className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
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
                <p className="text-sm text-emerald-400">{t('tavernPage.jobs.offerDone')}</p>
              ) : isActiveOffer ? (
                <p className="text-sm text-primary">{t('tavernPage.jobs.offerActive')}</p>
              ) : canStart ? (
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => onStart(offer)}
                  className="w-full rounded-lg bg-primary px-4 py-3 text-sm font-bold uppercase tracking-wide text-primary-foreground disabled:opacity-50"
                >
                  {t('tavernPage.jobs.start')}
                </button>
              ) : (
                <p className="text-sm text-muted-foreground">{t('tavernPage.jobs.offerUnavailable')}</p>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
