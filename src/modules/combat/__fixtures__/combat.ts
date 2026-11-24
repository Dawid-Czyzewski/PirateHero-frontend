import type { Fight } from "@/modules/combat/fight";
import type { Npc } from "@/modules/combat/npc";

export const KOSA: Npc = {
  id: "kosa",
  nick: "Kosa",
  level: 1,
  maxHp: 15,
  stats: { strength: 1, endurance: 1, technique: 1, charisma: 1 },
  look: { face: 0, hair: 2, beard: 0, skin: 1, tattoo: 0 },
};

export const REKIN: Npc = {
  id: "rekin",
  nick: "Rekin",
  level: 5,
  maxHp: 65,
  stats: { strength: 4, endurance: 4, technique: 3, charisma: 1 },
  look: { face: 4, hair: 3, beard: 5, skin: 1, tattoo: 4 },
};

export const MLODY_WILK: Npc = {
  id: "mlody-wilk",
  nick: "Młody Wilk",
  level: 2,
  maxHp: 20,
  stats: { strength: 2, endurance: 1, technique: 2, charisma: 1 },
  look: { face: 1, hair: 5, beard: 1, skin: 0, tattoo: 2 },
};

export const FIGHT_AGAINST_KOSA: Fight = {
  player: { name: "Cebulak", level: 1, strength: 1, endurance: 1, technique: 1, charisma: 1, maxHp: 15 },
  npc: { id: "kosa", look: KOSA.look, fighter: { name: "Kosa", level: 1, strength: 1, endurance: 1, technique: 1, charisma: 1, maxHp: 15 } },
  winner: "player",
  knockout: true,
  rounds: [
    { number: 1, attacker: "player", damage: 3, playerHp: 15, npcHp: 12 },
    { number: 2, attacker: "npc", damage: 3, playerHp: 12, npcHp: 12 },
  ],
  reward: { experience: 25, onions: 15 },
  level: { before: 1, after: 1 },
  fightPointCost: 1,
};
