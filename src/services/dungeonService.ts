import { requestJson } from '@/lib/api/requestJson';
import type { ArenaBattleResult, ArenaDungeonVictoryRewards, ArenaOpponent, ArenaPlayerStats } from '@/features/game/arena/arenaTypes';
import type { DungeonDifficulty, DungeonProgressByDifficulty } from '@/features/game/dungeons/dungeonTypes';

export type DungeonProgressPayload = {
  progress: DungeonProgressByDifficulty;
  playerStats: ArenaPlayerStats;
  cooldownUntil?: string | null;
  cooldownSecondsRemaining?: number;
};

type ApiOpponent = ArenaOpponent & { enemyNameKey?: string };

import type { GameUser } from '@/types/gameUser';

export type DungeonCompletionReward = {
  gold: number;
  diamonds: number;
  item?: {
    id: number | string;
    name: string;
    nameKey?: string | null;
    imageKey?: string | null;
    rarity?: string | null;
    type?: string | null;
    price?: number;
    statistics?: Record<string, number> | null;
  } | null;
};

export type DungeonStageRewards = {
  gold: number;
  exp: number;
};

export type DungeonFightUpdatedUser = {
  gold: number;
  diamonds?: number;
  experiencePoints: number;
  freeSkillPointsAvailable?: number;
  level: { name: string; expToNextLevel: number };
  storage?: GameUser['storage'];
};

export type DungeonFightPayload = {
  won: boolean;
  logs: ArenaBattleResult['logs'];
  playerMaxHp: number;
  opponentMaxHp: number;
  fameEarned: number;
  famePointsChange: number;
  progress: DungeonProgressByDifficulty;
  opponent: ApiOpponent;
  rewards: DungeonStageRewards;
  completionReward?: DungeonCompletionReward | null;
  dungeonCompleted?: boolean;
  rewardItem?: DungeonCompletionReward['item'];
  updatedUser: DungeonFightUpdatedUser | null;
  cooldownUntil?: string | null;
  cooldownSecondsRemaining?: number;
};

export async function fetchDungeonProgress(): Promise<DungeonProgressPayload> {
  return requestJson<DungeonProgressPayload>('/users/dungeons/progress', { method: 'GET' });
}

export async function fightDungeonStage(
  dungeonId: string,
  stage: number,
  difficulty: DungeonDifficulty = 'normal'
): Promise<DungeonFightPayload> {
  return requestJson<DungeonFightPayload>('/users/dungeons/fight', {
    method: 'POST',
    body: { dungeonId, stage, difficulty },
  });
}

export function mapFightToArenaResult(payload: DungeonFightPayload): ArenaBattleResult {
  return {
    won: payload.won,
    logs: payload.logs,
    fameEarned: payload.fameEarned,
    famePointsChange: payload.famePointsChange,
    playerMaxHp: payload.playerMaxHp,
    opponentMaxHp: payload.opponentMaxHp,
  };
}

export function mapFightToDungeonVictoryRewards(
  payload: Pick<DungeonFightPayload, 'won' | 'rewards' | 'completionReward' | 'dungeonCompleted'>
): ArenaDungeonVictoryRewards | undefined {
  if (!payload.won) {
    return undefined;
  }

  const hasStageRewards = payload.rewards.gold > 0 || payload.rewards.exp > 0;
  const hasCompletion = Boolean(payload.completionReward && (
    payload.completionReward.gold > 0
    || payload.completionReward.diamonds > 0
    || payload.completionReward.item
  ));

  if (!hasStageRewards && !hasCompletion) {
    return undefined;
  }

  return {
    gold: payload.rewards.gold,
    xp: payload.rewards.exp,
    completionReward: payload.completionReward ?? null,
    dungeonCompleted: payload.dungeonCompleted ?? false,
  };
}

export function mapApiOpponent(
  api: ApiOpponent,
  displayName: string,
  portraitSrc?: string
): ArenaOpponent {
  return {
    ...api,
    id: api.id,
    name: displayName,
    portraitSrc,
    avatarId: api.avatarId ?? 'captain',
  };
}
