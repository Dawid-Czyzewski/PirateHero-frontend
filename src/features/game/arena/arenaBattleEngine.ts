import { AUTH_AVATARS } from '@/features/auth/authAvatars';
import { BASE_STATS } from '@/features/game/character/characterPageConfig';
import type { ArenaBattleLog, ArenaBattleResult, ArenaOpponent, ArenaPlayerStats } from './arenaTypes';

export const ARENA_PIRATE_NAMES = [
  'Czerwony Roger',
  'Jednooki Jim',
  'Lady Morgan',
  'Kapitan Flint',
  'Czarny Bart',
  'Srogi Jack',
  'Wściekła Mary',
  'Gruby Pete',
  'Szalony Diego',
  'Chudy Tom',
  'Krwawy Henry',
  'Dziki Bones',
  'Stary Hook',
  'Złoty Zając',
  'Mroczny Reis',
] as const;

export const DEFAULT_ARENA_PLAYER: ArenaPlayerStats = {
  ...BASE_STATS,
  level: 12,
};

export const ARENA_OPPONENT_COUNT = 5;

export type ArenaRng = () => number;

const defaultRng: ArenaRng = () => Math.random();

function pickDistinctNames(count: number, rng: ArenaRng): string[] {
  const pool = [...ARENA_PIRATE_NAMES];
  const out: string[] = [];
  for (let i = 0; i < count && pool.length > 0; i++) {
    const idx = Math.floor(rng() * pool.length);
    out.push(pool.splice(idx, 1)[0]);
  }
  while (out.length < count) {
    out.push(`Pirat ${out.length + 1}`);
  }
  return out;
}

export function generateOpponents(
  playerLevel: number,
  count: number = ARENA_OPPONENT_COUNT,
  rng: ArenaRng = defaultRng
): ArenaOpponent[] {
  const names = pickDistinctNames(count, rng);
  const baseId = Date.now();
  const avatarPool = AUTH_AVATARS.map((a) => a.id);
  return names.map((name, i) => {
    const level = Math.max(1, playerLevel + Math.floor(rng() * 7) - 3);
    const avatarId = avatarPool[Math.floor(rng() * avatarPool.length)] ?? 'captain';
    return {
      id: baseId + i,
      name,
      avatarId,
      level,
      famePoints: Math.max(0, 40 + level * 30 + Math.floor(rng() * 280)),
      strength: 20 + level * 3 + Math.floor(rng() * 10),
      agility: 20 + level * 2 + Math.floor(rng() * 10),
      endurance: 50 + level * 5 + Math.floor(rng() * 20),
      intelligence: 15 + level * 2 + Math.floor(rng() * 8),
      luck: 8 + Math.floor(rng() * 12),
    };
  });
}

const MAX_ROUNDS = 20;

function rollInt(min: number, max: number, rng: ArenaRng): number {
  return min + Math.floor(rng() * (max - min + 1));
}

function dodgeChancePercent(attackerAgility: number, defenderAgility: number): number {
  const t = attackerAgility + defenderAgility;
  if (t <= 0) return 50;
  return Math.round((defenderAgility / t) * 100);
}

function critChancePercent(attackerLuck: number, defenderLuck: number): number {
  const t = attackerLuck + defenderLuck;
  if (t <= 0) return 50;
  return Math.round((attackerLuck / t) * 100);
}

function baseDamage(strength: number, rng: ArenaRng): number {
  const f = rollInt(90, 110, rng) / 100;
  return Math.round(Math.max(1, strength) * f);
}

function mitigateDamage(raw: number, defenderInt: number, attackerStr: number): number {
  if (raw <= 0) return 0;
  const denom = defenderInt + attackerStr + 40;
  let pct = Math.round((100 * defenderInt) / Math.max(1, denom));
  pct = Math.min(30, Math.max(0, pct));
  const after = Math.round((raw * (100 - pct)) / 100);
  return Math.max(1, after);
}

export function simulateBattle(
  player: ArenaPlayerStats,
  opp: ArenaOpponent,
  rng: ArenaRng = defaultRng
): ArenaBattleResult {
  const pMaxHp = player.endurance * 3;
  const oMaxHp = opp.endurance * 3;
  let pHp = pMaxHp;
  let oHp = oMaxHp;
  const logs: ArenaBattleLog[] = [];

  let playerStarts =
    player.agility > opp.agility ? true : player.agility < opp.agility ? false : rollInt(0, 1, rng) === 1;

  for (let move = 1; move <= MAX_ROUNDS * 2 && pHp > 0 && oHp > 0; move++) {
    const isPlayer = move % 2 === 1 ? playerStarts : !playerStarts;
    const atk = isPlayer ? player : opp;
    const def = isPlayer ? opp : player;

    if (rollInt(1, 100, rng) <= dodgeChancePercent(atk.agility, def.agility)) {
      logs.push({ attackerIsPlayer: isPlayer, damage: 0, critical: false });
      continue;
    }

    const raw = baseDamage(atk.strength, rng);
    const isCrit = rollInt(1, 100, rng) <= critChancePercent(atk.luck, def.luck);
    let dmg = mitigateDamage(isCrit ? Math.floor(raw * 1.5) : raw, def.intelligence, atk.strength);

    if (isPlayer) {
      oHp = Math.max(0, oHp - dmg);
    } else {
      pHp = Math.max(0, pHp - dmg);
    }
    logs.push({ attackerIsPlayer: isPlayer, damage: dmg, critical: isCrit });
  }

  const won = pHp > oHp;
  const fameDelta = won ? 18 + opp.level * 4 : 0;
  return {
    won,
    logs,
    fameEarned: fameDelta,
    famePointsChange: fameDelta,
    playerMaxHp: pMaxHp,
    opponentMaxHp: oMaxHp,
  };
}

export function mulberry32(seed: number): ArenaRng {
  return () => {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
