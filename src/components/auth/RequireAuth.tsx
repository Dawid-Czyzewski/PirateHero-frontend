"use client";

import type { ReactNode } from "react";
import { ErrorScreen, LoadingScreen } from "@/components/game/ScreenStatus";
import type { CurrentUser } from "@/modules/auth/currentUser";
import { useCurrentUser } from "@/modules/auth/hooks/useCurrentUser";

type RequireAuthProps = {
  children: (user: CurrentUser) => ReactNode;
};

export function RequireAuth({ children }: RequireAuthProps) {
  const { state, retry } = useCurrentUser();

  if (state.kind === "authenticated") return children(state.user);
  if (state.kind === "unavailable") return <ErrorScreen message="Nie udało się połączyć z serwerem gry." onRetry={retry} />;
  return <LoadingScreen message="Sprawdzamy, czy jesteś zalogowany…" />;
}
