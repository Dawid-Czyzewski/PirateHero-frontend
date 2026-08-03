import type { ItemStats } from '@/data/gameItems';
import type { CharacterStatKey } from '@/features/game/character/characterSkillPoints';
import type { ShopItem, ShopSlotId, ShopStatId } from './types';

const SHOP_STAT_TO_CHARACTER: Record<ShopStatId, CharacterStatKey> = {
  strength: 'strength',
  defense: 'endurance',
  health: 'endurance',
  speed: 'agility',
  agility: 'agility',
  luck: 'luck',
  intelligence: 'intelligence',
};

export function aggregateCharacterBonusesFromEquipped(
  equipped: Partial<Record<ShopSlotId, ShopItem>>
): Record<CharacterStatKey, number> {
  const acc: Record<CharacterStatKey, number> = {
    strength: 0,
    agility: 0,
    endurance: 0,
    intelligence: 0,
    luck: 0,
  };
  for (const item of Object.values(equipped)) {
    if (!item) continue;
    for (const s of item.stats) {
      const key = SHOP_STAT_TO_CHARACTER[s.statId];
      if (key) acc[key] += s.value;
    }
  }
  return acc;
}

export function computeShopPreviewTotals(
  equipped: Partial<Record<ShopSlotId, ShopItem>>,
  baseStats: Required<ItemStats>,
  previewItem: ShopItem
): Required<ItemStats> {
  const previewEquipped: Partial<Record<ShopSlotId, ShopItem>> = {
    ...equipped,
    [previewItem.slotId]: previewItem,
  };
  const gearBonus = aggregateCharacterBonusesFromEquipped(previewEquipped);
  return {
    strength: baseStats.strength + gearBonus.strength,
    agility: baseStats.agility + gearBonus.agility,
    endurance: baseStats.endurance + gearBonus.endurance,
    intelligence: baseStats.intelligence + gearBonus.intelligence,
    luck: baseStats.luck + gearBonus.luck,
  };
}
