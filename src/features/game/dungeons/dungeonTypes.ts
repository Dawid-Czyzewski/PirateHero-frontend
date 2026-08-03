export type DungeonId = 'krypta' | 'kraken' | 'forteca' | 'wulkan' | 'palac';

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

export type DungeonProgress = Record<string, number>;
export type DungeonView = 'list' | 'stages' | 'battle';
