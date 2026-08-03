import type { EnergyRefillInfoData } from '@/types/refill';

type TFn = (key: string, options?: Record<string, string | number>) => string;

type Props = {
  refillInfo: EnergyRefillInfoData | null;
  error: string | null;
  userGold: number;
  t: TFn;
};

export function EnergyRefillDialogContent({ refillInfo, error, userGold, t }: Props) {
  if (!refillInfo) {
    return <p className="text-center text-sm text-white/80">{t('energyRefillInfoLoading')}</p>;
  }

  return (
    <div className="space-y-3 text-center">
      <p className="text-sm leading-relaxed text-white/85 sm:text-base">
        {t('refillEnergyDescription', { cost: refillInfo.nextRefillCost })}
      </p>
      <p className="text-xs text-white/55">
        {t('refillsRemaining')}: {refillInfo.refillsRemaining}/2
      </p>
      {refillInfo.refillsUsed > 0 ? (
        <p className="text-xs font-semibold text-[hsl(43,72%,55%)]">
          {t('refillsUsed')}: {refillInfo.refillsUsed}/2
        </p>
      ) : null}
      {refillInfo.hasActiveMission ? (
        <div className="rounded-lg border border-amber-600/40 bg-amber-950/30 px-3 py-2 text-sm text-amber-100/90">
          {t('finishMissionFirst')}
        </div>
      ) : null}
      {error ? (
        <div className="rounded-lg border border-red-500/45 bg-red-950/35 px-3 py-2 text-left text-sm text-red-100">
          {error}
        </div>
      ) : null}
      {userGold < refillInfo.nextRefillCost ? (
        <p className="text-xs font-semibold text-red-300">{t('notEnoughGold')}</p>
      ) : null}
    </div>
  );
}
