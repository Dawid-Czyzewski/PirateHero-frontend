export type ShopSlotId =
  | 'helmet'
  | 'weapon'
  | 'armor'
  | 'shield'
  | 'gloves'
  | 'boots'
  | 'amulet'
  | 'ring'
  | 'potions';

export type ShopRarityId = 'common' | 'uncommon' | 'rare' | 'legendary';

export type ShopStatId =
  | 'strength'
  | 'defense'
  | 'health'
  | 'speed'
  | 'agility'
  | 'luck'
  | 'intelligence';

export type ShopItem = {
  id: number;
  nameKey: string;
  displayLabel?: string;
  imageKey?: string;
  slotId: ShopSlotId;
  price: number;
  rarity: ShopRarityId;
  stats: { statId: ShopStatId; value: number }[];
  storeSlotId?: number;
  storageSlotId?: number;
};

export type ShopSelectionSource = 'shop' | 'inventory' | 'equipped';
