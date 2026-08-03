import { useCallback } from 'react';
import type { Dispatch, RefObject, SetStateAction } from 'react';
import type { QueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query/queryKeys';
import type { GameUser } from '@/types/gameUser';
import type { GameShopUserState } from '@/types/gameShopState';
import { getUserFacingApiErrorMessage } from '@/lib/apiError';
import { requestJson } from '@/lib/api/requestJson';
import { CHEST_SLOT_COUNT } from './characterEquipLayout';
import {
  applyOptimisticBuyAndEquip,
  applyOptimisticBuyToChestOccupied,
  applyOptimisticBuyToInventory,
} from './shopUserCachePatch';
import type { ShopItem, ShopSlotId } from './types';

export type UseShopPurchaseDeps = {
  userId: string | undefined;
  queryClient: QueryClient;
  spendableGold: number;
  bumpGold: (delta: number) => void;
  shopRef: RefObject<(ShopItem | null)[]>;
  inventoryRef: RefObject<(ShopItem | null)[]>;
  equippedRef: RefObject<Partial<Record<ShopSlotId, ShopItem>>>;
  setShop: Dispatch<SetStateAction<(ShopItem | null)[]>>;
  setInventory: Dispatch<SetStateAction<(ShopItem | null)[]>>;
  setEquipped: Dispatch<SetStateAction<Partial<Record<ShopSlotId, ShopItem>>>>;
  setError: (error: string | null) => void;
  postPurchase: (item: ShopItem, chestSlotIndex: number) => Promise<GameShopUserState>;
  syncShopFromResponse: (data: unknown) => void;
  recoverFromFailedMutation: () => Promise<void>;
};

export function useShopPurchase({
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
  postPurchase,
  syncShopFromResponse,
  recoverFromFailedMutation,
}: UseShopPurchaseDeps) {
  const buyItem = useCallback(
    async (item: ShopItem) => {
      const inv = inventoryRef.current;
      const eq = equippedRef.current;
      const s = shopRef.current;
      const shopIdx = s.findIndex((x) => x?.id === item.id && x?.storeSlotId === item.storeSlotId);
      if (shopIdx === -1) return;
      const storeSlotId = item.storeSlotId;
      if (storeSlotId == null) return;
      if (spendableGold < item.price) return;

      const currentEquipped = eq[item.slotId];
      if (currentEquipped) {
        const free = inv.findIndex((x) => x === null);
        if (free === -1) return;
        setError(null);
        bumpGold(-item.price);
        setShop((prev) => {
          const n = [...prev];
          n[shopIdx] = null;
          return n;
        });
        setInventory((prev) => {
          const n = [...prev];
          n[free] = item;
          return n;
        });
        if (userId) {
          queryClient.setQueryData(queryKeys.currentUser(userId), (prev: GameUser | null | undefined) =>
            prev ? applyOptimisticBuyToChestOccupied(prev, item, free, shopIdx) : prev
          );
        }
        try {
          const data = await postPurchase(item, free);
          syncShopFromResponse(data);
        } catch (e) {
          setError(getUserFacingApiErrorMessage(e));
          await recoverFromFailedMutation();
        }
        return;
      }

      const free = inv.findIndex((x) => x === null);
      if (free === -1) return;

      setError(null);
      bumpGold(-item.price);
      setShop((prev) => {
        const n = [...prev];
        n[shopIdx] = null;
        return n;
      });
      setEquipped((prev) => ({ ...prev, [item.slotId]: item }));

      if (userId) {
        queryClient.setQueryData(queryKeys.currentUser(userId), (prev: GameUser | null | undefined) =>
          prev ? applyOptimisticBuyAndEquip(prev, item, free, shopIdx) : prev
        );
      }
      try {
        await postPurchase(item, free);
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
    [
      bumpGold,
      spendableGold,
      postPurchase,
      syncShopFromResponse,
      recoverFromFailedMutation,
      queryClient,
      userId,
      shopRef,
      inventoryRef,
      equippedRef,
      setShop,
      setInventory,
      setEquipped,
      setError,
    ]
  );

  const buyItemToInventory = useCallback(
    async (item: ShopItem, targetSlot: number | null) => {
      const inv = inventoryRef.current;
      const s = shopRef.current;
      const shopIdx = s.findIndex((x) => x?.id === item.id && x?.storeSlotId === item.storeSlotId);
      if (shopIdx === -1) return;
      if (spendableGold < item.price) return;

      let slot = targetSlot;
      if (slot === null) {
        slot = inv.findIndex((x) => x === null);
      }
      if (slot === -1 || slot < 0 || slot >= CHEST_SLOT_COUNT) return;
      if (inv[slot] !== null) return;

      setError(null);
      bumpGold(-item.price);
      setShop((prev) => {
        const n = [...prev];
        n[shopIdx] = null;
        return n;
      });
      setInventory((prev) => {
        const n = [...prev];
        n[slot!] = item;
        return n;
      });

      if (userId) {
        queryClient.setQueryData(queryKeys.currentUser(userId), (prev: GameUser | null | undefined) =>
          prev ? applyOptimisticBuyToInventory(prev, item, slot!, shopIdx) : prev
        );
      }
      try {
        const data = await postPurchase(item, slot);
        syncShopFromResponse(data);
      } catch (e) {
        setError(getUserFacingApiErrorMessage(e));
        await recoverFromFailedMutation();
      }
    },
    [
      bumpGold,
      spendableGold,
      postPurchase,
      syncShopFromResponse,
      recoverFromFailedMutation,
      queryClient,
      userId,
      shopRef,
      inventoryRef,
      setShop,
      setInventory,
      setError,
    ]
  );

  return { buyItem, buyItemToInventory };
}
