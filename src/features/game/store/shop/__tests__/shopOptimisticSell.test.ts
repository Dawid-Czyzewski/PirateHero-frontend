import { describe, expect, it } from 'vitest';
import { applyOptimisticSellToUserCache } from '@/features/game/store/shop/shopUserCachePatch';
import type { GameUser } from '@/types/gameUser';
import type { ShopItem } from '@/features/game/store/shop/types';

const item: ShopItem = {
  id: 7,
  nameKey: 'items.blade',
  slotId: 'weapon',
  rarity: 'rare',
  price: 50,
  stats: [],
  storageSlotId: 101,
};

function userWithChest(): GameUser {
  return {
    id: 'u1',
    username: 't',
    gold: 100,
    storage: {
      id: 1,
      slots: [{ id: 101, slotNumber: 1, item: { id: 7 }, wearableItem: { id: 7 } }],
    },
    gameShop: {
      gold: 100,
      shop: Array(9).fill(null),
      inventory: [item, null],
      equipped: {},
      refresh: { isFreeRefreshAvailable: true, refreshCost: 10 },
    },
  } as GameUser;
}

describe('applyOptimisticSellToUserCache', () => {
  it('clears storage slot and shop inventory for chest sell', () => {
    const next = applyOptimisticSellToUserCache(userWithChest(), item, 'inventory');
    expect(next.storage?.slots?.[0]?.item).toBeNull();
    expect(next.gameShop?.inventory[0]).toBeNull();
  });
});
