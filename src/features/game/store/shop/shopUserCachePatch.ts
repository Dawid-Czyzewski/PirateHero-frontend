import type { GameUser, GameUserWearableItem } from '@/types/gameUser';
import type { GameShopUserState } from '@/types/gameShopState';
import type { ShopItem, ShopSlotId } from './types';

function wearableStatisticsFromShopItem(item: ShopItem): GameUserWearableItem['statistics'] {
  const stats: NonNullable<GameUserWearableItem['statistics']> = {};
  for (const s of item.stats ?? []) {
    const value = Number(s.value ?? 0);
    if (!Number.isFinite(value) || value === 0) continue;
    if (s.statId === 'strength') {
      stats.strongPoints = (stats.strongPoints ?? 0) + value;
    } else if (s.statId === 'agility' || s.statId === 'speed') {
      stats.agilityPoints = (stats.agilityPoints ?? 0) + value;
    } else if (s.statId === 'health' || s.statId === 'defense') {
      stats.healthPoints = (stats.healthPoints ?? 0) + value;
    } else if (s.statId === 'intelligence') {
      stats.intelligencePoints = (stats.intelligencePoints ?? 0) + value;
    } else if (s.statId === 'luck') {
      stats.criticalChancePoints = (stats.criticalChancePoints ?? 0) + value;
    }
  }
  return Object.keys(stats).length > 0 ? stats : undefined;
}

export function wearableFromShopItem(item: ShopItem): GameUserWearableItem {
  return {
    id: item.id,
    nameKey: item.nameKey,
    type: item.slotId,
    rarity: item.rarity,
    price: item.price,
    imageKey: item.imageKey,
    statistics: wearableStatisticsFromShopItem(item),
  };
}

export function patchUserRemoveStorageItemBySlotId(prev: GameUser, storageSlotId: number): GameUser {
  const storage = prev.storage;
  if (!storage?.slots) return prev;
  const sid = Number(storageSlotId);
  const slots = storage.slots.map((s) => {
    if (Number(s.id) === sid) {
      return { ...s, item: null, wearableItem: null };
    }
    return s;
  });
  return { ...prev, storage: { ...storage, slots } };
}

export function patchUserClearEquippedSlot(prev: GameUser, slotType: ShopSlotId): GameUser {
  const ue = prev.userEquipment;
  if (!ue?.userEquipmentSlots) return prev;
  const st = String(slotType).toLowerCase();
  const slots = ue.userEquipmentSlots.map((s) => {
    const t = String(s.type ?? '').toLowerCase();
    if (t === st) {
      return { ...s, wearableItem: null };
    }
    return s;
  });
  return { ...prev, userEquipment: { ...ue, userEquipmentSlots: slots } };
}

export function patchEquippedSlotWearable(
  prev: GameUser,
  slotType: ShopSlotId,
  wearable: GameUserWearableItem | null
): GameUser {
  const ue = prev.userEquipment;
  if (!ue?.userEquipmentSlots) return prev;
  const st = String(slotType).toLowerCase();
  const slots = ue.userEquipmentSlots.map((s) => {
    if (String(s.type ?? '').toLowerCase() === st) {
      return { ...s, wearableItem: wearable };
    }
    return s;
  });
  return { ...prev, userEquipment: { ...ue, userEquipmentSlots: slots } };
}

export function patchStorageSlotByIndex(
  prev: GameUser,
  index: number,
  content: GameUserWearableItem | null
): GameUser {
  const storage = prev.storage;
  if (!storage?.slots?.length) return prev;
  const sorted = [...storage.slots].sort(
    (a, b) => (Number(a.slotNumber) || 0) - (Number(b.slotNumber) || 0)
  );
  const row = sorted[index];
  if (!row?.id) return prev;
  const targetId = row.id;
  const slots = storage.slots.map((s) => {
    if (String(s.id) === String(targetId)) {
      return { ...s, item: content, wearableItem: content };
    }
    return s;
  });
  return { ...prev, storage: { ...storage, slots } };
}

function normalizeShopArray(gs: GameShopUserState): (ShopItem | null)[] {
  const shop = gs.shop;
  if (Array.isArray(shop)) {
    return [...shop];
  }
  return Array(9).fill(null);
}

export function patchGameShopAfterSell(
  prev: GameUser,
  item: ShopItem,
  source: 'inventory' | 'equipped'
): GameUser {
  const gs = prev.gameShop;
  if (!gs) return prev;

  if (source === 'inventory') {
    const inv = [...(gs.inventory ?? [])];
    const idx = inv.findIndex((x) => x?.id === item.id);
    if (idx !== -1) {
      inv[idx] = null;
    }
    const next: GameShopUserState = { ...gs, inventory: inv };
    return { ...prev, gameShop: next };
  }

  const equipped: GameShopUserState['equipped'] = { ...(gs.equipped ?? {}) };
  delete equipped[item.slotId];
  const next: GameShopUserState = { ...gs, equipped };
  return { ...prev, gameShop: next };
}

export function applyOptimisticSellToUserCache(
  prev: GameUser,
  item: ShopItem,
  source: 'inventory' | 'equipped'
): GameUser {
  let next = prev;
  if (source === 'inventory' && item.storageSlotId != null) {
    next = patchUserRemoveStorageItemBySlotId(next, item.storageSlotId as number);
  } else if (source === 'equipped') {
    next = patchUserClearEquippedSlot(next, item.slotId);
  }
  next = patchGameShopAfterSell(next, item, source);
  return next;
}

