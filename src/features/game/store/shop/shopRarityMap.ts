import type { ItemRarity } from '@/features/game/character/characterTypes';
import type { ShopRarityId } from './types';

export function shopRarityToItemRarity(r: ShopRarityId): ItemRarity {
  switch (r) {
    case 'common':
      return 'common';
    case 'uncommon':
      return 'rare';
    case 'rare':
      return 'rare';
    case 'legendary':
      return 'legendary';
    default:
      return 'common';
  }
}
