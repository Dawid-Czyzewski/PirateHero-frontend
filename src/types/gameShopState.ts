import type { ShopItem, ShopSlotId } from '@/features/game/store/shop/types';

export type GameShopUserState = {
  gold: number;
  shop: (ShopItem | null)[] | Partial<Record<ShopSlotId, ShopItem | null>>;
  inventory: (ShopItem | null)[];
  equipped: Partial<Record<string, ShopItem | null>>;
  refresh: { isFreeRefreshAvailable: boolean; refreshCost: number };
};
