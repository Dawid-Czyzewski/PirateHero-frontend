"use client";

import type { ReactNode } from "react";
import type { CurrentUser } from "@/modules/auth/currentUser";
import { useCurrentUser } from "@/modules/auth/hooks/useCurrentUser";

type RequireAuthProps = {
  children: (user: CurrentUser) => ReactNode;
};

const GATE = "bg-arena grid min-h-dvh place-content-center justify-items-center gap-4 p-6 text-center text-foreground";
const GATE_TEXT = "m-0 font-display text-2xl tracking-wide";

export function RequireAuth({ children }: RequireAuthProps) {
  const { state, retry } = useCurrentUser();

  if (state.kind === "authenticated") return children(state.user);

  if (state.kind === "unavailable") {
    return (
      <div className={GATE} role="alert">
        <p className={GATE_TEXT}>Nie udało się połączyć z serwerem gry.</p>
        <button
          type="button"
          className="-skew-x-12 bg-blood px-6 py-3 font-display text-xl tracking-wider text-white hover:brightness-110 focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-white"
          onClick={retry}
        >
          <span className="inline-block skew-x-12">Spróbuj ponownie</span>
        </button>
      </div>
    );
  }

  return (
    <div className={GATE} role="status" aria-live="polite">
      <span
        className="size-9 animate-spin rounded-full border-3 border-white/20 border-t-blood motion-reduce:animate-[spin_2.7s_linear_infinite]"
        aria-hidden="true"
      />
      <p className={GATE_TEXT}>Sprawdzamy, czy jesteś zalogowany…</p>
    </div>
  );
}
