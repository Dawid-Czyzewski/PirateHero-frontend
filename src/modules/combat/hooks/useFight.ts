"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { AUTH_ROUTES } from "@/modules/auth/authRoutes";
import type { Fight } from "@/modules/combat/fight";
import { FIGHT_ERRORS, fightNpc, type FightFailure } from "@/modules/combat/fightNpc";

export type FightState =
  | { kind: "idle" }
  | { kind: "pending"; npcId: string }
  | { kind: "done"; fight: Fight }
  | { kind: "failed"; reason: FightFailure; message: string };

export type FightSession = {
  state: FightState;
  start: (npcId: string) => void;
  reset: () => void;
};

const IDLE: FightState = { kind: "idle" };

export function useFight(): FightSession {
  const router = useRouter();
  const [state, setState] = useState<FightState>(IDLE);

  const start = useCallback(
    async (npcId: string) => {
      setState({ kind: "pending", npcId });
      const result = await fightNpc(npcId);

      if (result.kind === "unauthenticated") {
        router.replace(AUTH_ROUTES.login);
        return;
      }
      setState(result.kind === "fought" ? { kind: "done", fight: result.fight } : { kind: "failed", reason: result.reason, message: FIGHT_ERRORS[result.reason] });
    },
    [router],
  );

  const reset = useCallback(() => setState(IDLE), []);

  return { state, start, reset };
}
