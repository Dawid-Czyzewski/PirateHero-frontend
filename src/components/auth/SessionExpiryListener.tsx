"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { onSessionExpired } from "@/lib/api/sessionEvents";
import { endExpiredSession } from "@/modules/auth/sessionExpiry";

export function SessionExpiryListener() {
  const router = useRouter();

  useEffect(
    () =>
      onSessionExpired(() => {
        void endExpiredSession(router);
      }),
    [router],
  );

  return null;
}
