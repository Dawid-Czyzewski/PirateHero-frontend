import type { FightRefillInfoData } from '@/types/refill';

type TFn = (key: string, options?: Record<string, string | number>) => string;

function fightRefillDailyCap(info: FightRefillInfoData): number {
  if (typeof info.maxDailyRefills === 'number' && info.maxDailyRefills > 0) {
    return info.maxDailyRefills;
  }
  return Math.max(1, info.refillsUsed + info.refillsRemaining);
}

type Props = {
  refillInfo: FightRefillInfoData | null;
  error: string | null;
  userGold: number;
  t: TFn;
};

export function FightRefillDialogContent({ refillInfo, error, userGold, t }: Props) {
  if (!refillInfo) {
    return (
      <p className="text-center text-sm text-white/80">{t('fightRefillInfoLoading')}</p>
    );
  }

  const dailyCap = fightRefillDailyCap(refillInfo);

  return (
    <div className="space-y-3 text-center">
      <p className="text-sm leading-relaxed text-white/85 sm:text-base">
        {t('refillFightPointsDescription', { cost: refillInfo.nextRefillCost })}
      </p>
      <p className="text-xs text-white/55">
        {t('refillsRemaining')}: {refillInfo.refillsRemaining}/{dailyCap}
      </p>
      {refillInfo.refillsUsed > 0 ? (
        <p className="text-xs font-semibold text-[hsl(43,72%,55%)]">
          {t('refillsUsed')}: {refillInfo.refillsUsed}/{dailyCap}
        </p>
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
