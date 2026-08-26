import type { GameUserStore, GameUserStoreSlot, GameUserWearableItem, GameUserWearableStatistics } from '@/types/gameUser';
import type { StoreBuyConfirmItem } from '@/types/storeBuy';
import type { UserStoreShelfItemDto } from '@/types/userStore';

function isRecord(v: unknown): v is Record<string, unknown> {
  return v != null && typeof v === 'object' && !Array.isArray(v);
}

function mapWearableStatisticsFromApi(raw: unknown): GameUserWearableStatistics | undefined {
  if (!isRecord(raw)) return undefined;
  const out: GameUserWearableStatistics = {};
  const keys = ['strongPoints', 'agilityPoints', 'healthPoints', 'criticalChancePoints'] as const;
  for (const k of keys) {
    const n = raw[k];
    if (typeof n === 'number' && Number.isFinite(n)) {
      out[k] = n;
    }
  }
  return Object.keys(out).length > 0 ? out : undefined;
}

export function mapWearableItemFromApi(raw: unknown): GameUserWearableItem | null {
  if (raw === null || raw === undefined) return null;
  if (!isRecord(raw)) return null;

  const item: GameUserWearableItem = {};
  if (raw.id != null && (typeof raw.id === 'string' || typeof raw.id === 'number')) {
    item.id = raw.id;
  }
  if (typeof raw.name === 'string') item.name = raw.name;
  if (typeof raw.type === 'string') item.type = raw.type;
  if (typeof raw.rarity === 'string') item.rarity = raw.rarity;
  if (typeof raw.price === 'number' && Number.isFinite(raw.price)) {
    item.price = raw.price;
  }
  if (typeof raw.upgradeLevel === 'number' && Number.isFinite(raw.upgradeLevel)) {
    item.upgradeLevel = raw.upgradeLevel;
  }
  if (typeof raw.maxUpgradeLevel === 'number' && Number.isFinite(raw.maxUpgradeLevel)) {
    item.maxUpgradeLevel = raw.maxUpgradeLevel;
  }
  if (raw.nextUpgradeCost === null) {
    item.nextUpgradeCost = null;
  } else if (typeof raw.nextUpgradeCost === 'number' && Number.isFinite(raw.nextUpgradeCost)) {
    item.nextUpgradeCost = raw.nextUpgradeCost;
  }
  if (typeof raw.specialization === 'string') {
    item.specialization = raw.specialization;
  } else if (raw.specialization === null) {
    item.specialization = null;
  }
  if (typeof raw.canSpecialize === 'boolean') {
    item.canSpecialize = raw.canSpecialize;
  }
  if (raw.specializationCost === null) {
    item.specializationCost = null;
  } else if (typeof raw.specializationCost === 'number' && Number.isFinite(raw.specializationCost)) {
    item.specializationCost = raw.specializationCost;
  }
  const stats = mapWearableStatisticsFromApi(raw.statistics);
  if (stats) item.statistics = stats;
  return item;
}

export function mapStoreSlotFromApi(raw: unknown): GameUserStoreSlot | null {
  if (raw == null || !isRecord(raw)) return null;

  const slot: GameUserStoreSlot = {};
  const id = raw.id;
  if (id === null) {
    slot.id = null;
  } else if (typeof id === 'string' || typeof id === 'number') {
    slot.id = id;
  }
  if (typeof raw.slotNumber === 'number' && Number.isFinite(raw.slotNumber)) {
    slot.slotNumber = raw.slotNumber;
  }
  if ('item' in raw) {
    if (raw.item === null || raw.item === undefined) {
      slot.item = null;
    } else {
      slot.item = mapWearableItemFromApi(raw.item) ?? null;
    }
  }
  return slot;
}

export function mapUserStoreFromApi(raw: unknown): GameUserStore | null {
  if (raw == null || !isRecord(raw)) return null;

  const out: GameUserStore = {};
  if (Array.isArray(raw.storeSlots)) {
    out.storeSlots = raw.storeSlots
      .map(mapStoreSlotFromApi)
      .filter((s): s is GameUserStoreSlot => s != null);
  }
  if (typeof raw.isFreeRefreshAvailable === 'boolean') {
    out.isFreeRefreshAvailable = raw.isFreeRefreshAvailable;
  }
  if (typeof raw.refreshCost === 'number' && Number.isFinite(raw.refreshCost)) {
    out.refreshCost = raw.refreshCost;
  }
  return out;
}

export function mapShelfItemToBuyConfirm(
  item: UserStoreShelfItemDto | null | undefined
): StoreBuyConfirmItem | null {
  if (item == null) return null;
  const { name, type, price, rarity } = item;
  if (typeof name !== 'string' || typeof type !== 'string' || typeof price !== 'number') {
    return null;
  }
  const out: StoreBuyConfirmItem = { name, type, price };
  if (typeof rarity === 'string' && rarity.length > 0) {
    out.rarity = rarity;
  }
  return out;
}
