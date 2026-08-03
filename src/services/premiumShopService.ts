import { requestJson } from '@/lib/api/requestJson';
import type {
  PremiumShopCatalogResponse,
  PremiumShopPurchaseResult,
  PremiumShopTransactionDto,
} from '@/types/premiumShop';

export async function fetchPremiumShopCatalog(): Promise<PremiumShopCatalogResponse> {
  return requestJson<PremiumShopCatalogResponse>('/users/premium-shop/catalog', {
    method: 'GET',
  });
}

export async function fetchPremiumShopTransactions(): Promise<PremiumShopTransactionDto[]> {
  const data = await requestJson<{ transactions?: PremiumShopTransactionDto[] }>(
    '/users/premium-shop/transactions',
    { method: 'GET' }
  );
  return data.transactions ?? [];
}

export async function purchasePremiumPack(packId: string): Promise<PremiumShopPurchaseResult> {
  return requestJson<PremiumShopPurchaseResult>('/users/premium-shop/purchase', {
    method: 'POST',
    body: { packId },
  });
}
