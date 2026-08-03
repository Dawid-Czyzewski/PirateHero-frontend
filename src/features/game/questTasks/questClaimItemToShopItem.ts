import { parseWearableStatisticsScalars } from '@/features/game/character/wearableItemStatisticsScalars';
import {
  normalizeWearableShopSlot,
  wearableApiRarityToShopRarity,
  wearableStatisticsScalarsToShopStatLines,
} from '@/features/game/store/shop/shopProfileMerge';
import type { ShopItem, ShopSlotId } from '@/features/game/store/shop/types';
import type { CaptainQuestReward } from './captainQuestTypes';

export function captainQuestItemRewardToShopItem(
  reward: Extract<CaptainQuestReward, { type: 'item' }>
): ShopItem {
  const slotId: ShopSlotId = normalizeWearableShopSlot(reward.itemType ?? undefined) ?? 'helmet';
  const idRaw = reward.itemId;
  const id = idRaw != null && Number.isFinite(Number(idRaw)) ? Number(idRaw) : 0;
  const nameKey =
    reward.itemNameKey && String(reward.itemNameKey).trim()
      ? String(reward.itemNameKey).trim()
      : 'items.genericLoot';
  const displayLabel =
    reward.itemName && String(reward.itemName).trim() ? String(reward.itemName).trim() : undefined;

  const stats = wearableStatisticsScalarsToShopStatLines(
    parseWearableStatisticsScalars(reward.statistics ?? null)
  );

  return {
    id,
    nameKey,
    displayLabel,
    imageKey: reward.imageKey,
    slotId,
    price: Number(reward.price ?? 0),
    rarity: wearableApiRarityToShopRarity(reward.rarity),
    stats,
  };
}
