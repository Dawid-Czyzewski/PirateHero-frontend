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
  refresh: () => void;
  updateCharacter: (update: CharacterUpdate) => void;
};

export type CharacterUpdate = (character: CharacterSheet) => CharacterSheet;

const LOADING: CharacterSheetState = { kind: "loading" };

const UNAVAILABLE: CharacterSheetState = { kind: "unavailable" };

const REDIRECTS: Partial<Record<MyCharacterResult["kind"], string>> = {
  missing: CHARACTER_ROUTES.create,
  unauthenticated: AUTH_ROUTES.login,
};

export function useCharacterSheet(): CharacterSheetSession {
  const router = useRouter();
  const [state, setState] = useState<CharacterSheetState>(LOADING);
  const [attempt, setAttempt] = useState(0);

  const apply = useCallback(
    (result: MyCharacterResult, keepOnFailure: boolean) => {
      const redirect = REDIRECTS[result.kind];
      if (redirect) {
        router.replace(redirect);
        return;
      }
      if (result.kind === "loaded") setState(result);
      else if (!keepOnFailure) setState(UNAVAILABLE);
    },
    [router],
  );

  useEffect(() => {
    let active = true;
    fetchMyCharacter().then((result) => {
      if (active) apply(result, false);
    });
    return () => {
      active = false;
    };
  }, [attempt, apply]);

  const retry = useCallback(() => {
    setState(LOADING);
    setAttempt((value) => value + 1);
  }, []);

  const refresh = useCallback(() => {
    fetchMyCharacter().then((result) => apply(result, true));
  }, [apply]);

  const updateCharacter = useCallback((update: CharacterUpdate) => {
    setState((previous) => (previous.kind === "loaded" ? { kind: "loaded", character: update(previous.character) } : previous));
  }, []);

  return { state, retry, refresh, updateCharacter };
}
