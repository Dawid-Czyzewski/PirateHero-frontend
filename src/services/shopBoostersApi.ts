import { requestJson } from '@/lib/api/requestJson';
import type { ShopBoosterDefinition } from '@/features/game/boosters/shopBoosterCatalog';
import type { ShopBoosterSessionEntry } from '@/features/game/boosters/sessionShopBoosterEffects';

export type PurchaseShopBoosterResponse = {
  sessionShopBoosters: ShopBoosterSessionEntry[];
};

export async function fetchShopBoosterCatalog(): Promise<ShopBoosterDefinition[]> {
  return requestJson<ShopBoosterDefinition[]>('/shop-boosters/catalog', {
    method: 'GET',
  });
}

export async function purchaseShopBoosterApi(boosterId: string): Promise<PurchaseShopBoosterResponse> {
  return requestJson<PurchaseShopBoosterResponse>('/shop-boosters/purchase', {
    method: 'POST',
    body: { boosterId },
  });
}

export async function pruneExpiredShopBoostersApi(): Promise<PurchaseShopBoosterResponse> {
  return requestJson<PurchaseShopBoosterResponse>('/shop-boosters/prune-expired', {
    method: 'POST',
    body: {},
  });
}
