import type { Appearance } from "@/modules/character/appearance";
import type { CharacterStats } from "@/modules/character/characterSheet";

export type Npc = {
  id: string;
  nick: string;
  level: number;
  maxHp: number;
  stats: CharacterStats;
  look: Appearance;
};

export const HARD_LEVEL_GAP = 2;

export function isHardFor(npc: Npc, playerLevel: number): boolean {
  return npc.level - playerLevel >= HARD_LEVEL_GAP;
}

export function byLevel(npcs: readonly Npc[]): Npc[] {
  return [...npcs].sort((first, second) => first.level - second.level);
}
