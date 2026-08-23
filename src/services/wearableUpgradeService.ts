import { requestJson } from '@/lib/api/requestJson';

export type WearableUpgradeResult = {
  itemId: number;
  upgradeLevel: number;
  maxUpgradeLevel: number;
  goldSpent: number;
  price: number;
  statistics: Record<string, number>;
  gold: number;
};

export async function upgradeWearableItem(itemId: number): Promise<{
  gold?: number;
  upgrade?: WearableUpgradeResult;
}> {
  return requestJson('/game-shop/upgrade', {
    method: 'POST',
    body: { itemId },
  });
}
