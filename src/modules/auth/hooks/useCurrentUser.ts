"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { AUTH_ROUTES } from "@/modules/auth/authRoutes";
import { fetchCurrentUser, type CurrentUserResult } from "@/modules/auth/currentUser";

export type CurrentUserState = { kind: "loading" } | CurrentUserResult;

export type CurrentUserSession = {
  state: CurrentUserState;
  retry: () => void;
};

const LOADING: CurrentUserState = { kind: "loading" };

export function useCurrentUser(): CurrentUserSession {
  const router = useRouter();
  const [state, setState] = useState<CurrentUserState>(LOADING);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    fetchCurrentUser().then((result) => {
      if (!active) return;
      setState(result);
      if (result.kind === "unauthenticated") router.replace(AUTH_ROUTES.login);
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
