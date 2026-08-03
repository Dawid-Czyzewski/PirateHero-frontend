import { useCallback, useEffect, useRef, useState } from 'react';
import type { QueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query/queryKeys';
import { requestJson } from '@/lib/api/requestJson';
import type { GameUser } from '@/types/gameUser';
import type { GameShopUserState } from '@/types/gameShopState';
import { getUserFacingApiErrorMessage } from '@/lib/apiError';
import { CHEST_SLOT_COUNT } from './characterEquipLayout';
import { SHOP_OFFER_COUNT, SHOP_SLOT_ORDER } from './slotOrder';
import type { ShopItem, ShopSlotId } from './types';

export function emptyShopSlots(): (ShopItem | null)[] {
  return Array.from({ length: SHOP_OFFER_COUNT }, () => null);
}

function normalizeShopPayload(shop: GameShopUserState['shop']): (ShopItem | null)[] {
  if (Array.isArray(shop)) {
    return Array.from({ length: SHOP_OFFER_COUNT }, (_, i) =>
      shop[i] && typeof shop[i] === 'object' ? (shop[i] as ShopItem) : null
    );
  }
  const next = emptyShopSlots();
  let i = 0;
  for (const k of SHOP_SLOT_ORDER) {
    const v = shop[k];
    next[i++] = v && typeof v === 'object' ? (v as ShopItem) : null;
  }
  return next;
}

function countNonNullShopOffers(shop: GameShopUserState['shop']): number {
  if (Array.isArray(shop)) {
    return shop.filter(Boolean).length;
  }
  return Object.values(shop ?? {}).filter(Boolean).length;
}

function countEquippedSlots(eq: GameShopUserState['equipped'] | undefined): number {
  return Object.values(eq ?? {}).filter(Boolean).length;
}

function countChestItems(inv: (ShopItem | null)[] | undefined): number {
  return (inv ?? []).filter(Boolean).length;
}

function isShopStateStrictlyRicher(a: GameShopUserState, b: GameShopUserState): boolean {
  const ae = countEquippedSlots(a.equipped);
  const be = countEquippedSlots(b.equipped);
  if (ae > be) return true;
  if (ae < be) return false;
  const ai = countChestItems(a.inventory);
  const bi = countChestItems(b.inventory);
  if (ai > bi) return true;
  if (ai < bi) return false;
  return countNonNullShopOffers(a.shop) > countNonNullShopOffers(b.shop);
}

export function storageEquipmentFingerprint(u: GameUser | null | undefined): string {
  if (!u) return '';
  const slots = [...(u.storage?.slots ?? [])].sort(
    (a, b) => (Number(a.slotNumber) || 0) - (Number(b.slotNumber) || 0)
  );
  const inv = slots.map((s) => s.item?.id ?? s.wearableItem?.id ?? null).join(',');
  const eq = (u.userEquipment?.userEquipmentSlots ?? [])
    .map((s) => `${String(s.type ?? '')}:${s.wearableItem?.id ?? ''}`)
    .sort()
    .join('|');
  return `${inv}#${eq}`;
}

export type UseShopCatalogDeps = {
  userId: string | undefined;
  user: GameUser | null | undefined;
  queryClient: QueryClient;
  fetchUserData?: () => void | Promise<unknown>;
  resetGoldOffset: () => void;
};

export function useShopCatalog({ userId, user, queryClient, fetchUserData, resetGoldOffset }: UseShopCatalogDeps) {
  const skipProfileHydrateRef = useRef(false);

  const [equipped, setEquipped] = useState<Partial<Record<ShopSlotId, ShopItem>>>({});
  const [inventory, setInventory] = useState<(ShopItem | null)[]>(() =>
    Array.from({ length: CHEST_SLOT_COUNT }, () => null)
  );
  const [shop, setShop] = useState<(ShopItem | null)[]>(emptyShopSlots);
  const [refreshMeta, setRefreshMeta] = useState({ isFreeRefreshAvailable: true, refreshCost: 1 });

  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const shopRef = useRef(shop);
  useEffect(() => {
    shopRef.current = shop;
  }, [shop]);

  const storageEquipPrint = storageEquipmentFingerprint(user ?? null);

  const applyPayload = useCallback((data: GameShopUserState) => {
    setShop(normalizeShopPayload(data.shop));
    const inv = data.inventory ?? [];
    setInventory(
      Array.from({ length: CHEST_SLOT_COUNT }, (_, i) =>
        i < inv.length ? inv[i] ?? null : null
      ) as (ShopItem | null)[]
    );
    const eq: Partial<Record<ShopSlotId, ShopItem>> = {};
    for (const k of Object.keys(data.equipped ?? {})) {
      const slot = k as ShopSlotId;
      const v = data.equipped[slot];
      if (v) eq[slot] = v as ShopItem;
    }
    setEquipped(eq);
    if (data.refresh) {
      setRefreshMeta({
        isFreeRefreshAvailable: !!data.refresh.isFreeRefreshAvailable,
        refreshCost: Number(data.refresh.refreshCost ?? 1),
      });
    }
  }, []);

  const loadState = useCallback(async () => {
    if (!userId) return;
    try {
      const data = await requestJson<GameShopUserState>('/game-shop/state', { method: 'GET' });
      applyPayload(data);
      queryClient.setQueryData(queryKeys.currentUser(userId), (prev: GameUser | null | undefined) =>
        prev ? { ...prev, gameShop: data, gold: data.gold } : prev
      );
      setError(null);
    } catch (e) {
      setError(getUserFacingApiErrorMessage(e));
    }
  }, [userId, applyPayload, queryClient]);

  useEffect(() => {
    if (!user?.gameShop) return;
    if (skipProfileHydrateRef.current) return;
    applyPayload(user.gameShop);
    setError(null);
  }, [userId, storageEquipPrint, user?.gameShop, applyPayload]);

  useEffect(() => {
    if (!userId || user?.gameShop) return;
    void loadState();
  }, [userId, user?.gameShop, loadState]);

  const syncShopFromResponse = useCallback(
    (data: unknown) => {
      const full =
        data &&
        typeof data === 'object' &&
        'gold' in data &&
        'shop' in data &&
        'inventory' in data &&
        'equipped' in data
          ? (data as GameShopUserState)
          : null;

      if (full) {
        skipProfileHydrateRef.current = true;
        applyPayload(full);
        if (userId) {
          queryClient.setQueryData(queryKeys.currentUser(userId), (prev: GameUser | null | undefined) =>
            prev ? { ...prev, gameShop: full, gold: full.gold } : prev
          );
        }
      }
      resetGoldOffset();

      queueMicrotask(() => {
        if (full) {
          applyPayload(full);
          if (userId) {
            const cached = queryClient.getQueryData<GameUser | null | undefined>(
              queryKeys.currentUser(userId)
            );
            if (cached?.gameShop && isShopStateStrictlyRicher(full, cached.gameShop)) {
              queryClient.setQueryData(queryKeys.currentUser(userId), (prev: GameUser | null | undefined) =>
                prev ? { ...prev, gameShop: full, gold: full.gold } : prev
              );
            }
          }
          requestAnimationFrame(() => {
            skipProfileHydrateRef.current = false;
          });
        }
      });
    },
    [applyPayload, resetGoldOffset, queryClient, userId]
  );

  const recoverFromFailedMutation = useCallback(async () => {
    await loadState();
    await fetchUserData?.();
    resetGoldOffset();
  }, [loadState, fetchUserData, resetGoldOffset]);

  const postPurchase = useCallback(async (item: ShopItem, chestSlotIndex: number) => {
    const storeSlotId = item.storeSlotId;
    if (storeSlotId == null) throw new Error('storeSlotId missing');
    return requestJson<GameShopUserState>('/game-shop/purchase', {
      method: 'POST',
      body: { storeSlotId, chestSlotIndex },
    });
  }, []);

  const refreshOffer = useCallback(async () => {
    const meta = refreshMeta;
    const paid = !meta.isFreeRefreshAvailable;
    const cost = meta.refreshCost;
    if (paid) {
      const d = Number(user?.diamonds ?? 0);
      if (d < cost) return;
      if (userId) {
        queryClient.setQueryData(queryKeys.currentUser(userId), (prev: GameUser | null | undefined) =>
          prev ? { ...prev, diamonds: Math.max(0, Number(prev.diamonds ?? 0) - cost) } : prev
        );
      }
    }
    setRefreshing(true);
    setError(null);
    try {
      const data = await requestJson<GameShopUserState>('/game-shop/refresh', {
        method: 'POST',
      });
      syncShopFromResponse(data);
    } catch (e) {
      setError(getUserFacingApiErrorMessage(e));
      await recoverFromFailedMutation();
    } finally {
      setRefreshing(false);
    }
  }, [refreshMeta, user?.diamonds, userId, queryClient, syncShopFromResponse, recoverFromFailedMutation]);

  return {
    shop,
    setShop,
    shopRef,
    inventory,
    setInventory,
    equipped,
    setEquipped,
    refreshMeta,
    refreshing,
    error,
    setError,
    slotOrder: SHOP_SLOT_ORDER,
    reload: loadState,
    refreshOffer,
    syncShopFromResponse,
    recoverFromFailedMutation,
    postPurchase,
  };
}
