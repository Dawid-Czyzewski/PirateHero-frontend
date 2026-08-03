import { describe, expect, it } from 'vitest';
import {
  DEFAULT_ARENA_PLAYER,
  generateOpponents,
  mulberry32,
  simulateBattle,
} from '../arenaBattleEngine';

describe('arenaBattleEngine', () => {
  it('generateOpponents is deterministic with seeded rng', () => {
    const rng = mulberry32(12_345);
    const a = generateOpponents(10, 5, rng);
    const b = generateOpponents(10, 5, mulberry32(12_345));
    expect(a.map((x) => x.name)).toEqual(b.map((x) => x.name));
    expect(a.map((x) => x.avatarId)).toEqual(b.map((x) => x.avatarId));
    expect(a.map((x) => x.famePoints)).toEqual(b.map((x) => x.famePoints));
    expect(
      a.map((x) => ({
        strength: x.strength,
        agility: x.agility,
        endurance: x.endurance,
        intelligence: x.intelligence,
        luck: x.luck,
      }))
    ).toEqual(
      b.map((x) => ({
        strength: x.strength,
        agility: x.agility,
        endurance: x.endurance,
        intelligence: x.intelligence,
        luck: x.luck,
      }))
    );
  });

  it('simulateBattle is deterministic with seeded rng', () => {
    const opp = generateOpponents(10, 1, mulberry32(99))[0];
    const r1 = simulateBattle(DEFAULT_ARENA_PLAYER, opp, mulberry32(42));
    const r2 = simulateBattle(DEFAULT_ARENA_PLAYER, opp, mulberry32(42));
    expect(r1).toEqual(r2);
    expect(r1.logs.length).toBeGreaterThan(0);
    expect(r1.playerMaxHp).toBe(DEFAULT_ARENA_PLAYER.endurance * 3);
    expect(r1.opponentMaxHp).toBe(opp.endurance * 3);
  });
});
