import { countsOf, isCount, isObject } from "@/lib/api/json";
import { parseAppearance, parseStats } from "@/modules/character/parseCharacterSheet";
import type { Fight, FighterSide, FighterSummary, FightRound } from "@/modules/combat/fight";

function isSide(value: unknown): value is FighterSide {
  return value === "player" || value === "npc";
}

function fighterOf(value: unknown): FighterSummary | null {
  if (!isObject(value)) return null;
  const { name, level, maxHp } = value;
  const stats = parseStats(value);
  if (typeof name !== "string" || !isCount(level) || !isCount(maxHp) || maxHp < 1 || !stats) return null;
  return { name, level, maxHp, ...stats };
}

function roundOf(value: unknown): FightRound | null {
  const round = countsOf(value, ["number", "damage", "playerHp", "npcHp"] as const);
  if (!round || !isObject(value) || !isSide(value.attacker)) return null;
  return { ...round, attacker: value.attacker };
}

function roundsOf(value: unknown): FightRound[] | null {
  if (!Array.isArray(value) || value.length === 0) return null;
  const rounds = value.map(roundOf);
  return rounds.every((round): round is FightRound => round !== null) ? rounds : null;
}

function npcOf(value: unknown): Fight["npc"] | null {
  if (!isObject(value) || typeof value.id !== "string") return null;
  const look = parseAppearance(value.look);
  const fighter = fighterOf(value.fighter);
  return look && fighter ? { id: value.id, look, fighter } : null;
}

export function parseFight(body: unknown): Fight | null {
  if (!isObject(body) || !isSide(body.winner) || typeof body.knockout !== "boolean" || !isCount(body.staminaCost)) return null;

  const player = fighterOf(body.player);
  const npc = npcOf(body.npc);
  const rounds = roundsOf(body.rounds);
  const reward = countsOf(body.reward, ["experience", "onions"] as const);
  const level = countsOf(body.level, ["before", "after"] as const);
  if (!player || !npc || !rounds || !reward || !level) return null;

  return { player, npc, winner: body.winner, knockout: body.knockout, rounds, reward, level, staminaCost: body.staminaCost };
}
