import { describe, expect, it } from 'vitest';
import {
  patchGameShopAfterSell,
  wearableFromShopItem,
} from '@/features/game/store/shop/shopUserCachePatch';
import type { GameUser } from '@/types/gameUser';
import type { ShopItem } from '@/features/game/store/shop/types';

const sampleItem: ShopItem = {
  id: 42,
  nameKey: 'items.test',
  slotId: 'weapon',
  rarity: 'rare',
  price: 100,
  imageKey: 'weapon-1',
  stats: [{ statId: 'strength', value: 5 }],
};

function baseUser(overrides: Partial<GameUser> = {}): GameUser {
  return {
    id: 'u1',
    username: 'tester',
    gold: 500,
    gameShop: {
      gold: 500,
      shop: [null, null, null, null, null, null, null, null, null],
      inventory: [sampleItem, null],
      equipped: { weapon: sampleItem },
      refresh: { isFreeRefreshAvailable: true, refreshCost: 50 },
    },
    ...overrides,
  } as GameUser;
}

describe('shopUserCachePatch', () => {
  it('wearableFromShopItem maps stats for optimistic profile patches', () => {
    const w = wearableFromShopItem(sampleItem);
    expect(w.id).toBe(42);
    expect(w.type).toBe('weapon');
    expect(w.statistics?.strongPoints).toBe(5);
  });

  it('patchGameShopAfterSell clears inventory slot', () => {
    const prev = baseUser();
    const next = patchGameShopAfterSell(prev, sampleItem, 'inventory');
    expect(next.gameShop?.inventory[0]).toBeNull();
    expect(next.gameShop?.equipped?.weapon).toEqual(sampleItem);
  });

  it('patchGameShopAfterSell clears equipped slot', () => {
    const prev = baseUser();
    const next = patchGameShopAfterSell(prev, sampleItem, 'equipped');
    expect(next.gameShop?.equipped?.weapon).toBeUndefined();
  });
});
