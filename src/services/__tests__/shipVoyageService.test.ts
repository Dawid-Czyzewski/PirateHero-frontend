import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fetchShipVoyageStatus, startShipVoyage } from '@/services/shipVoyageService';

vi.mock('@/lib/api/requestJson', () => ({
  requestJson: vi.fn(),
}));

import { requestJson } from '@/lib/api/requestJson';

const mockedRequestJson = vi.mocked(requestJson);

describe('shipVoyageService', () => {
  beforeEach(() => {
    mockedRequestJson.mockReset();
  });

  it('fetches voyage status', async () => {
    mockedRequestJson.mockResolvedValueOnce({
      shipId: 1,
      isOwner: true,
      treasuryGold: 500,
      missionsUpgrade: 2,
      offers: [],
      activeVoyage: null,
    });
    await fetchShipVoyageStatus();
    expect(mockedRequestJson).toHaveBeenCalledWith('/ships/voyages/status', { method: 'GET' });
  });

  it('starts a voyage', async () => {
    mockedRequestJson.mockResolvedValueOnce({
      shipId: 1,
      isOwner: true,
      treasuryGold: 100,
      missionsUpgrade: 0,
      offers: [],
      activeVoyage: { id: 9 },
    });
    await startShipVoyage(7200);
    expect(mockedRequestJson).toHaveBeenCalledWith('/ships/voyages/start', {
      method: 'POST',
      body: JSON.stringify({ durationSeconds: 7200 }),
    });
  });
});
