export type DungeonId = 'krypta' | 'kraken' | 'forteca' | 'wulkan' | 'palac';

export type DungeonDifficulty = 'normal' | 'hard';

export type DungeonDefinition = {
  id: DungeonId;
  nameKey: string;
  descKey: string;
  reqLevel: number;
  bg: string;
  enemy: string;
  stageEnemies?: string[];
  stageEnemyNameKeys?: string[];
  enemyNameKey: string;
  baseHp: number;
  baseDmg: number;
  goldPerStage: number;
  completionGold: number;
  completionDiamonds: number;
  completionGrantsItem: boolean;
};

export type DungeonProgressMap = Record<string, number>;

export type DungeonProgressByDifficulty = {
  normal: DungeonProgressMap;
  hard: DungeonProgressMap;
};

export type DungeonView = 'list' | 'stages' | 'battle';

export const EMPTY_DUNGEON_PROGRESS: DungeonProgressByDifficulty = {
  normal: {},
  hard: {},
};
