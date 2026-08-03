import { resolveItemImageUrl } from '@/features/game/character/itemImages';
import type { ShopItem } from './types';

export function shopItemImageSrc(item: ShopItem): string {
  return resolveItemImageUrl(item.imageKey);
}
