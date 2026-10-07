import { beforeEach, describe, expect, it, vi } from 'vitest';
import { claimWeekendTournament, fetchWeekendTournament } from '@/services/weekendTournamentService';

vi.mock('@/lib/api/requestJson', () => ({
  requestJson: vi.fn(),
}));

import { requestJson } from '@/lib/api/requestJson';

const mockedRequestJson = vi.mocked(requestJson);

describe('weekendTournamentService', () => {
  beforeEach(() => {
    mockedRequestJson.mockReset();
  });

  it('fetches status', async () => {
    mockedRequestJson.mockResolvedValueOnce({
      active: true,
      points: 2,
      unclaimedCount: 0,
      leaderboard: [],
    });
    await fetchWeekendTournament();
    expect(mockedRequestJson).toHaveBeenCalledWith('/users/weekend-tournament/status', {
      method: 'GET',
    });
  });

  it('claims', async () => {
    mockedRequestJson.mockResolvedValueOnce({
      rank: 5,
      rewards: { gold: 1, diamonds: 1, band: 'participation' },
      titleGranted: false,
      titleCode: null,
      updatedUser: {
        gold: 1,
        diamonds: 1,
        experiencePoints: 0,
        freeSkillPointsAvailable: 0,
        level: { name: '1', expToNextLevel: 100 },
      },
      status: { unclaimedCount: 0 },
    });
    await claimWeekendTournament();
    expect(mockedRequestJson).toHaveBeenCalledWith('/users/weekend-tournament/claim', {
      method: 'POST',
    });
  });
});
