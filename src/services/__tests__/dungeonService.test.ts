import { describe, expect, it } from 'vitest';
import {
  mapFightToArenaResult,
  mapFightToDungeonVictoryRewards,
  type DungeonFightPayload,
} from '@/services/dungeonService';

function basePayload(overrides: Partial<DungeonFightPayload> = {}): DungeonFightPayload {
  return {
    won: true,
    logs: [],
    playerMaxHp: 100,
    opponentMaxHp: 80,
    fameEarned: 0,
    famePointsChange: 0,
    progress: { krypta: 1 },
    opponent: {
      id: 'dungeon-krypta-s1',
      name: 'Enemy',
      avatarId: 'captain',
      level: 15,
      famePoints: 0,
      strength: 10,
      agility: 10,
      endurance: 30,
      intelligence: 10,
      luck: 6,
    },
    rewards: { gold: 40, exp: 8 },
    updatedUser: {
      gold: 140,
      experiencePoints: 58,
      level: { name: '15', expToNextLevel: 500 },
    },
    ...overrides,
  };
}

describe('dungeonService mappers', () => {
  it('mapFightToArenaResult forwards battle fields', () => {
    const payload = basePayload();
    expect(mapFightToArenaResult(payload)).toEqual({
      won: true,
      logs: [],
      fameEarned: 0,
      famePointsChange: 0,
      playerMaxHp: 100,
      opponentMaxHp: 80,
    });
  });

  it('mapFightToDungeonVictoryRewards returns gold and xp on win', () => {
    expect(mapFightToDungeonVictoryRewards(basePayload())).toEqual({
      gold: 40,
      xp: 8,
      completionReward: null,
      dungeonCompleted: false,
    });
  });

  it('mapFightToDungeonVictoryRewards returns undefined on loss', () => {
    expect(
      mapFightToDungeonVictoryRewards(basePayload({ won: false, rewards: { gold: 0, exp: 0 } }))
    ).toBeUndefined();
  });

  it('mapFightToDungeonVictoryRewards returns undefined when rewards are empty', () => {
    expect(
      mapFightToDungeonVictoryRewards(basePayload({ rewards: { gold: 0, exp: 0 } }))
    ).toBeUndefined();
  });
});
