import { beforeEach, describe, expect, it, vi } from 'vitest';
import { claimWeeklyContract, fetchWeeklyContract } from '@/services/weeklyContractService';

vi.mock('@/lib/api/requestJson', () => ({
  requestJson: vi.fn(),
}));

import { requestJson } from '@/lib/api/requestJson';

const mockedRequestJson = vi.mocked(requestJson);

describe('weeklyContractService', () => {
  beforeEach(() => {
    mockedRequestJson.mockReset();
  });

  it('fetchWeeklyContract calls status endpoint', async () => {
    const status = {
      weekStart: '2026-08-18',
      weekEnd: '2026-08-24',
      type: 'missions' as const,
      targetValue: 12,
      progress: 0,
      complete: false,
      rewardClaimed: false,
      canClaim: false,
      rewards: { gold: 1300, diamonds: 2 },
      titleRewardCode: 'weekly_corsair',
      unclaimedCount: 0,
    };
    mockedRequestJson.mockResolvedValueOnce(status);

    const out = await fetchWeeklyContract();

    expect(out).toEqual(status);
    expect(mockedRequestJson).toHaveBeenCalledWith('/users/weekly-contracts/status', { method: 'GET' });
  });

  it('claimWeeklyContract posts to claim endpoint', async () => {
    const claimResult = {
      rewards: { gold: 1300, diamonds: 2 },
      titleGranted: true,
      titleCode: 'weekly_corsair',
      updatedUser: {
        gold: 5000,
        diamonds: 10,
        experiencePoints: 0,
        freeSkillPointsAvailable: 0,
        level: { name: '1', expToNextLevel: 220 },
      },
      status: {
        weekStart: '2026-08-18',
        weekEnd: '2026-08-24',
        type: 'missions' as const,
        targetValue: 12,
        progress: 12,
        complete: true,
        rewardClaimed: true,
        canClaim: false,
        rewards: { gold: 1300, diamonds: 2 },
        titleRewardCode: 'weekly_corsair',
        unclaimedCount: 0,
      },
    };
    mockedRequestJson.mockResolvedValueOnce(claimResult);

    const out = await claimWeeklyContract();

    expect(out).toEqual(claimResult);
    expect(mockedRequestJson).toHaveBeenCalledWith('/users/weekly-contracts/claim', { method: 'POST' });
  });
});
