"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { AUTH_ROUTES } from "@/modules/auth/authRoutes";
import { CHARACTER_ROUTES } from "@/modules/character/characterRoutes";
import type { StatKey } from "@/modules/character/characterSheet";
import { useCharacterSheetSession } from "@/modules/character/hooks/CharacterSheetContext";
import { trainStat, type TrainStatResult } from "@/modules/character/trainStat";

type RedirectKind = Extract<TrainStatResult, { kind: "missing" | "unauthenticated" }>["kind"];
import { TRAINING_ERRORS } from "@/modules/character/training";

export type TrainingGain = { stat: StatKey; id: number };

export type TrainingSession = {
  pendingStat: StatKey | null;
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
  const { refresh, replaceCharacter } = useCharacterSheetSession();
  const [pendingStat, setPendingStat] = useState<StatKey | null>(null);
  const [lastGain, setLastGain] = useState<TrainingGain | null>(null);
  const [error, setError] = useState<string | null>(null);

  const train = useCallback(
    async (stat: StatKey) => {
      setPendingStat(stat);
      setError(null);
      const result = await trainStat(stat);
      setPendingStat(null);

      if (result.kind === "trained") {
        replaceCharacter(result.character);
        setLastGain((previous) => ({ stat, id: (previous?.id ?? 0) + 1 }));
        return;
      }
      if (result.kind === "failure") {
        setError(TRAINING_ERRORS[result.reason]);
        if (result.reason === "no-stamina") refresh();
        return;
      }
      router.replace(REDIRECTS[result.kind]);
    },
    [refresh, replaceCharacter, router],
  );

  return { pendingStat, lastGain, error, train };
}
