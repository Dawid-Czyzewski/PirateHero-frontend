export type CharacterStatItem = {
  key: string;
  icon: 'sword' | 'zap' | 'heart' | 'shield' | 'clover';
  colorClass: string;
  value: number;
};

export type CharacterEquipmentItem = {
  slotKey: string;
  nameKey: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  bonus: string;
};
