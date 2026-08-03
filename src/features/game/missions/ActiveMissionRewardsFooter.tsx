import { Coins, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { REWARD_GOLD_CLASS, REWARD_XP_CLASS } from '@/features/game/missions/missionRewardClasses';

type Props = {
  xp: number;
  gold: number;
  goldGenitiveLabel: string;
  expLabel: string;
  missionShipGoldExtra?: number;
  missionShipExpExtra?: number;
  missionBoosterGoldExtra?: number;
  missionBoosterExpExtra?: number;
  missionBoosterPercent?: number;
};

const ROW = 'inline-flex min-w-0 max-w-full items-center gap-1.5 overflow-x-auto whitespace-nowrap';

export function ActiveMissionRewardsFooter({
  xp,
  gold,
  goldGenitiveLabel,
  expLabel,
  missionShipGoldExtra,
  missionShipExpExtra,
  missionBoosterGoldExtra,
  missionBoosterExpExtra,
  missionBoosterPercent,
}: Props) {
  const { t } = useTranslation();
  const pct = missionBoosterPercent;
  const shipGoldSeg =
    missionShipGoldExtra != null && missionShipGoldExtra > 0
      ? ` · ${String(t('shipBonus.plusGoldFromShip', { amount: missionShipGoldExtra }))}`
      : '';
  const shipExpSeg =
    missionShipExpExtra != null && missionShipExpExtra > 0
      ? ` · ${String(t('shipBonus.plusExpFromShip', { amount: missionShipExpExtra, expUnit: expLabel }))}`
      : '';
  const goldSuffix =
    missionBoosterGoldExtra != null && missionBoosterGoldExtra > 0 && pct != null
      ? t('shopBooster.missionGoldExtraSuffix', { amount: missionBoosterGoldExtra, percent: pct })
      : '';
  const expSuffix =
    missionBoosterExpExtra != null && missionBoosterExpExtra > 0 && pct != null
      ? t('shopBooster.missionExpExtraSuffix', {
          amount: missionBoosterExpExtra,
          expUnit: expLabel,
          percent: pct,
        })
      : '';

  return (
    <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-white/[0.07] pt-3">
      <span className={ROW}>
        <Coins className="h-3.5 w-3.5 shrink-0 text-[hsl(43,78%,52%)]" strokeWidth={2} aria-hidden />
        <span className={REWARD_GOLD_CLASS}>
          {gold} {goldGenitiveLabel}
          {shipGoldSeg}
          {goldSuffix}
        </span>
      </span>
      <span className={ROW}>
        <Sparkles className="h-3.5 w-3.5 shrink-0 text-[hsl(142,65%,48%)]" strokeWidth={2} aria-hidden />
        <span className={REWARD_XP_CLASS}>
          {xp} {expLabel}
          {shipExpSeg}
          {expSuffix}
        </span>
      </span>
    </div>
  );
}
