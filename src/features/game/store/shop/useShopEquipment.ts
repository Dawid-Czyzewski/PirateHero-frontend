import { useCallback } from 'react';
import type { Dispatch, RefObject, SetStateAction } from 'react';
import type { QueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query/queryKeys';
import type { GameUser } from '@/types/gameUser';
import type { GameShopUserState } from '@/types/gameShopState';
import { getUserFacingApiErrorMessage } from '@/lib/apiError';
import { requestJson } from '@/lib/api/requestJson';
import { CHEST_SLOT_COUNT } from './characterEquipLayout';
import { applyOptimisticEquipToUserCache, applyOptimisticUnequipToUserCache } from './shopUserCachePatch';
import type { ShopItem, ShopSlotId } from './types';

export type UseShopEquipmentDeps = {
  userId: string | undefined;
  equipmentId: number | string | undefined;
  storageId: number | string | undefined;
  queryClient: QueryClient;
  inventoryRef: RefObject<(ShopItem | null)[]>;
  equippedRef: RefObject<Partial<Record<ShopSlotId, ShopItem>>>;
  setInventory: Dispatch<SetStateAction<(ShopItem | null)[]>>;
  setEquipped: Dispatch<SetStateAction<Partial<Record<ShopSlotId, ShopItem>>>>;
  setError: (error: string | null) => void;
  resetGoldOffset: () => void;
  syncShopFromResponse: (data: unknown) => void;
  recoverFromFailedMutation: () => Promise<void>;
};

export function useShopEquipment({
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
  syncShopFromResponse,
  recoverFromFailedMutation,
}: UseShopEquipmentDeps) {
  const equipItem = useCallback(
    async (item: ShopItem) => {
      const inv = inventoryRef.current;
      const eq = equippedRef.current;
      const slot = item.slotId;
      const invIdx = inv.findIndex((i) => i?.id === item.id);
      if (invIdx === -1) return;

      const replaced = eq[slot];
      setError(null);
      setEquipped((prev) => ({ ...prev, [slot]: item }));
      setInventory((prev) => {
        const n = [...prev];
        n[invIdx] = replaced ?? null;
        return n;
      });

      if (userId) {
        queryClient.setQueryData(queryKeys.currentUser(userId), (prev: GameUser | null | undefined) =>
          prev ? applyOptimisticEquipToUserCache(prev, item, invIdx, replaced) : prev
        );
      }
      try {
        const data = await requestJson<GameShopUserState>('/game-shop/equip', {
          method: 'POST',
          body: { itemId: item.id },
        });
        syncShopFromResponse(data);
      } catch (e) {
        setError(getUserFacingApiErrorMessage(e));
        await recoverFromFailedMutation();
      }
    },
    [syncShopFromResponse, recoverFromFailedMutation, queryClient, userId, inventoryRef, equippedRef, setEquipped, setInventory, setError]
  );

  const unequipToChest = useCallback(
    async (item: ShopItem, targetSlot: number | null) => {
      if (!equipmentId) return;
      const slot = item.slotId;
      const inv = inventoryRef.current;
      const eq = equippedRef.current;
      if (eq[slot]?.id !== item.id) return;

      const firstFree = inv.findIndex((x) => x === null);
      const dest = targetSlot ?? firstFree;
      if (dest === -1 || dest < 0 || dest >= CHEST_SLOT_COUNT) return;
      if (inv[dest] !== null) return;

      setError(null);
      setEquipped((prev) => {
        const n = { ...prev };
        delete n[slot];
        return n;
      });
      setInventory((prev) => {
        const n = [...prev];
        n[dest] = item;
        return n;
      });

      if (userId) {
        queryClient.setQueryData(queryKeys.currentUser(userId), (prev: GameUser | null | undefined) =>
          prev ? applyOptimisticUnequipToUserCache(prev, item, dest) : prev
        );
      }

      try {
        await requestJson(`/user_equipments/${equipmentId}/unequip`, {
          method: 'POST',
          body: { slotType: slot },
        });
        if (storageId && firstFree !== dest && firstFree !== -1) {
          await requestJson(`/storage/${storageId}/move-item/${firstFree + 1}/${dest + 1}`, {
            method: 'POST',
          });
        }
        resetGoldOffset();
      } catch (e) {
        setError(getUserFacingApiErrorMessage(e));
        await recoverFromFailedMutation();
      }
    },
    [
      equipmentId,
      storageId,
      resetGoldOffset,
      recoverFromFailedMutation,
      queryClient,
      userId,
      inventoryRef,
      equippedRef,
      setEquipped,
      setInventory,
      setError,
    ]
  );

  return { equipItem, unequipToChest };
}
