import type { ItemRarity, ItemStats, SlotType } from '@/features/game/character/characterTypes';

export type { ItemRarity, ItemStats, SlotType } from '@/features/game/character/characterTypes';
export type { GameItem } from '@/features/game/character/characterTypes';

export const SLOT_ORDER: SlotType[] = ['helmet', 'weapon', 'armor', 'amulet', 'ring', 'boots'];

export const RARITY_COLOR: Record<ItemRarity, string> = {
  common: 'text-muted-foreground',
  rare: 'text-blue-400',
  epic: 'text-purple-400',
  legendary: 'text-primary',
};

export const RARITY_BORDER: Record<ItemRarity, string> = {
  common: 'border-muted-foreground/25',
  rare: 'border-blue-400/45',
  epic: 'border-purple-400/45',
  legendary: 'border-primary/45',
};

export const RARITY_BG: Record<ItemRarity, string> = {
  common: 'bg-secondary/20',
  rare: 'bg-blue-400/10',
  epic: 'bg-purple-400/10',
  legendary: 'bg-primary/10',
};

export const RARITY_GLOW: Record<ItemRarity, string> = {
  common: '',
  rare: 'shadow-[0_0_10px_rgba(96,165,250,0.25)]',
  epic: 'shadow-[0_0_12px_rgba(192,132,252,0.28)]',
  legendary: 'shadow-[0_0_14px_rgba(250,204,21,0.28)]',
};
