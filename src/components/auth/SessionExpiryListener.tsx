"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { onSessionExpired } from "@/lib/api/sessionEvents";
import { isGuestRoute } from "@/modules/auth/authRoutes";
import { endExpiredSession } from "@/modules/auth/sessionExpiry";

export function SessionExpiryListener() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isGuestRoute(pathname)) return;
    return onSessionExpired(() => {
      void endExpiredSession(router);
    });
  }, [pathname, router]);

  return null;
}
