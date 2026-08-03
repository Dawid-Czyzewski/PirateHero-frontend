import type { GameUser, GameUserWearableItem } from '@/types/gameUser';
import type { WearableStatisticsScalars } from '@/features/game/character/wearableItemStatisticsScalars';
import { parseWearableStatisticsScalars } from '@/features/game/character/wearableItemStatisticsScalars';
import type { ShopItem, ShopSlotId, ShopRarityId, ShopStatId } from './types';

export function wearableStatisticsScalarsToShopStatLines(
  parsed: WearableStatisticsScalars | null
): { statId: ShopStatId; value: number }[] {
  if (!parsed) return [];

  const lines: { statId: ShopStatId; value: number }[] = [];
  if (parsed.strongPoints !== 0) {
    lines.push({ statId: 'strength', value: parsed.strongPoints });
  }
  if (parsed.agilityPoints !== 0) {
    lines.push({ statId: 'agility', value: parsed.agilityPoints });
  }
  if (parsed.healthPoints !== 0) {
    lines.push({ statId: 'health', value: parsed.healthPoints });
  }
  if (parsed.intelligencePoints !== 0) {
    lines.push({ statId: 'intelligence', value: parsed.intelligencePoints });
  }
  if (parsed.criticalChancePoints !== 0) {
    lines.push({ statId: 'luck', value: parsed.criticalChancePoints });
  }
  return lines;
}

function statisticsToShopStatLines(w: GameUserWearableItem): { statId: ShopStatId; value: number }[] {
  return wearableStatisticsScalarsToShopStatLines(parseWearableStatisticsScalars(w.statistics));
}

export function normalizeWearableShopSlot(raw: string | undefined): ShopSlotId | null {
  const s = String(raw ?? '').toLowerCase();
  const allowed: ShopSlotId[] = [
    'helmet',
    'weapon',
    'armor',
    'shield',
    'gloves',
    'boots',
    'amulet',
    'ring',
    'potions',
  ];
  return allowed.includes(s as ShopSlotId) ? (s as ShopSlotId) : null;
}

export function wearableApiRarityToShopRarity(raw: string | undefined): ShopRarityId {
  const r = String(raw ?? 'common').toLowerCase();
  if (r === 'common' || r === 'uncommon' || r === 'rare' || r === 'legendary') {
    return r as ShopRarityId;
  }
  if (r === 'epic') {
    return 'rare';
  }
  return 'common';
}

function wearableToShopItem(w: GameUserWearableItem, slotType: string): ShopItem | null {
  if (w.id == null) return null;
  const slotId = normalizeWearableShopSlot(slotType) ?? normalizeWearableShopSlot(w.type);
  if (!slotId) return null;
  const id = Number(w.id);
  if (!Number.isFinite(id)) return null;
  return {
    id,
    nameKey: typeof w.nameKey === 'string' && w.nameKey.trim() ? w.nameKey.trim() : 'items.genericLoot',
    imageKey: w.imageKey,
    slotId,
    price: Number(w.price ?? 0),
    rarity: wearableApiRarityToShopRarity(w.rarity),
    stats: statisticsToShopStatLines(w),
  };
}

export function userEquipmentToShopEquipped(
  user: GameUser | null | undefined
): Partial<Record<ShopSlotId, ShopItem>> {
  const out: Partial<Record<ShopSlotId, ShopItem>> = {};
  for (const s of user?.userEquipment?.userEquipmentSlots ?? []) {
    const w = s.wearableItem;
    if (!w) continue;
    const mapped = wearableToShopItem(w, String(s.type ?? w.type ?? ''));
    if (mapped) {
      out[mapped.slotId] = mapped;
    }
  }
  return out;
}

export function chestIndexToStorageSlotId(
  user: GameUser | null | undefined,
  chestIndex: number
): number | undefined {
  const slots = [...(user?.storage?.slots ?? [])].sort(
    (a, b) => (Number(a.slotNumber) || 0) - (Number(b.slotNumber) || 0)
  );
  const row = slots[chestIndex];
  if (row?.id == null) return undefined;
  const sid = Number(row.id);
  return Number.isFinite(sid) ? sid : undefined;
}

export function storageSlotsToShopInventory(user: GameUser | null | undefined): (ShopItem | null)[] {
  const slots = [...(user?.storage?.slots ?? [])].sort(
    (a, b) => (Number(a.slotNumber) || 0) - (Number(b.slotNumber) || 0)
  );
  return Array.from({ length: 12 }, (_, i) => {
    const row = slots[i];
    if (!row) return null;
    const w = row.item ?? row.wearableItem;
    if (!w) return null;
    const typeHint = String(w.type ?? '');
    const mapped = wearableToShopItem(w, typeHint);
    if (!mapped) return null;
    const sid = row.id != null ? Number(row.id) : undefined;
    return {
      ...mapped,
      storageSlotId: Number.isFinite(sid) ? sid : undefined,
    };
  });
}
