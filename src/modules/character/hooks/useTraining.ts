"use client";

import { useRouter } from "next/navigation";
import { useCallback, useRef, useState } from "react";
import { AUTH_ROUTES } from "@/modules/auth/authRoutes";
import { CHARACTER_ROUTES } from "@/modules/character/characterRoutes";
import type { CharacterSheet, StatKey } from "@/modules/character/characterSheet";
import { useCharacterSheetSession } from "@/modules/character/hooks/CharacterSheetContext";
import { trainStat, type TrainStatResult } from "@/modules/character/trainStat";
import { applyTraining, revertTraining, TRAINING_ERRORS } from "@/modules/character/training";

type RedirectKind = Extract<TrainStatResult, { kind: "missing" | "unauthenticated" }>["kind"];

export type TrainingGain = { stat: StatKey; id: number };

export type TrainingSession = {
  lastGain: TrainingGain | null;
  error: string | null;
  train: (stat: StatKey) => void;
};

const REDIRECTS: Record<RedirectKind, string> = {
  missing: CHARACTER_ROUTES.create,
  unauthenticated: AUTH_ROUTES.login,
};

export function useTraining(): TrainingSession {
  const router = useRouter();
  const { refresh, updateCharacter } = useCharacterSheetSession();
  const [lastGain, setLastGain] = useState<TrainingGain | null>(null);
  const [error, setError] = useState<string | null>(null);
  const queue = useRef<Promise<void>>(Promise.resolve());
  const inFlight = useRef(0);
  const confirmed = useRef<CharacterSheet | null>(null);

  const settle = useCallback(
    (stat: StatKey, result: TrainStatResult) => {
      inFlight.current -= 1;
      const idle = inFlight.current === 0;
      const fallback = confirmed.current;
      confirmed.current = idle ? null : fallback;

      if (result.kind === "trained") {
        if (idle) updateCharacter(() => result.character);
        else confirmed.current = result.character;
        return;
      }
      updateCharacter((character) => (idle && fallback ? fallback : revertTraining(character, stat)));
      setLastGain(null);
      if (result.kind !== "failure") {
        router.replace(REDIRECTS[result.kind]);
        return;
      }
      setError(TRAINING_ERRORS[result.reason]);
      if (result.reason === "no-stamina") refresh();
    },
    [refresh, router, updateCharacter],
  );

  const train = useCallback(
    (stat: StatKey) => {
      setError(null);
      updateCharacter((character) => applyTraining(character, stat));
      setLastGain((previous) => ({ stat, id: (previous?.id ?? 0) + 1 }));
      inFlight.current += 1;
      queue.current = queue.current.then(async () => settle(stat, await trainStat(stat)));
    },
    [settle, updateCharacter],
  );

  return { lastGain, error, train };
}
