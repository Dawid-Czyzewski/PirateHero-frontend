import { beforeEach, describe, expect, it, vi } from 'vitest';
import { upgradeWearableItem } from '@/services/wearableUpgradeService';

vi.mock('@/lib/api/requestJson', () => ({
  requestJson: vi.fn(),
}));

import { requestJson } from '@/lib/api/requestJson';

const mockedRequestJson = vi.mocked(requestJson);

describe('wearableUpgradeService', () => {
  beforeEach(() => {
    mockedRequestJson.mockReset();
  });

  it('upgradeWearableItem posts itemId to game-shop upgrade endpoint', async () => {
    const payload = {
      gold: 99_000,
      upgrade: {
        itemId: 42,
        upgradeLevel: 1,
        maxUpgradeLevel: 3,
        goldSpent: 100,
        price: 125,
        statistics: { strongPoints: 6 },
        gold: 99_000,
      },
    };
    mockedRequestJson.mockResolvedValueOnce(payload);

    const out = await upgradeWearableItem(42);

    expect(out).toEqual(payload);
    expect(mockedRequestJson).toHaveBeenCalledWith('/game-shop/upgrade', {
      method: 'POST',
      body: { itemId: 42 },
    });
  });
});
