import type { GameItem } from '@/features/game/character/characterTypes';
import { normalizeSlotType } from '@/features/game/character/characterPageDerived';
import { mapWearableToGameItem } from '@/features/game/character/characterItemMapper';
import type { UserPreviewData, UserPreviewEquipmentSlotDto } from '@/types/preview';
import type { GameUserWearableItem } from '@/types/gameUser';
import type { SlotType } from '@/data/gameItems';

function previewWearableToGameWearable(
  slot: UserPreviewEquipmentSlotDto,
  wearable: NonNullable<UserPreviewEquipmentSlotDto['wearableItem']>
): GameUserWearableItem | null {
  const slotType = normalizeSlotType(slot.slotType ?? wearable.type);
  if (!slotType) return null;
  return {
    id: wearable.id,
    name: wearable.name,
    type: slotType,
    rarity: wearable.rarity,
    statistics: wearable.statistics ?? undefined,
  };
}

export function buildPreviewCharacterCatalogAndEquipped(userData: UserPreviewData): {
  catalog: Map<string, GameItem>;
  equipped: Partial<Record<SlotType, string>>;
} {
  const catalog = new Map<string, GameItem>();
  const equipped: Partial<Record<SlotType, string>> = {};
  const slots = userData.userEquipment?.userEquipmentSlots ?? [];
  for (const row of slots) {
    if (!row?.wearableItem) continue;
    const wearable = previewWearableToGameWearable(row, row.wearableItem);
    if (!wearable) continue;
    const item = mapWearableToGameItem(wearable);
    if (!item) continue;
    catalog.set(item.id, item);
    equipped[item.slot] = item.id;
  }
  return { catalog, equipped };
}
