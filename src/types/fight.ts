import type { UserQuest } from '@/types/userQuests';

export type CombatStatsDto = {
  health?: number;
  strength?: number;
  agility?: number;
  critical?: number;
  luck?: number;
  intelligence?: number;
};

export type FightLogEntry = {
  moveNumber?: number;
  result?: string;
  damage: number;
  isPlayer: boolean;
  username: string;
};

export type FightMoveDto = {
  moveNumber?: number;
  result?: string;
  damage?: number;
  attackerHealthAfter?: number;
  defenderHealthAfter?: number;
  player?: { id?: string | number; username?: string };
};

export type FightOpponentTotalStats = {
  strength?: number;
  agility?: number;
  health?: number;
  critical?: number;
  luck?: number;
  intelligence?: number;
};


export type FightOpponentListItem = {
  id: string | number;
  username: string;
  avatarName?: string | null;
  level?: string | number;
  famePoints?: number;
  totalStats?: FightOpponentTotalStats;
};

export type FightHistoryEntry = {
  id: string;
  date?: string;
  opponent: { id?: string | number; username: string };
  famePointsChange: number;
  result: 'victory' | 'defeat' | string;
  wasAttacker?: boolean;
};


export type FightReplayParticipant = {
  id: number | string;
  username: string;
  avatarName?: string | null;
};

export type FightReplayData = {
  fightId: number | string;
  viewerWasAttacker: boolean;
  resultForViewer: 'victory' | 'defeat';
  famePointsChangeForViewer: number;
  attacker: FightReplayParticipant;
  defender: FightReplayParticipant;
  attackerMaxHp: number;
  defenderMaxHp: number;
  moves: FightMoveDto[];
};

export type FightStartSuccessData = {
  fightId?: number | string;
  result: 'victory' | 'defeat';
  attackerScore: number;
  defenderScore: number;
  famePointsChange: number;
  duelPointsSpent: number;
  playerId: number | string;
  opponentId: number | string;
  attackerUsername?: string;
  moves: FightMoveDto[];
  attackerStats: CombatStatsDto;
  defenderStats: CombatStatsDto;
  opponent: {
    id: number | string;
    username: string;
    famePoints: number;
    avatarName?: string | null;
  };
  opponents?: FightOpponentListItem[];
  quests?: UserQuest[];
  hasUnclaimedRewards?: boolean;
  unclaimedCount?: number;
  
  message?: string;
};

export type FightInProgressPlaceholder = {
  result: 'loading';
  message: string;
};

export type FightArenaFightResult = FightStartSuccessData | FightInProgressPlaceholder;
