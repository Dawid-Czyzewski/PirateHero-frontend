"use client";

import { useMemo, useSyncExternalStore } from "react";
import { formatConsentStatus, parseConsent, readConsentRaw, subscribeConsent } from "@/lib/consent";
import { useHydrated } from "@/lib/useHydrated";

const BUTTON =
  "fl-btn h-66 min-h-[48px] px-10 tracking-[.05em] [--fs:28] after:[--hit:0px] desk:h-58 desk:px-8 desk:[--fs:24]";

export function CookieConsentControls({ className }: { className: string }) {
  const hydrated = useHydrated();
  const raw = useSyncExternalStore(subscribeConsent, readConsentRaw, () => null);
  const status = useMemo(() => formatConsentStatus(parseConsent(raw)), [raw]);

  return (
    <div className={`flex flex-wrap items-center gap-x-[18px] gap-y-[10px] ${className}`}>
      <button type="button" className={BUTTON} data-cookie-settings>
        <span>Zmień ustawienia cookies</span>
      </button>
      <p className="text-[.9em] text-ok empty:hidden" role="status" aria-live="polite">
        {hydrated ? status : ""}
      </p>
    </div>
  );
}