export function applyOptimisticEquipToUserCache(
  prev: GameUser,
  item: ShopItem,
  invIdx: number,
  replaced: ShopItem | null | undefined
): GameUser {
  let next = patchEquippedSlotWearable(prev, item.slotId, wearableFromShopItem(item));
  next = patchStorageSlotByIndex(next, invIdx, replaced ? wearableFromShopItem(replaced) : null);
  const gs = next.gameShop;
  if (!gs) return next;
  const inv = [...(gs.inventory ?? [])];
  if (invIdx < inv.length) {
    inv[invIdx] = replaced ?? null;
  }
  const equipped: GameShopUserState['equipped'] = { ...(gs.equipped ?? {}), [item.slotId]: item };
  const out: GameShopUserState = { ...gs, inventory: inv, equipped };
  return { ...next, gameShop: out };
}

export function applyOptimisticUnequipToUserCache(prev: GameUser, item: ShopItem, dest: number): GameUser {
  let next = patchEquippedSlotWearable(prev, item.slotId, null);
  next = patchStorageSlotByIndex(next, dest, wearableFromShopItem(item));
  const gs = next.gameShop;
  if (!gs) return next;
  const inv = [...(gs.inventory ?? [])];
  if (dest < inv.length) {
    inv[dest] = item;
  }
  const equipped: GameShopUserState['equipped'] = { ...(gs.equipped ?? {}) };
  delete equipped[item.slotId];
  return { ...next, gameShop: { ...gs, inventory: inv, equipped } };
}

export function applyOptimisticStorageSwapToUserCache(
  prev: GameUser,
  fromIndex: number,
  toIndex: number
): GameUser {
  const storage = prev.storage;
  if (!storage?.slots?.length) return prev;
  const sorted = [...storage.slots].sort(
    (a, b) => (Number(a.slotNumber) || 0) - (Number(b.slotNumber) || 0)
  );
  const rowA = sorted[fromIndex];
  const rowB = sorted[toIndex];
  if (!rowA?.id || !rowB?.id) return prev;
  const pick = (row: (typeof sorted)[0]) => (row.item ?? row.wearableItem) ?? null;
  const wA = pick(rowA);
  const wB = pick(rowB);
  const slots = storage.slots.map((s) => {
    if (String(s.id) === String(rowA.id)) {
      return { ...s, item: wB, wearableItem: wB };
    }
    if (String(s.id) === String(rowB.id)) {
      return { ...s, item: wA, wearableItem: wA };
    }
    return s;
  });
  let next: GameUser = { ...prev, storage: { ...storage, slots } };
  const gs = next.gameShop;
  if (gs?.inventory) {
    const inv = [...gs.inventory];
    const t = inv[fromIndex];
    inv[fromIndex] = inv[toIndex];
    inv[toIndex] = t;
    next = { ...next, gameShop: { ...gs, inventory: inv } };
  }
  return next;
}

function patchGameShopBuyToChest(
  prev: GameUser,
  item: ShopItem,
  chestIndex: number,
  shopOfferIndex: number
): GameUser {
  const gs = prev.gameShop;
  if (!gs) return prev;
  const shop = normalizeShopArray(gs);
  if (shopOfferIndex >= 0 && shopOfferIndex < shop.length) {
    shop[shopOfferIndex] = null;
  }
  const inv = [...(gs.inventory ?? [])];
  if (chestIndex < inv.length) {
    inv[chestIndex] = item;
  }
  return { ...prev, gameShop: { ...gs, shop, inventory: inv } };
}

export function applyOptimisticBuyToChestOccupied(
  prev: GameUser,
  item: ShopItem,
  chestIndex: number,
  shopOfferIndex: number
): GameUser {
  const next = patchStorageSlotByIndex(prev, chestIndex, wearableFromShopItem(item));
  return patchGameShopBuyToChest(next, item, chestIndex, shopOfferIndex);
}

export function applyOptimisticBuyAndEquip(
  prev: GameUser,
  item: ShopItem,
  freeChestIndex: number,
  shopOfferIndex: number
): GameUser {
  let next = patchEquippedSlotWearable(prev, item.slotId, wearableFromShopItem(item));
  next = patchStorageSlotByIndex(next, freeChestIndex, null);
  const gs = next.gameShop;
  if (!gs) return next;
  const shop = normalizeShopArray(gs);
  if (shopOfferIndex >= 0 && shopOfferIndex < shop.length) {
    shop[shopOfferIndex] = null;
  }
  const inv = [...(gs.inventory ?? [])];
  if (freeChestIndex < inv.length) {
    inv[freeChestIndex] = null;
  }
  const equipped: GameShopUserState['equipped'] = { ...(gs.equipped ?? {}), [item.slotId]: item };
  return { ...next, gameShop: { ...gs, shop, inventory: inv, equipped } };
}

export function applyOptimisticBuyToInventory(
  prev: GameUser,
  item: ShopItem,
  chestIndex: number,
  shopOfferIndex: number
): GameUser {
  const next = patchStorageSlotByIndex(prev, chestIndex, wearableFromShopItem(item));
  return patchGameShopBuyToChest(next, item, chestIndex, shopOfferIndex);
}
