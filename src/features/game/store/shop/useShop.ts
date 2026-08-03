import { useEffect, useMemo, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import type { ItemStats } from '@/data/gameItems';
import type { GameUser } from '@/types/gameUser';
import { useShopOptimisticCurrency } from './shopOptimisticCurrencyContext';
import { CHEST_SLOT_COUNT } from './characterEquipLayout';
import { chestIndexToStorageSlotId, storageSlotsToShopInventory, userEquipmentToShopEquipped } from './shopProfileMerge';
import { aggregateCharacterBonusesFromEquipped } from './shopPreview';
import { useShopCatalog } from './useShopCatalog';
import { useShopPurchase } from './useShopPurchase';
import { useShopEquipment } from './useShopEquipment';
import { useShopSell } from './useShopSell';
import { useShopDragDrop } from './useShopDragDrop';
import type { ShopItem, ShopSlotId } from './types';

export { computeShopPreviewTotals } from './shopPreview';

const FALLBACK_BASE_STATS: Required<ItemStats> = {
  strength: 45,
  agility: 56,
  endurance: 78,
  intelligence: 32,
  luck: 20,
};

function baseStatsFromProfile(user: GameUser | null | undefined): Required<ItemStats> {
  const u = user?.userBaseStatistics;
  if (!u) return FALLBACK_BASE_STATS;
  return {
    strength: Number(u.strength ?? u.strongPoints ?? FALLBACK_BASE_STATS.strength),
    agility: Number(u.agility ?? u.agilityPoints ?? FALLBACK_BASE_STATS.agility),
    endurance: Number(u.endurance ?? u.healthPoints ?? FALLBACK_BASE_STATS.endurance),
    intelligence: Number(u.intelligence ?? u.criticalChancePoints ?? FALLBACK_BASE_STATS.intelligence),
    luck: Number(u.luck ?? FALLBACK_BASE_STATS.luck),
  };
}

export type UseShopOptions = {
  user?: GameUser | null | undefined;
  fetchUserData?: () => void | Promise<unknown>;
};

export function useShop(options: UseShopOptions = {}) {
  const { user, fetchUserData } = options;
  const userId = user?.id;
  const queryClient = useQueryClient();
  const { bumpGold, resetGoldOffset, goldOffset } = useShopOptimisticCurrency();

  const catalog = useShopCatalog({ userId, user, queryClient, fetchUserData, resetGoldOffset });
  const { shop, setShop, shopRef, inventory, setInventory, equipped, setEquipped, refreshMeta, refreshing, error, setError } = catalog;

  const inventoryRef = useRef(inventory);
  const equippedRef = useRef<Partial<Record<ShopSlotId, ShopItem>>>({});

  const characterBaseStats = useMemo(() => baseStatsFromProfile(user ?? null), [user]);

  const profileEquipped = useMemo(() => userEquipmentToShopEquipped(user ?? null), [user?.userEquipment]);

  const profileInventory = useMemo(() => storageSlotsToShopInventory(user ?? null), [user?.storage]);

  const displayEquipped = useMemo(
    () => ({ ...profileEquipped, ...equipped }),
    [profileEquipped, equipped]
  );

  const displayInventory = useMemo(
    () =>
      Array.from({ length: CHEST_SLOT_COUNT }, (_, i) => {
        const local = inventory[i];
        const prof = profileInventory[i];
        const cell = local ?? prof ?? null;
        if (cell == null) return null;
        const sid = cell.storageSlotId ?? prof?.storageSlotId ?? chestIndexToStorageSlotId(user ?? null, i);
        return sid != null && sid !== cell.storageSlotId ? { ...cell, storageSlotId: sid } : cell;
      }) as (ShopItem | null)[],
    [inventory, profileInventory, user]
  );

  const spendableGold = Number(user?.gold ?? 0) + goldOffset;

  const gearBonus = useMemo(
    () => aggregateCharacterBonusesFromEquipped(displayEquipped),
    [displayEquipped]
  );

  const characterTotalStats = useMemo(
    (): Required<ItemStats> => ({
      strength: characterBaseStats.strength + gearBonus.strength,
      agility: characterBaseStats.agility + gearBonus.agility,
      endurance: characterBaseStats.endurance + gearBonus.endurance,
      intelligence: characterBaseStats.intelligence + gearBonus.intelligence,
      luck: characterBaseStats.luck + gearBonus.luck,
    }),
    [characterBaseStats, gearBonus]
  );

  useEffect(() => {
    equippedRef.current = displayEquipped;
  }, [displayEquipped]);

  useEffect(() => {
    inventoryRef.current = displayInventory;
  }, [displayInventory]);

  const { buyItem, buyItemToInventory } = useShopPurchase({
    userId,
    queryClient,
    spendableGold,
    bumpGold,
    shopRef,
    inventoryRef,
    equippedRef,
    setShop,
    setInventory,
    setEquipped,
    setError,
    postPurchase: catalog.postPurchase,
    syncShopFromResponse: catalog.syncShopFromResponse,
    recoverFromFailedMutation: catalog.recoverFromFailedMutation,
  });

  const { sellItem } = useShopSell({
    userId,
    user,
    queryClient,
    bumpGold,
    inventoryRef,
    setInventory,
    setEquipped,
    setError,
    syncShopFromResponse: catalog.syncShopFromResponse,
    recoverFromFailedMutation: catalog.recoverFromFailedMutation,
  });

  const equipmentId = user?.userEquipment?.id;
  const storageId = user?.storage?.id;

  const { equipItem, unequipToChest } = useShopEquipment({
    userId,
    equipmentId,
    storageId,
    queryClient,
    inventoryRef,
    equippedRef,
    setInventory,
    setEquipped,
    setError,
    resetGoldOffset,
    syncShopFromResponse: catalog.syncShopFromResponse,
    recoverFromFailedMutation: catalog.recoverFromFailedMutation,
  });

  const {
    draggedCategorySlot,
    dragOverZone,
    setDragOverZone,
    activeDragSource,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDropOnEquipSlot,
    handleDropOnSellZone,
    handleDropOnChest,
    peekDragSource,
  } = useShopDragDrop({
    userId,
    storageId,
    queryClient,
    shopRef,
    inventoryRef,
    equippedRef,
    setInventory,
    setError,
    resetGoldOffset,
    recoverFromFailedMutation: catalog.recoverFromFailedMutation,
    buyItem,
    buyItemToInventory,
    equipItem,
    sellItem,
    unequipToChest,
  });

  return {
    gold: spendableGold,
    diamonds: Number(user?.diamonds ?? 0),
    equipped: displayEquipped,
    inventory: displayInventory,
    draggedCategorySlot,
    shop,
    refreshMeta,
    loading: false,
    error,
    dragOverZone,
    setDragOverZone,
    activeDragSource,
    refreshing,
    characterBaseStats,
    characterTotalStats,
    slotOrder: catalog.slotOrder,
    reload: catalog.reload,
    buyItem,
    sellItem,
    equipItem,
    unequipToChest,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDropOnEquipSlot,
    handleDropOnSellZone,
    handleDropOnChest,
    peekDragSource,
    refreshOffer: catalog.refreshOffer,
  };
}
