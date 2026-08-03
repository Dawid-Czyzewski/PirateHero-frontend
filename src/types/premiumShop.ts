export type PremiumShopTransactionDto = {
  id: number | string;
  packId: string;
  diamonds: number;
  pricePln: number;
  purchasedAt: string;
};

export type PremiumShopPackDto = {
  id: string;
  diamonds: number;
  bonusPercent: number;
  pricePln: number;
  totalDiamonds: number;
  badge?: 'popular' | 'bestValue';
};

export type PremiumShopCatalogResponse = {
  packs: PremiumShopPackDto[];
};

export type PremiumShopPurchaseResult = {
  transaction: PremiumShopTransactionDto;
  updatedUser: {
    diamonds: number;
  };
};
