import { describe, expect, it } from 'vitest';
import { dungeonRewardItemToShopItem } from './dungeonRewardItemToShopItem';

describe('dungeonRewardItemToShopItem', () => {
  it('maps API item payload to ShopItem with stats and slot', () => {
    const shop = dungeonRewardItemToShopItem({
      id: 42,
      name: 'Dungeon Reward Lv.5 #abc',
      nameKey: 'items.genericLoot',
      imageKey: 'sword_02',
      type: 'weapon',
      rarity: 'RARE',
      price: 120,
      statistics: {
        strongPoints: 10,
        agilityPoints: 5,
        healthPoints: 20,
        criticalChancePoints: 3,
        intelligencePoints: 2,
      },
    });

    expect(shop.id).toBe(42);
    expect(shop.displayLabel).toBe('Dungeon Reward Lv.5 #abc');
    expect(shop.imageKey).toBe('sword_02');
    expect(shop.slotId).toBe('weapon');
    expect(shop.rarity).toBe('rare');
    expect(shop.stats.length).toBeGreaterThan(0);
  });
});
