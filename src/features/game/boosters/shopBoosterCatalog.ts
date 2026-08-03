import { Compass, Dumbbell, Briefcase, Sparkles, type LucideIcon } from 'lucide-react';

export type ShopBoosterCategory = 'missions' | 'training' | 'work' | 'skills';
export type ShopCurrencyType = 'gold' | 'premium';

export type ShopBoosterDefinition = {
  id: string;
  name: string;
  description: string;
  effect: string;
  durationHours: number;
  price: number;
  currency: ShopCurrencyType;
  multiplier: string;
  category: ShopBoosterCategory;
};

export type ShopBoosterCategoryItem = {
  id: ShopBoosterCategory;
  label: string;
  icon: LucideIcon;
  colorClass: string;
};

export const SHOP_BOOSTER_DURATION_HOURS = 4 * 24;

export const shopBoosterCategories: ShopBoosterCategoryItem[] = [
  { id: 'missions', label: 'Misje', icon: Compass, colorClass: 'text-emerald-400' },
  { id: 'training', label: 'Trening', icon: Dumbbell, colorClass: 'text-blue-400' },
  { id: 'work', label: 'Praca', icon: Briefcase, colorClass: 'text-amber-400' },
  { id: 'skills', label: 'Umiejętności', icon: Sparkles, colorClass: 'text-purple-400' },
];

export const shopBoosterCatalog: ShopBoosterDefinition[] = [
  {
    id: 'mis_1',
    name: 'shopBooster.catalog.mis_1.name',
    description: 'shopBooster.catalog.mis_1.description',
    effect: '+5%',
    durationHours: SHOP_BOOSTER_DURATION_HOURS,
    price: 400,
    currency: 'gold',
    multiplier: '',
    category: 'missions',
  },
  {
    id: 'mis_2',
    name: 'shopBooster.catalog.mis_2.name',
    description: 'shopBooster.catalog.mis_2.description',
    effect: '+15%',
    durationHours: SHOP_BOOSTER_DURATION_HOURS,
    price: 1200,
    currency: 'gold',
    multiplier: '',
    category: 'missions',
  },
  {
    id: 'mis_3',
    name: 'shopBooster.catalog.mis_3.name',
    description: 'shopBooster.catalog.mis_3.description',
    effect: '+40%',
    durationHours: SHOP_BOOSTER_DURATION_HOURS,
    price: 5,
    currency: 'premium',
    multiplier: '',
    category: 'missions',
  },
  {
    id: 'trn_1',
    name: 'shopBooster.catalog.trn_1.name',
    description: 'shopBooster.catalog.trn_1.description',
    effect: '+5 pkt treningu',
    durationHours: SHOP_BOOSTER_DURATION_HOURS,
    price: 400,
    currency: 'gold',
    multiplier: '',
    category: 'training',
  },
  {
    id: 'trn_2',
    name: 'shopBooster.catalog.trn_2.name',
    description: 'shopBooster.catalog.trn_2.description',
    effect: '+15 pkt treningu',
    durationHours: SHOP_BOOSTER_DURATION_HOURS,
    price: 1200,
    currency: 'gold',
    multiplier: '',
    category: 'training',
  },
  {
    id: 'trn_3',
    name: 'shopBooster.catalog.trn_3.name',
    description: 'shopBooster.catalog.trn_3.description',
    effect: '+40 pkt treningu',
    durationHours: SHOP_BOOSTER_DURATION_HOURS,
    price: 5,
    currency: 'premium',
    multiplier: '',
    category: 'training',
  },
  {
    id: 'wrk_1',
    name: 'shopBooster.catalog.wrk_1.name',
    description: 'shopBooster.catalog.wrk_1.description',
    effect: '+5%',
    durationHours: SHOP_BOOSTER_DURATION_HOURS,
    price: 400,
    currency: 'gold',
    multiplier: '',
    category: 'work',
  },
  {
    id: 'wrk_2',
    name: 'shopBooster.catalog.wrk_2.name',
    description: 'shopBooster.catalog.wrk_2.description',
    effect: '+15%',
    durationHours: SHOP_BOOSTER_DURATION_HOURS,
    price: 1200,
    currency: 'gold',
    multiplier: '',
    category: 'work',
  },
  {
    id: 'wrk_3',
    name: 'shopBooster.catalog.wrk_3.name',
    description: 'shopBooster.catalog.wrk_3.description',
    effect: '+40%',
    durationHours: SHOP_BOOSTER_DURATION_HOURS,
    price: 5,
    currency: 'premium',
    multiplier: '',
    category: 'work',
  },
  {
    id: 'skl_1',
    name: 'shopBooster.catalog.skl_1.name',
    description: 'shopBooster.catalog.skl_1.description',
    effect: '+5%',
    durationHours: SHOP_BOOSTER_DURATION_HOURS,
    price: 400,
    currency: 'gold',
    multiplier: '',
    category: 'skills',
  },
  {
    id: 'skl_2',
    name: 'shopBooster.catalog.skl_2.name',
    description: 'shopBooster.catalog.skl_2.description',
    effect: '+15%',
    durationHours: SHOP_BOOSTER_DURATION_HOURS,
    price: 1200,
    currency: 'gold',
    multiplier: '',
    category: 'skills',
  },
  {
    id: 'skl_3',
    name: 'shopBooster.catalog.skl_3.name',
    description: 'shopBooster.catalog.skl_3.description',
    effect: '+40%',
    durationHours: SHOP_BOOSTER_DURATION_HOURS,
    price: 5,
    currency: 'premium',
    multiplier: '',
    category: 'skills',
  },
];

const LEGACY_SHOP_BOOSTER_ID_TO_CURRENT: Record<string, string> = {
  m1: 'mis_1',
  m2: 'mis_2',
  m3: 'mis_3',
  t1: 'trn_1',
  t2: 'trn_2',
  t3: 'trn_3',
  w1: 'wrk_1',
  w2: 'wrk_2',
  w3: 'wrk_3',
  s1: 'skl_1',
  s2: 'skl_2',
  s3: 'skl_3',
};

const byId = new Map(shopBoosterCatalog.map((b) => [b.id, b]));

export function normalizeShopBoosterPublicCode(id: string): string {
  const t = id.trim();
  return LEGACY_SHOP_BOOSTER_ID_TO_CURRENT[t] ?? t;
}

export function getShopBoosterById(id: string): ShopBoosterDefinition | undefined {
  if (!id) return undefined;
  return byId.get(normalizeShopBoosterPublicCode(id));
}

export function getShopBoosterCategory(boosterId: string): ShopBoosterCategory | null {
  return getShopBoosterById(boosterId)?.category ?? null;
}
