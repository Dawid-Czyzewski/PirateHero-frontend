import { describe, expect, it } from 'vitest';
import { buildOptimisticDailyRewardStatus } from '../applyDailyRewardOptimistic';
import type { DailyRewardStatus } from '@/types/dailyReward';

function mockStatus(overrides: Partial<DailyRewardStatus> = {}): DailyRewardStatus {
  const schedule = Array.from({ length: 30 }, (_, i) => ({
    day: i + 1,
    rewards: [{ type: 'gold' as const, amount: 100 }],
  }));
  return {
    canClaim: true,
    claimedToday: false,
    currentDay: 3,
    highestClaimedDay: 2,
    totalDays: 30,
    schedule,
    todayReward: { day: 3, rewards: [{ type: 'experience', amount: 40 }] },
    ...overrides,
  };
}

describe('buildOptimisticDailyRewardStatus', () => {
  it('marks claimed and advances to next day', () => {
    const next = buildOptimisticDailyRewardStatus(mockStatus());
    expect(next.canClaim).toBe(false);
    expect(next.claimedToday).toBe(true);
    expect(next.currentDay).toBe(4);
    expect(next.highestClaimedDay).toBe(3);
  });

  it('wraps from day 30 to day 1', () => {
    const next = buildOptimisticDailyRewardStatus(mockStatus({ currentDay: 30, highestClaimedDay: 29 }));
    expect(next.currentDay).toBe(1);
    expect(next.highestClaimedDay).toBe(30);
  });
});
