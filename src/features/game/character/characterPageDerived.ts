import type { GameUser, GameUserWearableItem } from '@/types/gameUser';
import { type ItemStats, type SlotType } from '@/data/gameItems';
import type { GameItem } from '@/features/game/character/characterTypes';
import { BASE_STATS } from './characterPageConfig';
import { mapWearableToGameItem } from './characterItemMapper';

export function normalizeSlotType(t: string | undefined): SlotType | null {
  const s = String(t ?? '').toLowerCase();
  if (s === 'helmet' || s === 'weapon' || s === 'armor' || s === 'amulet' || s === 'ring' || s === 'boots') {
    return s as SlotType;
  }
  return null;
}

export function buildCatalog(user: GameUser): Map<string, GameItem> {
  const map = new Map<string, GameItem>();
  const add = (w?: GameUserWearableItem | null) => {
    if (!w) return;
    const g = mapWearableToGameItem(w);
    if (g) {
      map.set(g.id, g);
    }
  };
  for (const s of user.userEquipment?.userEquipmentSlots ?? []) {
    add(s.wearableItem);
  }
  const storageSlots = [...(user.storage?.slots ?? [])].sort(
    (a, b) => (a.slotNumber ?? 0) - (b.slotNumber ?? 0)
  );
  for (const s of storageSlots) {
    add(s.item ?? s.wearableItem);
  }
  return map;
}

export function deriveEquipped(user: GameUser): Partial<Record<SlotType, string>> {
  const out: Partial<Record<SlotType, string>> = {};
  for (const s of user.userEquipment?.userEquipmentSlots ?? []) {
    const slot = normalizeSlotType(s.type);
    if (!slot || !s.wearableItem) continue;
    const g = mapWearableToGameItem(s.wearableItem);
    if (g) {
      out[slot] = g.id;
    }
  }
  return out;
}

export function deriveChestSlotIds(user: GameUser): Array<string | null> {
  const sorted = [...(user.storage?.slots ?? [])].sort(
    (a, b) => (a.slotNumber ?? 0) - (b.slotNumber ?? 0)
  );
  return Array.from({ length: 12 }, (_, i) => {
    const row = sorted[i];
    if (!row) return null;
    const w = row.item ?? row.wearableItem;
    return w?.id != null ? String(w.id) : null;
  });
}

export function deriveBaseStats(user: GameUser | null | undefined): Required<ItemStats> {
  const base = user?.userBaseStatistics;
  if (!base) return { ...BASE_STATS };
  return {
    strength: Number(base.strength ?? base.strongPoints ?? BASE_STATS.strength),
    agility: Number(base.agility ?? base.agilityPoints ?? BASE_STATS.agility),
    endurance: Number(base.endurance ?? base.healthPoints ?? BASE_STATS.endurance),
    intelligence: Number(base.intelligence ?? base.criticalChancePoints ?? BASE_STATS.intelligence),
    luck: Number(base.luck ?? BASE_STATS.luck),
  };
}
