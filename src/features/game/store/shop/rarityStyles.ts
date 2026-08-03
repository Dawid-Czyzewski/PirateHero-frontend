import { RARITY_BG, RARITY_BORDER, RARITY_COLOR } from '@/data/gameItems';
import type { ShopRarityId } from './types';

export type RarityStyle = {
  border: string;
  text: string;
  bg: string;
  ring: string;
};

export const SHOP_RARITY_STYLES: Record<ShopRarityId, RarityStyle> = {
  common: {
    border: RARITY_BORDER.common,
    text: RARITY_COLOR.common,
    bg: RARITY_BG.common,
    ring: 'ring-muted-foreground/25',
  },
  uncommon: {
    border: 'border-secondary/60',
    text: 'text-secondary-foreground',
    bg: 'bg-secondary/15',
    ring: 'ring-secondary/60',
  },
  rare: {
    border: RARITY_BORDER.rare,
    text: RARITY_COLOR.rare,
    bg: RARITY_BG.rare,
    ring: 'ring-blue-400/40',
  },
  legendary: {
    border: RARITY_BORDER.legendary,
    text: RARITY_COLOR.legendary,
    bg: RARITY_BG.legendary,
    ring: 'ring-primary/50',
  },
};
