import type { ItemStats, SlotType } from '@/data/gameItems';
import type { GameItem } from '@/features/game/character/characterTypes';

export function computeTotalStatsWithEquipment(
  baseStats: Required<ItemStats>,
  equipped: Partial<Record<SlotType, string>>,
  catalog: Map<string, GameItem>
): Required<ItemStats> {
  const total: Required<ItemStats> = { ...baseStats };
  Object.values(equipped).forEach((itemId) => {
    if (!itemId) return;
    const item = catalog.get(itemId);
    if (!item) return;
    (Object.entries(item.stats) as [keyof ItemStats, number][]).forEach(([key, value]) => {
      total[key] = (total[key] || 0) + value;
    });
  });
  return total;
}
