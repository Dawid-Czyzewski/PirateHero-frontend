import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  cancelTavernJob,
  completeTavernJob,
  fetchTavernStatus,
  playTavernDice,
  startTavernJob,
} from '@/services/tavernService';

vi.mock('@/lib/api/requestJson', () => ({
  requestJson: vi.fn(),
}));

import { requestJson } from '@/lib/api/requestJson';

const mockedRequestJson = vi.mocked(requestJson);

describe('tavernService', () => {
  beforeEach(() => {
    mockedRequestJson.mockReset();
  });

  it('fetches status', async () => {
    mockedRequestJson.mockResolvedValueOnce({
      offers: [],
      activeJob: null,
      unclaimedCount: 0,
    });
    await fetchTavernStatus();
    expect(mockedRequestJson).toHaveBeenCalledWith('/users/tavern/status', { method: 'GET' });
  });

  it('plays dice', async () => {
    mockedRequestJson.mockResolvedValueOnce({
      won: true,
      tied: false,
      playerRoll: 10,
      dealerRoll: 5,
      goldAfter: 190,
      payoutGold: 190,
    });
    await playTavernDice(100);
    expect(mockedRequestJson).toHaveBeenCalledWith('/games/tavern/dice/play', {
      method: 'POST',
      body: { stake: 100 },
    });
  });

  it('starts job', async () => {
    mockedRequestJson.mockResolvedValueOnce({
      offers: [],
      activeJob: null,
      unclaimedCount: 0,
    });
    await startTavernJob(3);
    expect(mockedRequestJson).toHaveBeenCalledWith('/users/tavern/jobs/start', {
      method: 'POST',
      body: { jobId: 3 },
    });
  });

  it('completes job', async () => {
    mockedRequestJson.mockResolvedValueOnce({
      rewardGold: 25,
      rewardDiamonds: 0,
      status: { offers: [], activeJob: null, unclaimedCount: 0 },
    });
    await completeTavernJob();
    expect(mockedRequestJson).toHaveBeenCalledWith('/users/tavern/jobs/complete', {
      method: 'POST',
    });
  });

  it('cancels job', async () => {
    mockedRequestJson.mockResolvedValueOnce({
      offers: [],
      activeJob: null,
      unclaimedCount: 0,
    });
    await cancelTavernJob();
    expect(mockedRequestJson).toHaveBeenCalledWith('/users/tavern/jobs/cancel', {
      method: 'POST',
    });
  });
});
