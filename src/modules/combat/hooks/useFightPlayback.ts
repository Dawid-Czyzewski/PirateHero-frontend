"use client";

import { useCallback, useEffect, useState } from "react";
import type { Fight, FightRound } from "@/modules/combat/fight";

export const ROUND_MS = 800;

export type FightPlayback = {
  round: FightRound | null;
  revealed: FightRound[];
  playerHp: number;
  npcHp: number;
  finished: boolean;
  skip: () => void;
};

export function useFightPlayback(fight: Fight, stepMs: number = ROUND_MS): FightPlayback {
  const total = fight.rounds.length;
  const [shown, setShown] = useState(0);
  const finished = shown >= total;

  useEffect(() => {
    if (finished) return;
    const timer = setInterval(() => setShown((value) => Math.min(total, value + 1)), stepMs);
    return () => clearInterval(timer);
  }, [finished, total, stepMs]);

  const skip = useCallback(() => setShown(total), [total]);
  const round = shown > 0 ? fight.rounds[shown - 1] : null;

  return {
    round,
    revealed: fight.rounds.slice(0, shown),
    playerHp: round?.playerHp ?? fight.player.maxHp,
    npcHp: round?.npcHp ?? fight.npc.fighter.maxHp,
    finished,
    skip,
  };
}
