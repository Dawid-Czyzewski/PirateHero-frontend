import { beforeEach, describe, expect, it, vi } from 'vitest';
import { claimBestiaryTrophy, fetchBestiaryTrophies } from '@/services/bestiaryTrophyService';

vi.mock('@/lib/api/requestJson', () => ({
  requestJson: vi.fn(),
}));

import { requestJson } from '@/lib/api/requestJson';

const mockedRequestJson = vi.mocked(requestJson);

describe('bestiaryTrophyService', () => {
  beforeEach(() => {
    mockedRequestJson.mockReset();
  });

  it('fetchBestiaryTrophies calls status endpoint', async () => {
    const status = {
      discoveredCount: 0,
      total: 50,
      trophies: [],
      unclaimedCount: 0,
    };
    mockedRequestJson.mockResolvedValueOnce(status);

    const out = await fetchBestiaryTrophies();

    expect(out).toEqual(status);
    expect(mockedRequestJson).toHaveBeenCalledWith('/users/bestiary/trophies', { method: 'GET' });
  });

  it('claimBestiaryTrophy posts to claim endpoint', async () => {
    const result = {
      rewards: { gold: 100, diamonds: 1 },
      titleGranted: false,
      titleCode: null,
      updatedUser: {
        gold: 1,
        diamonds: 1,
        experiencePoints: 0,
        freeSkillPointsAvailable: 0,
        level: { name: '1', expToNextLevel: 220 },
      },
      status: { discoveredCount: 13, total: 50, trophies: [], unclaimedCount: 0 },
    };
    mockedRequestJson.mockResolvedValueOnce(result);

    const out = await claimBestiaryTrophy('bestiary_trophy_25');

    expect(out).toEqual(result);
    expect(mockedRequestJson).toHaveBeenCalledWith('/users/bestiary/trophies/bestiary_trophy_25/claim', {
      method: 'POST',
    });
  });
});
