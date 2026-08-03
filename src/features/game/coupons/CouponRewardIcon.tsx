import { Coins, Gem, Package, Sparkles } from 'lucide-react';
import type { CouponRewardDto } from '@/types/coupon';

function rewardVisualKind(
  reward: CouponRewardDto | null | undefined
): 'gold' | 'diamonds' | 'booster' | 'item' {
  if (!reward) return 'gold';
  switch (reward.type) {
    case 'GOLD':
      return 'gold';
    case 'diamonds':
      return 'diamonds';
    case 'BOOSTER':
      return 'booster';
    case 'ITEM':
    default:
      return 'item';
  }
}

export type CouponRewardIconProps = {
  reward: CouponRewardDto | null | undefined;
  className?: string;
};

export function CouponRewardIcon({ reward, className = 'h-5 w-5 shrink-0' }: CouponRewardIconProps) {
  const k = rewardVisualKind(reward);
  const cn = className;
  switch (k) {
    case 'gold':
      return <Coins className={`${cn} text-primary`} aria-hidden />;
    case 'diamonds':
      return <Gem className={`${cn} text-purple-400`} aria-hidden />;
    case 'booster':
      return <Sparkles className={`${cn} text-amber-400`} aria-hidden />;
    default:
      return <Package className={`${cn} text-emerald-400`} aria-hidden />;
  }
}
