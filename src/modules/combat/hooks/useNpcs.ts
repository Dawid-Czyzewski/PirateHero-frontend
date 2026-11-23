"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { AUTH_ROUTES } from "@/modules/auth/authRoutes";
import type { Npc } from "@/modules/combat/npc";
import { fetchNpcs } from "@/modules/combat/npcs";

export type NpcsState = { kind: "loading" } | { kind: "loaded"; npcs: Npc[] } | { kind: "unavailable" };

export type NpcsSession = {
  state: NpcsState;
  retry: () => void;
};

const LOADING: NpcsState = { kind: "loading" };

export function useNpcs(): NpcsSession {
  const router = useRouter();
  const [state, setState] = useState<NpcsState>(LOADING);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    fetchNpcs().then((result) => {
      if (!active) return;
      if (result.kind === "unauthenticated") {
        router.replace(AUTH_ROUTES.login);
        return;
      }
      setState(result);
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
