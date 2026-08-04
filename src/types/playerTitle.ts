export type EquippedTitleDto = {
  code: string;
  nameKey: string;
};

export type PlayerTitleDto = {
  code: string;
  nameKey: string;
  descriptionKey: string;
  unlocked: boolean;
  unlockedAt: string | null;
  progress?: { current: number; target: number };
};

export type PlayerTitlesResponse = {
  equippedTitleCode: string | null;
  titles: PlayerTitleDto[];
};

export type EquipTitleResponse = {
  equipped: boolean;
  equippedTitleCode: string | null;
};
