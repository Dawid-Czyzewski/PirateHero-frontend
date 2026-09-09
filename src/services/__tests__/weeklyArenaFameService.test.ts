import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  claimWeeklyArenaFameTier,
  fetchWeeklyArenaFame,
} from '@/services/weeklyArenaFameService';

vi.mock('@/lib/api/requestJson', () => ({
  requestJson: vi.fn(),
}));

import { requestJson } from '@/lib/api/requestJson';

const mockedRequestJson = vi.mocked(requestJson);

describe('weeklyArenaFameService', () => {
  beforeEach(() => {
    mockedRequestJson.mockReset();
  });

  it('fetches status', async () => {
    mockedRequestJson.mockResolvedValueOnce({
      weekStart: '2026-09-07',
      weekEnd: '2026-09-13',
      fameEarned: 90,
      tiers: [],
      unclaimedCount: 1,
    });

    const status = await fetchWeeklyArenaFame();
    expect(mockedRequestJson).toHaveBeenCalledWith('/users/weekly-arena-fame/status', {
      method: 'GET',
    });
    expect(status.fameEarned).toBe(90);
  });

  it('claims a tier', async () => {
    mockedRequestJson.mockResolvedValueOnce({
      tier: 1,
      rewards: { gold: 100, diamonds: 1 },
      titleGranted: true,
      titleCode: 'weekly_arena_fighter',
      updatedUser: {
        gold: 1,
        diamonds: 1,
        experiencePoints: 0,
        freeSkillPointsAvailable: 0,
        level: { name: '1', expToNextLevel: 100 },
      },
      status: {
        weekStart: '2026-09-07',
        weekEnd: '2026-09-13',
        fameEarned: 90,
        tiers: [],
        unclaimedCount: 0,
      },
    });

    const result = await claimWeeklyArenaFameTier(1);
    expect(mockedRequestJson).toHaveBeenCalledWith('/users/weekly-arena-fame/claim', {
      method: 'POST',
      body: JSON.stringify({ tier: 1 }),
    });
    expect(result.tier).toBe(1);
  });
});
