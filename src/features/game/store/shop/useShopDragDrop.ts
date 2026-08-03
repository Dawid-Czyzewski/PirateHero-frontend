import { useCallback, useRef, useState, type DragEvent } from 'react';
import type { Dispatch, RefObject, SetStateAction } from 'react';
import type { QueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query/queryKeys';
import { getUserFacingApiErrorMessage } from '@/lib/apiError';
import { requestJson } from '@/lib/api/requestJson';
import type { GameUser } from '@/types/gameUser';
import { CHEST_SLOT_COUNT } from './characterEquipLayout';
import { applyOptimisticStorageSwapToUserCache } from './shopUserCachePatch';
import type { ShopItem, ShopSelectionSource, ShopSlotId } from './types';

type DragPayload = { itemId: number; source: ShopSelectionSource; slot: ShopSlotId };

function parseDragPayload(e: DragEvent): DragPayload | null {
  const dt = e.dataTransfer;
  if (!dt) return null;
  const itemId = Number(dt.getData('itemId'));
  const source = dt.getData('source') as ShopSelectionSource;
  const slot = dt.getData('slot') as ShopSlotId;
  if (Number.isFinite(itemId) && itemId > 0 && source && slot) {
    return { itemId, source, slot };
  }
  try {
    const raw = dt.getData('text/plain');
    if (!raw) return null;
    const p = JSON.parse(raw) as Partial<DragPayload>;
    if (typeof p.itemId === 'number' && p.itemId > 0 && p.source && p.slot) {
      return { itemId: p.itemId, source: p.source, slot: p.slot };
    }
  } catch {
    return null;
  }
  return null;
}

export type UseShopDragDropDeps = {
  userId: string | undefined;
  storageId: number | string | undefined;
  queryClient: QueryClient;
  shopRef: RefObject<(ShopItem | null)[]>;
  inventoryRef: RefObject<(ShopItem | null)[]>;
  equippedRef: RefObject<Partial<Record<ShopSlotId, ShopItem>>>;
  setInventory: Dispatch<SetStateAction<(ShopItem | null)[]>>;
  setError: (error: string | null) => void;
  resetGoldOffset: () => void;
  recoverFromFailedMutation: () => Promise<void>;
  buyItem: (item: ShopItem) => Promise<void>;
  buyItemToInventory: (item: ShopItem, targetSlot: number | null) => Promise<void>;
  equipItem: (item: ShopItem) => Promise<void>;
  sellItem: (item: ShopItem, source: 'inventory' | 'equipped') => Promise<void>;
  unequipToChest: (item: ShopItem, targetSlot: number | null) => Promise<void>;
};

export function useShopDragDrop({
  userId,
  storageId,
  queryClient,
  shopRef,
  inventoryRef,
  equippedRef,
  setInventory,
  setError,
  resetGoldOffset,
  recoverFromFailedMutation,
  buyItem,
  buyItemToInventory,
  equipItem,
  sellItem,
  unequipToChest,
}: UseShopDragDropDeps) {
  const [draggedCategorySlot, setDraggedCategorySlot] = useState<ShopSlotId | null>(null);
  const [dragOverZone, setDragOverZone] = useState<string | null>(null);

  const activeDragSourceRef = useRef<ShopSelectionSource | null>(null);
  const [activeDragSource, setActiveDragSource] = useState<ShopSelectionSource | null>(null);

  const handleDragStart = useCallback((e: DragEvent, item: ShopItem, source: ShopSelectionSource) => {
    activeDragSourceRef.current = source;
    setActiveDragSource(source);
    setDraggedCategorySlot(item.slotId);
    const payload: DragPayload = { itemId: item.id, source, slot: item.slotId };
    e.dataTransfer.setData('itemId', String(item.id));
    e.dataTransfer.setData('source', source);
    e.dataTransfer.setData('slot', item.slotId);
    e.dataTransfer.setData('text/plain', JSON.stringify(payload));
    e.dataTransfer.effectAllowed = 'copyMove';
  }, []);

  const endDragSession = useCallback(() => {
    activeDragSourceRef.current = null;
    setActiveDragSource(null);
    setDragOverZone(null);
    setDraggedCategorySlot(null);
  }, []);

  const handleDragEnd = useCallback(() => {
    endDragSession();
  }, [endDragSession]);

  const peekDragSource = useCallback(() => activeDragSourceRef.current, []);

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const handleDropOnEquipSlot = useCallback(
    (e: DragEvent, slot: ShopSlotId) => {
      e.preventDefault();
      e.stopPropagation();
      setDragOverZone(null);
      const parsed = parseDragPayload(e);
      if (!parsed) {
        endDragSession();
        return;
      }
      const { itemId: id, source } = parsed;
      const shopState = shopRef.current;
      const inv = inventoryRef.current;

      if (source === 'equipped') {
        endDragSession();
        return;
      }

      if (source === 'shop') {
        const item = shopState.find((i) => i?.id === id);
        if (!item || item.slotId !== slot) {
          endDragSession();
          return;
        }
      } else if (source === 'inventory') {
        const item = inv.find((i) => i?.id === id);
        if (!item || item.slotId !== slot) {
          endDragSession();
          return;
        }
      } else {
        endDragSession();
        return;
      }

      endDragSession();

      void (async () => {
        if (source === 'shop') {
          const item = shopState.find((i) => i?.id === id);
          if (item) await buyItem(item);
        } else {
          const item = inv.find((i) => i?.id === id);
          if (item) await equipItem(item);
        }
      })();
    },
    [buyItem, equipItem, endDragSession, shopRef, inventoryRef]
  );

  const handleDropOnSellZone = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragOverZone(null);
      const parsed = parseDragPayload(e);
      if (!parsed) {
        endDragSession();
        return;
      }
      const { itemId: id, source, slot } = parsed;
      const inv = inventoryRef.current;
      const eq = equippedRef.current;

      let toSell: ShopItem | undefined;
      if (source === 'inventory') {
        toSell = inv.find((i) => i?.id === id) ?? undefined;
      } else if (source === 'equipped') {
        const item = eq[slot];
        if (item && item.id === id) toSell = item;
      }

      endDragSession();

      if (!toSell) return;
      const src: 'inventory' | 'equipped' = source === 'equipped' ? 'equipped' : 'inventory';
      void sellItem(toSell, src);
    },
    [sellItem, endDragSession, inventoryRef, equippedRef]
  );

  const handleDropOnChest = useCallback(
    (e: DragEvent, targetSlot: number | null) => {
      e.preventDefault();
      e.stopPropagation();
      setDragOverZone(null);
      const parsed = parseDragPayload(e);
      if (!parsed) {
        endDragSession();
        return;
      }

      if (parsed.source === 'shop') {
        const { itemId: id } = parsed;
        const item = shopRef.current.find((i) => i?.id === id);
        endDragSession();
        void (async () => {
          if (item && item.id === id) await buyItemToInventory(item, targetSlot);
        })();
        return;
      }

      if (parsed.source === 'equipped') {
        const { itemId: id, slot: itemSlot } = parsed;
        const item = equippedRef.current[itemSlot];
        endDragSession();
        void (async () => {
          if (item && item.id === id) await unequipToChest(item, targetSlot);
        })();
        return;
      }

      if (parsed.source === 'inventory') {
        if (targetSlot === null || targetSlot < 0 || targetSlot >= CHEST_SLOT_COUNT) {
          endDragSession();
          return;
        }
        const fromIndex = inventoryRef.current.findIndex((i) => i?.id === parsed.itemId);
        if (fromIndex === -1 || fromIndex === targetSlot) {
          endDragSession();
          return;
        }
        if (storageId == null) {
          endDragSession();
          return;
        }
        endDragSession();
        const snapshot = inventoryRef.current.map((x) => x);
        setInventory((prev) => {
          const n = [...prev];
          const a = n[fromIndex];
          const b = n[targetSlot];
          n[fromIndex] = b ?? null;
          n[targetSlot] = a ?? null;
          return n;
        });
        if (userId) {
          queryClient.setQueryData(queryKeys.currentUser(userId), (prev: GameUser | null | undefined) =>
            prev ? applyOptimisticStorageSwapToUserCache(prev, fromIndex, targetSlot) : prev
          );
        }
        void (async () => {
          try {
            await requestJson(`/storage/${storageId}/move-item/${fromIndex + 1}/${targetSlot + 1}`, {
              method: 'POST',
            });
            resetGoldOffset();
          } catch (e) {
            setError(getUserFacingApiErrorMessage(e));
            setInventory(snapshot);
            await recoverFromFailedMutation();
          }
        })();
        return;
      }

      endDragSession();
    },
    [
      buyItemToInventory,
      unequipToChest,
      endDragSession,
      storageId,
      resetGoldOffset,
      recoverFromFailedMutation,
      queryClient,
      userId,
      shopRef,
      inventoryRef,
      equippedRef,
      setInventory,
      setError,
    ]
  );

  return {
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
  };
}
