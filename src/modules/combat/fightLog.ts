import type { Fight, FighterSide, FightRound } from "@/modules/combat/fight";

function nameOf(fight: Fight, side: FighterSide): string {
  return side === "player" ? fight.player.name : fight.npc.fighter.name;
}

export function describeRound(round: FightRound, fight: Fight): string {
  const attacker = nameOf(fight, round.attacker);
  const defender = nameOf(fight, round.attacker === "player" ? "npc" : "player");
  return `Runda ${round.number}: ${attacker} → ${defender}: -${round.damage}. HP: ${fight.player.name} ${round.playerHp}, ${fight.npc.fighter.name} ${round.npcHp}`;
}

export function isKnockoutBlow(round: FightRound, fight: Fight): boolean {
  return fight.knockout && round.number === fight.rounds[fight.rounds.length - 1]?.number;
}
