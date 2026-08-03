export type PremiumPackBadge = 'popular' | 'bestValue';

export type PremiumDiamondPack = {
  id: string;
  diamonds: number;
  bonusPercent: number;
  pricePln: number;
  totalDiamonds: number;
  badge?: PremiumPackBadge;
};

export type PremiumFeaturedPack = {
  id: string;
  diamonds: number;
  gold: number;
  pricePln: number;
  maxLevel: number;
};
