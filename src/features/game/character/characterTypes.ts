export type SlotType = 'helmet' | 'weapon' | 'armor' | 'amulet' | 'ring' | 'boots';
export type ItemRarity = 'common' | 'rare' | 'epic' | 'legendary';
export type ItemStats = Partial<{
  strength: number;
  agility: number;
  endurance: number;
  intelligence: number;
  luck: number;
}>;

export type GameItem = {
  id: string;
  publicCode: string;
  nameKey?: string;
  displayName?: string;
  slot: SlotType;
  rarity: ItemRarity;
  level: number;
  sellPrice: number;
  image: string;
  stats: ItemStats;
};
