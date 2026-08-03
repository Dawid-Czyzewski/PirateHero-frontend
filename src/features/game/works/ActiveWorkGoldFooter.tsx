import { Coins } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { REWARD_GOLD_CLASS } from '@/features/game/missions/missionRewardClasses';

type Props = {
  goldAmountBase: number;
  goldGenitiveLabel: string;
  caption: string;
  workShipGoldExtra?: number;
  workBoosterGoldExtra?: number;
};

export function ActiveWorkGoldFooter({
  goldAmountBase,
  goldGenitiveLabel,
  caption,
  workShipGoldExtra,
  workBoosterGoldExtra,
}: Props) {
  const { t } = useTranslation();
  const baseStr = goldAmountBase.toLocaleString();

  let rewardLine = `${baseStr} ${goldGenitiveLabel}`;
  if (workShipGoldExtra != null && workShipGoldExtra > 0) {
    rewardLine += ` · ${String(t('shipBonus.plusGoldFromShip', { amount: workShipGoldExtra }))}`;
  }
  if (workBoosterGoldExtra != null && workBoosterGoldExtra > 0) {
    rewardLine += ` · ${String(t('shopBooster.workBoosterGoldAfterClaimSegment', { extra: workBoosterGoldExtra }))}`;
  }

  return (
    <div className="mt-4 border-t border-white/[0.07] pt-3">
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40">{caption}</p>
      <div className="mt-1">
        <span className="inline-flex min-w-0 max-w-full items-center gap-1.5 overflow-x-auto whitespace-nowrap">
          <Coins className="h-3.5 w-3.5 shrink-0 text-[hsl(43,78%,52%)]" strokeWidth={2} aria-hidden />
          <span className={REWARD_GOLD_CLASS}>{rewardLine}</span>
        </span>
      </div>
    </div>
  );
}
