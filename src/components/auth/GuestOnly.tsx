"use client";

import type { ReactNode } from "react";
import { useGuestGate } from "@/modules/auth/hooks/useGuestGate";

export function GuestOnly({ children }: { children: ReactNode }) {
  const state = useGuestGate();

  if (state === "guest") return children;

  return (
    <p className="m-0 w-full py-[24px] text-center font-semi text-[18px] text-dust" role="status" aria-live="polite">
      {state === "redirecting" ? "Jesteś już zalogowany. Przenosimy Cię do gry…" : "Chwileczkę…"}
    </p>
  );
}
