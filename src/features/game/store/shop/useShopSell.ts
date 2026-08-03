import { useCallback } from 'react';
import type { Dispatch, RefObject, SetStateAction } from 'react';
import type { QueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query/queryKeys';
import type { GameUser } from '@/types/gameUser';
import type { GameShopUserState } from '@/types/gameShopState';
import { getUserFacingApiErrorMessage } from '@/lib/apiError';
import { requestJson } from '@/lib/api/requestJson';
import { chestIndexToStorageSlotId } from './shopProfileMerge';
import { applyOptimisticSellToUserCache } from './shopUserCachePatch';
import type { ShopItem, ShopSlotId } from './types';

function sellValue(item: ShopItem): number {
  return Math.floor(item.price * 0.5);
}

export type UseShopSellDeps = {
  userId: string | undefined;
  user: GameUser | null | undefined;
  queryClient: QueryClient;
  bumpGold: (delta: number) => void;
  inventoryRef: RefObject<(ShopItem | null)[]>;
  setInventory: Dispatch<SetStateAction<(ShopItem | null)[]>>;
  setEquipped: Dispatch<SetStateAction<Partial<Record<ShopSlotId, ShopItem>>>>;
  setError: (error: string | null) => void;
  syncShopFromResponse: (data: unknown) => void;
  recoverFromFailedMutation: () => Promise<void>;
};

export function useShopSell({
  userId,
  user,
  queryClient,
  bumpGold,
  inventoryRef,
  setInventory,
  setEquipped,
  setError,
  syncShopFromResponse,
  recoverFromFailedMutation,
}: UseShopSellDeps) {
  const sellItem = useCallback(
    async (item: ShopItem, source: 'inventory' | 'equipped') => {
      let resolvedStorageSlotId = item.storageSlotId;
      if (source === 'inventory') {
        const idx = inventoryRef.current.findIndex((i) => i?.id === item.id);
        if (idx === -1) return;
        resolvedStorageSlotId = resolvedStorageSlotId ?? chestIndexToStorageSlotId(user ?? null, idx);
        if (resolvedStorageSlotId == null) return;
      }

      const gain = sellValue(item);
      setError(null);
      bumpGold(gain);

      if (source === 'inventory') {
        setInventory((prev) => {
          const n = [...prev];
          const idx = n.findIndex((i) => i?.id === item.id);
          if (idx !== -1) n[idx] = null;
          return n;
        });
      } else {
        setEquipped((prev) => {
          const next = { ...prev };
          delete next[item.slotId];
          return next;
        });
      }

      if (userId) {
        const itemForCache: ShopItem =
          source === 'inventory' && resolvedStorageSlotId != null
            ? { ...item, storageSlotId: resolvedStorageSlotId }
            : item;
        queryClient.setQueryData(queryKeys.currentUser(userId), (prev: GameUser | null | undefined) =>
          prev ? applyOptimisticSellToUserCache(prev, itemForCache, source) : prev
        );
      }

      try {
        let data: unknown;
        if (source === 'inventory') {
          data = await requestJson<GameShopUserState>('/game-shop/sell', {
            method: 'POST',
            body: { storageSlotId: resolvedStorageSlotId as number },
          });
        } else {
          data = await requestJson<GameShopUserState>('/game-shop/sell-equipped', {
            method: 'POST',
            body: { slotType: item.slotId },
          });
        }
        syncShopFromResponse(data);
      } catch (e) {
        setError(getUserFacingApiErrorMessage(e));
        await recoverFromFailedMutation();
      }
    },
    [bumpGold, syncShopFromResponse, recoverFromFailedMutation, queryClient, userId, user, inventoryRef, setInventory, setEquipped, setError]
  );

  return { sellItem };
}
