import { useMemo, useState, useEffect } from 'react';
import { useUser } from '@/hooks/useUser';
import { type SlotType } from '@/data/gameItems';
import type { GameItem } from '@/features/game/character/characterTypes';
import {
  buildCatalog,
  deriveBaseStats,
  deriveChestSlotIds,
  deriveEquipped,
} from './characterPageDerived';
import { computeTotalStatsWithEquipment } from './characterInventoryTotalStats';
import { useClearChestDragOnWindow } from './useClearChestDragOnWindow';
import { useInventoryEquipmentActions } from './useInventoryEquipmentActions';
import { useInventoryChestActions } from './useInventoryChestActions';
import { useInventoryAttributeAllocation } from './useInventoryAttributeAllocation';
import { useWearableUpgrade } from './useWearableUpgrade';

export function useCharacterInventory() {
  const { user, fetchUserData, setUser, updateUser } = useUser();
  const [activeChestDragSlot, setActiveChestDragSlot] = useState<SlotType | null>(null);

  const catalog = useMemo(() => (user ? buildCatalog(user) : new Map<string, GameItem>()), [user]);
  const derivedEquipped = useMemo(() => (user ? deriveEquipped(user) : {}), [user]);
  const derivedChestSlots = useMemo(
    () => (user ? deriveChestSlotIds(user) : Array.from({ length: 12 }, () => null)),
    [user]
  );

  const [equipped, setEquipped] = useState<Partial<Record<SlotType, string>>>(derivedEquipped);
  const [chestSlots, setChestSlots] = useState<Array<string | null>>(derivedChestSlots);

  useEffect(() => {
    setEquipped(derivedEquipped);
  }, [derivedEquipped]);

  useEffect(() => {
    setChestSlots(derivedChestSlots);
  }, [derivedChestSlots]);

  useClearChestDragOnWindow(setActiveChestDragSlot);

  const baseStats = useMemo(() => deriveBaseStats(user), [user]);
  const totalStats = useMemo(
    () => computeTotalStatsWithEquipment(baseStats, equipped, catalog),
    [equipped, catalog, baseStats]
  );

  const { equipItem, unequipItem, unequipItemToChestSlot } = useInventoryEquipmentActions({
    user,
    catalog,
    equipped,
    chestSlots,
    setEquipped,
    setChestSlots,
    fetchUserData,
  });

  const moveChestItem = useInventoryChestActions({
    user,
    chestSlots,
    setChestSlots,
    fetchUserData,
  });

  const allocateAttributePoint = useInventoryAttributeAllocation({
    user,
    setUser,
    fetchUserData,
  });

  const { upgradeItem, upgradingId } = useWearableUpgrade({
    user,
    fetchUserData,
    updateUser,
  });

  return {
    user,
    catalog,
    baseStats,
    totalStats,
    equipped,
    chestSlots,
    activeChestDragSlot,
    setActiveChestDragSlot,
    equipItem,
    unequipItem,
    unequipItemToChestSlot,
    moveChestItem,
    allocateAttributePoint,
    upgradeItem,
    upgradingId,
  };
}
