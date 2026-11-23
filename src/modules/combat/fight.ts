import type { Appearance } from "@/modules/character/appearance";
import type { CharacterStats } from "@/modules/character/characterSheet";

export type FighterSide = "player" | "npc";

export type FighterSummary = CharacterStats & { name: string; level: number; maxHp: number };

export type FightRound = {
  number: number;
  attacker: FighterSide;
  damage: number;
  playerHp: number;
  npcHp: number;
};

export type FightReward = { experience: number; onions: number };

export type Fight = {
  player: FighterSummary;
  npc: { id: string; look: Appearance; fighter: FighterSummary };
  winner: FighterSide;
  knockout: boolean;
  rounds: FightRound[];
  reward: FightReward;
  level: { before: number; after: number };
  staminaCost: number;
};

export const FIGHT_STAMINA_COST = 0;

export function playerWon(fight: Fight): boolean {
  return fight.winner === "player";
}

export function leveledUp(fight: Fight): boolean {
  return fight.level.after > fight.level.before;
}
