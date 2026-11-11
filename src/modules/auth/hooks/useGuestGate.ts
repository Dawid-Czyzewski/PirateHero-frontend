"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchCurrentUser } from "@/modules/auth/currentUser";
import { resolvePlayerHome } from "@/modules/character/playerHome";

export type GuestGateState = "checking" | "guest" | "redirecting";

export function useGuestGate(): GuestGateState {
  const router = useRouter();
  const [state, setState] = useState<GuestGateState>("checking");

  useEffect(() => {
    let active = true;
    const decide = async () => {
      const session = await fetchCurrentUser();
      if (!active) return;
      if (session.kind !== "authenticated") {
        setState("guest");
        return;
      }
      setState("redirecting");
      const home = await resolvePlayerHome();
      if (active) router.replace(home);
    };
    void decide();
    return () => {
      active = false;
    };
  }, [router]);

  return state;
}
