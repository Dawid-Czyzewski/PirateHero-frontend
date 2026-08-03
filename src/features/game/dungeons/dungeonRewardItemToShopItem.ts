import { parseWearableStatisticsScalars } from '@/features/game/character/wearableItemStatisticsScalars';
import {
  normalizeWearableShopSlot,
  wearableApiRarityToShopRarity,
  wearableStatisticsScalarsToShopStatLines,
} from '@/features/game/store/shop/shopProfileMerge';
import type { ShopItem, ShopSlotId } from '@/features/game/store/shop/types';
import type { ArenaDungeonRewardItem } from '@/features/game/arena/arenaTypes';

export function dungeonRewardItemToShopItem(item: ArenaDungeonRewardItem): ShopItem {
  const slotId: ShopSlotId = normalizeWearableShopSlot(item.type ?? undefined) ?? 'helmet';
  const idRaw = item.id;
  const id = idRaw != null && Number.isFinite(Number(idRaw)) ? Number(idRaw) : 0;
  const nameKey =
    item.nameKey && String(item.nameKey).trim() ? String(item.nameKey).trim() : 'items.genericLoot';
  const displayLabel =
    item.name && String(item.name).trim() ? String(item.name).trim() : undefined;

  const stats = wearableStatisticsScalarsToShopStatLines(
    parseWearableStatisticsScalars(item.statistics ?? null)
  );

  return {
    id,
    nameKey,
    displayLabel,
    imageKey: item.imageKey,
    slotId,
    price: Number(item.price ?? 0),
    rarity: wearableApiRarityToShopRarity(item.rarity),
    stats,
  };
}
