"use client";

import { ENTRY, FOCUS_RING, IDLE, LABEL, type NavLayout } from "@/components/game/nav/navStyles";
import { useLogout } from "@/modules/auth/hooks/useLogout";

function LogoutIcon() {
  return (
    <svg className="size-7" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M10 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="m15 8 4 4-4 4M19 12H9" fill="none" stroke="var(--color-blood)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function LogoutButton({ layout }: { layout: NavLayout }) {
  const { state, logOut } = useLogout();

  return (
    <div className="grid gap-1">
      <button
        type="button"
        className={`${ENTRY[layout]} ${IDLE} ${FOCUS_RING} cursor-pointer border-0 bg-transparent disabled:cursor-progress disabled:opacity-60`}
        onClick={() => void logOut()}
        disabled={state === "pending"}
        aria-busy={state === "pending"}
      >
        <LogoutIcon />
        <span className={LABEL[layout]}>{state === "pending" ? "Wylogowuję…" : "Wyloguj"}</span>
      </button>
      {state === "failed" ? (
        <p className="m-0 text-center font-semi text-xs text-[#ff6b5e]" role="alert">
          Nie udało się wylogować. Spróbuj ponownie.
        </p>
      ) : null}
    </div>
  );
}
