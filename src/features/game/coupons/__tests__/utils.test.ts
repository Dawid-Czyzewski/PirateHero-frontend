import { describe, expect, it, vi } from 'vitest';
import { formatReward, formatRewardDescription } from '@/features/game/coupons/utils';
import type { CouponRewardDto } from '@/types/coupon';

const t = vi.fn((key: string, defaultOrSecond?: string) => {
  const map: Record<string, string> = {
    gold: 'Gold',
    diamonds: 'FC',
    boosters: 'Boost',
    days: 'd',
    itemLabel: 'Item',
  };
  if (map[key]) return map[key];
  if (typeof defaultOrSecond === 'string' && defaultOrSecond !== key) return defaultOrSecond;
  return key;
});

const itemNoRarity: CouponRewardDto = {
  type: 'ITEM',
  itemId: 1,
  itemName: 'Test',
  rarity: '',
  itemType: 'misc',
  item: { id: 1, name: 'Test', type: 'misc', rarity: 'common' },
};

describe('coupons/utils', () => {
  it('formatReward GOLD', () => {
    expect(formatReward({ type: 'GOLD', amount: 10 }, t)).toBe('10 Gold');
  });

  it('formatRewardDescription ITEM without rarity label', () => {
    expect(formatRewardDescription(itemNoRarity, t)).toBe('Item');
  });

  it('formatReward BOOSTER uses boosters label when no name', () => {
    const booster: CouponRewardDto = {
      type: 'BOOSTER',
      boosterTemplateId: 1,
      boosterName: '',
      durationDays: 3,
    };
    expect(formatReward(booster, t)).toContain('Boost');
    expect(formatReward(booster, t)).toContain('3');
  });
});
