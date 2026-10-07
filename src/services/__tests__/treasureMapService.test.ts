import { beforeEach, describe, expect, it, vi } from 'vitest';
import { claimTreasureMapChest, fetchTreasureMap } from '@/services/treasureMapService';

vi.mock('@/lib/api/requestJson', () => ({
  requestJson: vi.fn(),
}));

import { requestJson } from '@/lib/api/requestJson';

const mockedRequestJson = vi.mocked(requestJson);

describe('treasureMapService', () => {
  beforeEach(() => {
    mockedRequestJson.mockReset();
  });

  it('fetches status', async () => {
    mockedRequestJson.mockResolvedValueOnce({
      steps: [],
      unclaimedCount: 0,
    });
    await fetchTreasureMap();
    expect(mockedRequestJson).toHaveBeenCalledWith('/users/treasure-map/status', { method: 'GET' });
  });

  it('claims chest', async () => {
    mockedRequestJson.mockResolvedValueOnce({
      rewards: { gold: 100, diamonds: 2 },
      item: null,
      updatedUser: {
        gold: 1,
        diamonds: 1,
        experiencePoints: 0,
        freeSkillPointsAvailable: 0,
        level: { name: '1', expToNextLevel: 100 },
      },
      status: { unclaimedCount: 0 },
    });
    await claimTreasureMapChest();
    expect(mockedRequestJson).toHaveBeenCalledWith('/users/treasure-map/claim', { method: 'POST' });
  });
});
