"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { AUTH_ROUTES } from "@/modules/auth/authRoutes";
import { logout } from "@/modules/auth/authService";

export type LogoutState = "idle" | "pending" | "failed";

export type LogoutAction = {
  state: LogoutState;
  logOut: () => Promise<void>;
};

export function useLogout(): LogoutAction {
  const router = useRouter();
  const inFlight = useRef(false);
  const [state, setState] = useState<LogoutState>("idle");

  const logOut = async () => {
    if (inFlight.current) return;
    inFlight.current = true;
    setState("pending");
    const loggedOut = await logout();
    inFlight.current = false;
    if (loggedOut) {
      router.replace(AUTH_ROUTES.login);
      return;
    }
    setState("failed");
  };

  return { state, logOut };
}
