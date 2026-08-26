export type WearableItemSummaryDto = {
  id?: string | number;
  name?: string;
  nameKey?: string | null;
  type?: string;
  rarity?: string;
  price?: number;
  publicCode?: string;
  level?: number;
  imageKey?: string;
  upgradeLevel?: number;
  maxUpgradeLevel?: number;
  nextUpgradeCost?: number | null;
  specialization?: string | null;
  canSpecialize?: boolean;
  specializationCost?: number | null;
};
