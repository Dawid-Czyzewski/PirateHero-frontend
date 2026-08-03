import type { ArenaOpponent } from '@/features/game/arena/arenaTypes';
import type { DungeonDefinition } from './dungeonTypes';

export function dungeonEnemyNameKey(dungeon: DungeonDefinition, stage: number): string {
  const keys = dungeon.stageEnemyNameKeys;
  if (keys && keys.length > 0) {
    const idx = Math.max(0, Math.min(keys.length - 1, stage - 1));
    return keys[idx] ?? dungeon.enemyNameKey;
  }
  return dungeon.enemyNameKey;
}

export function dungeonEnemyPortrait(dungeon: DungeonDefinition, stage: number): string {
  const stages = dungeon.stageEnemies;
  if (stages && stages.length > 0) {
    const idx = Math.max(0, Math.min(stages.length - 1, stage - 1));
    return stages[idx] ?? dungeon.enemy;
  }
  return dungeon.enemy;
}

export function dungeonToArenaOpponent(
  dungeon: DungeonDefinition,
  stage: number,
  enemyDisplayName: string
): ArenaOpponent {
  const enemyHp = Math.round(dungeon.baseHp * (1 + (stage - 1) * 0.35));
  const enemyDmg = Math.round(dungeon.baseDmg * (1 + (stage - 1) * 0.2));
  const endurance = Math.max(1, Math.ceil(enemyHp / 3));
  const strength = Math.max(5, enemyDmg);

  return {
    id: `dungeon-${dungeon.id}-s${stage}`,
    name: enemyDisplayName,
    avatarId: 'captain',
    portraitSrc: dungeonEnemyPortrait(dungeon, stage),
    level: dungeon.reqLevel + stage - 1,
    famePoints: 0,
    strength,
    agility: Math.max(5, Math.round(strength * 0.85)),
    endurance,
    intelligence: 10 + stage,
    luck: 6 + Math.floor(stage / 2),
  };
}
