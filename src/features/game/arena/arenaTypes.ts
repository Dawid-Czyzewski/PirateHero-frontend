import type { ItemStats } from '@/data/gameItems';

export type ArenaCombatStats = Required<ItemStats>;

export type ArenaOpponent = {
  id: string | number;
  name: string;
  avatarId: string;
  portraitSrc?: string;
  level: number;
  famePoints: number;
} & ArenaCombatStats;

export type ArenaDungeonRewardItem = {
  id: number | string;
  name: string;
  nameKey?: string | null;
  imageKey?: string | null;
  rarity?: string | null;
  type?: string | null;
  price?: number;
  statistics?: Record<string, number> | null;
};

export type ArenaDungeonVictoryRewards = {
  gold: number;
  xp: number;
  completionReward?: {
    gold: number;
    diamonds: number;
    item?: ArenaDungeonRewardItem | null;
  } | null;
  dungeonCompleted?: boolean;
};

export type ArenaBattleLog = {
  attackerIsPlayer: boolean;
  damage: number;
  critical: boolean;
  dodge?: boolean;
  attackerHpAfter?: number;
  defenderHpAfter?: number;
  strikerName?: string;
  targetName?: string;
};

export type ArenaBattleResult = {
  won: boolean;
  logs: ArenaBattleLog[];
  fameEarned: number;
  famePointsChange: number;
  playerMaxHp: number;
  opponentMaxHp: number;
};

export type ArenaBattleHistoryEntry = {
  id: string | number;
  opponent: ArenaOpponent;
  date: Date;
  won: boolean;
  fameChange: number;
  fightId?: string;
  battleResult?: ArenaBattleResult;
};

export type ArenaPlayerStats = ArenaCombatStats & { level: number };

export type FighterAnim = 'idle' | 'attack' | 'hit';

export type FloatingDamage = {
  id: number;
  value: number;
  critical: boolean;
  side: 'left' | 'right';
  dodge?: boolean;
};
