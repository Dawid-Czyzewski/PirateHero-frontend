import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Anchor, Coins, Gem, Timer } from 'lucide-react';
import { toast } from 'sonner';
import { useUser } from '@/hooks/useUser';
import { ApiHttpError } from '@/lib/api/ApiHttpError';
import { patchUserFromRewardResponse } from '@/lib/game/patchUserFromRewardResponse';
import { queryKeys } from '@/lib/query/queryKeys';
import {
  cancelShipVoyage,
  completeShipVoyage,
  fetchShipVoyageStatus,
  startShipVoyage,
  type ShipVoyageOffer,
  type ShipVoyageStatus,
} from '@/services/shipVoyageService';

function formatRemaining(seconds: number): string {
  const s = Math.max(0, Math.floor(seconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const r = s % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${r}s`;
  return `${r}s`;
}

export function ShipViewVoyagesTab({
  isCaptain,
  onShipGoldChange,
}: {
  isCaptain: boolean;
  onShipGoldChange?: (gold: number, fame?: number) => void;
}) {
  const { t } = useTranslation();
  const { updateUser, fetchUserData } = useUser();
  const queryClient = useQueryClient();
  const [busy, setBusy] = useState(false);
  const [tick, setTick] = useState(0);

  const q = useQuery({
    queryKey: queryKeys.shipVoyages(),
    queryFn: fetchShipVoyageStatus,
    refetchInterval: 15_000,
  });

  useEffect(() => {
    if (!q.data?.activeVoyage || q.data.activeVoyage.readyToComplete) return;
    const id = window.setInterval(() => setTick((n) => n + 1), 1000);
    return () => window.clearInterval(id);
  }, [q.data?.activeVoyage?.id, q.data?.activeVoyage?.readyToComplete]);

  const status = q.data;
  const active = status?.activeVoyage ?? null;
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
          err instanceof ApiHttpError && err.message ? t(err.message) : t('shipVoyages.actionFailed');
        toast.error(msg);
      } finally {
        setBusy(false);
      }
    },
    [busy, t]
  );

  const onStart = (offer: ShipVoyageOffer) =>
    void run(async () => {
      const next = await startShipVoyage(offer.durationSeconds);
      queryClient.setQueryData(queryKeys.shipVoyages(), next);
      onShipGoldChange?.(next.treasuryGold);
      toast.success(t('shipVoyages.started'));
      setTick(0);
      void fetchUserData();
    });

  const onComplete = () =>
    void run(async () => {
      const result = await completeShipVoyage();
      queryClient.setQueryData(queryKeys.shipVoyages(), result.status);
      updateUser(patchUserFromRewardResponse(result.updatedUser));
      onShipGoldChange?.(result.updatedShip.gold, result.updatedShip.famePoints);
      toast.success(
        t('shipVoyages.completed', {
          gold: result.rewards.personalGold,
          exp: result.rewards.personalExp,
        })
      );
      setTick(0);
      void fetchUserData();
    });

  const onCancel = () =>
    void run(async () => {
      const result = await cancelShipVoyage();
      queryClient.setQueryData(queryKeys.shipVoyages(), result.status);
      onShipGoldChange?.(result.updatedShip.gold, result.updatedShip.famePoints);
      toast.success(t('shipVoyages.cancelled', { gold: result.refundedGold }));
      setTick(0);
      void fetchUserData();
    });

  if (q.isPending) {
    return <p className="text-sm text-muted-foreground">{t('loading')}</p>;
  }
  if (q.isError || !status) {
    return (
      <div className="space-y-2">
        <p className="text-sm text-destructive">{t('shipVoyages.loadFailed')}</p>
        <button type="button" className="text-sm text-primary underline" onClick={() => void q.refetch()}>
          {t('retry')}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Anchor className="h-4 w-4 text-primary" aria-hidden />
        <h3 className="text-sm font-semibold">{t('shipVoyages.title')}</h3>
        <span className="ml-auto inline-flex items-center gap-1 text-xs text-muted-foreground">
          <Coins className="h-3.5 w-3.5 text-primary" aria-hidden />
          {status.treasuryGold.toLocaleString()}
        </span>
      </div>
      <p className="text-xs text-muted-foreground">{t('shipVoyages.subtitle')}</p>

      {active ? (
        <div className="space-y-3 rounded-lg border border-primary/25 bg-primary/5 p-3">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Timer className="h-4 w-4 text-primary" aria-hidden />
            {ready ? t('shipVoyages.ready') : t('shipVoyages.inProgress', { time: formatRemaining(remaining) })}
          </div>
          <p className="text-xs text-muted-foreground">
            {t('shipVoyages.enrolled', { count: active.enrolledCount })}
            {active.viewerEnrolled ? ` · ${t('shipVoyages.youAreSailing')}` : ''}
          </p>
          <div className="flex flex-wrap gap-2">
            {(ready || active.viewerEnrolled || isCaptain) && (
              <button
                type="button"
                disabled={busy || !ready}
                onClick={onComplete}
                className="rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground disabled:opacity-50"
              >
                {t('shipVoyages.complete')}
              </button>
            )}
            {isCaptain && !ready ? (
              <button
                type="button"
                disabled={busy}
                onClick={onCancel}
                className="rounded-md border border-border px-3 py-1.5 text-xs font-semibold hover:bg-muted/40 disabled:opacity-50"
              >
                {t('shipVoyages.cancel')}
              </button>
            ) : null}
          </div>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-3">
          {status.offers.map((offer) => (
            <OfferCard
              key={offer.durationSeconds}
              offer={offer}
              isCaptain={isCaptain}
              busy={busy}
              treasuryGold={status.treasuryGold}
              onStart={() => onStart(offer)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function OfferCard({
  offer,
  isCaptain,
  busy,
  treasuryGold,
  onStart,
}: {
  offer: ShipVoyageOffer;
  isCaptain: boolean;
  busy: boolean;
  treasuryGold: number;
  onStart: () => void;
}) {
  const { t } = useTranslation();
  const canAfford = treasuryGold >= offer.goldCost;

  return (
    <div className="space-y-2 rounded-lg border border-border/50 bg-card/40 p-3">
      <p className="text-sm font-semibold">{t('shipVoyages.hoursOffer', { hours: offer.hours })}</p>
      <ul className="space-y-1 text-[11px] text-muted-foreground">
        <li className="inline-flex items-center gap-1">
          <Coins className="h-3 w-3 text-primary" aria-hidden />
          {t('shipVoyages.cost', { gold: offer.goldCost })}
        </li>
        <li>
          {t('shipVoyages.estGold', { gold: offer.estimatedGoldPool })}
        </li>
        <li>
          {t('shipVoyages.estExp', { exp: offer.estimatedExpPool })}
        </li>
        <li className="inline-flex items-center gap-1">
          <Gem className="h-3 w-3 text-amber-400" aria-hidden />
          {t('shipVoyages.estFame', { fame: offer.estimatedShipFame })}
        </li>
      </ul>
      {isCaptain ? (
        <button
          type="button"
          disabled={busy || !canAfford}
          onClick={onStart}
          className="w-full rounded-md bg-primary/90 px-2 py-1.5 text-xs font-semibold text-primary-foreground disabled:opacity-50"
        >
          {!canAfford ? t('shipVoyages.needTreasury') : t('shipVoyages.start')}
        </button>
      ) : (
        <p className="text-[11px] text-muted-foreground">{t('shipVoyages.captainOnly')}</p>
      )}
    </div>
  );
}

export type { ShipVoyageStatus };
