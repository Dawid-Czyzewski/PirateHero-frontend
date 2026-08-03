import { describe, expect, it } from 'vitest';
import { captainQuestItemRewardToShopItem } from './questClaimItemToShopItem';
import type { CaptainQuestReward } from './captainQuestTypes';

function itemReward(partial: Partial<Extract<CaptainQuestReward, { type: 'item' }>>): Extract<
  CaptainQuestReward,
  { type: 'item' }
> {
  return {
    type: 'item',
    rarity: 'rare',
    ...partial,
  };
}

describe('captainQuestItemRewardToShopItem', () => {
  it('maps claim payload to ShopItem (slot, rarity, stats, displayLabel)', () => {
    const shop = captainQuestItemRewardToShopItem(
      itemReward({
        itemId: 7,
        itemName: 'Test Helm',
        itemType: 'helmet',
        imageKey: 'helm_01',
        rarity: 'epic',
        price: 100,
        statistics: { strongPoints: 2, agilityPoints: 0, healthPoints: 5, criticalChancePoints: 0, intelligencePoints: 1 },
      })
    );
    expect(shop).toMatchObject({
      id: 7,
      nameKey: 'items.genericLoot',
      displayLabel: 'Test Helm',
      imageKey: 'helm_01',
      slotId: 'helmet',
      price: 100,
      rarity: 'rare',
    });
    const byId = Object.fromEntries(shop.stats.map((s) => [s.statId, s.value]));
    expect(byId.strength).toBe(2);
    expect(byId.health).toBe(5);
    expect(byId.intelligence).toBe(1);
    expect(Object.keys(byId).sort()).toEqual(['health', 'intelligence', 'strength']);
  });

  it('uses itemNameKey when no display name', () => {
    const shop = captainQuestItemRewardToShopItem(
      itemReward({
        itemNameKey: 'questTasksPage.rewards.randomItem',
        rarity: 'common',
      })
    );
    expect(shop.nameKey).toBe('questTasksPage.rewards.randomItem');
    expect(shop.displayLabel).toBeUndefined();
  });

  it('defaults slot to helmet when type unknown', () => {
    const shop = captainQuestItemRewardToShopItem(itemReward({ itemName: 'X', itemType: 'unknown_slot' }));
    expect(shop.slotId).toBe('helmet');
  });
});
