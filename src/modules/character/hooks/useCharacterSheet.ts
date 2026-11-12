"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { AUTH_ROUTES } from "@/modules/auth/authRoutes";
import { CHARACTER_ROUTES } from "@/modules/character/characterRoutes";
import type { CharacterSheet } from "@/modules/character/characterSheet";
import { fetchMyCharacter, type MyCharacterResult } from "@/modules/character/myCharacter";

export type CharacterSheetState =
  | { kind: "loading" }
  | { kind: "loaded"; character: CharacterSheet }
  | { kind: "unavailable" };

export type CharacterSheetSession = {
  state: CharacterSheetState;
  retry: () => void;
};

const LOADING: CharacterSheetState = { kind: "loading" };

const REDIRECTS: Partial<Record<MyCharacterResult["kind"], string>> = {
  missing: CHARACTER_ROUTES.create,
  unauthenticated: AUTH_ROUTES.login,
};

export function useCharacterSheet(): CharacterSheetSession {
  const router = useRouter();
  const [state, setState] = useState<CharacterSheetState>(LOADING);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    fetchMyCharacter().then((result) => {
      if (!active) return;
      const redirect = REDIRECTS[result.kind];
      if (redirect) {
        router.replace(redirect);
        return;
      }
      setState(result.kind === "loaded" ? result : { kind: "unavailable" });
    });
    return () => {
      active = false;
    };
  }, [attempt, router]);

  const retry = useCallback(() => {
    setState(LOADING);
    setAttempt((value) => value + 1);
  }, []);

  return { state, retry };
}
