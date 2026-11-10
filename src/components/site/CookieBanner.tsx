"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { ConsentPanel } from "@/components/site/ConsentPanel";
import {
  formatConsentStatus,
  parseConsent,
  readConsentRaw,
  subscribeConsent,
  writeConsent,
} from "@/lib/consent";
import { useHydrated } from "@/lib/useHydrated";

export function CookieBanner() {
  const ready = useHydrated();
  const rawConsent = useSyncExternalStore(subscribeConsent, readConsentRaw, () => null);
  const consent = useMemo(() => parseConsent(rawConsent), [rawConsent]);
  const [dismissed, setDismissed] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const bannerRef = useRef<HTMLElement>(null);
  const banner = ready && consent === null && !dismissed;

  useEffect(() => {
    if (!ready) return;
    const onOpen = (e: Event) => {
      const t = (e.target as HTMLElement | null)?.closest?.(
        "[data-cookie-settings]",
      );
      if (!t) return;
      e.preventDefault();
      setPanelOpen(true);
    };
    document.addEventListener("click", onOpen);
    return () => document.removeEventListener("click", onOpen);
  }, [ready]);

  useEffect(() => {
    if (!banner) {
      document.body.style.paddingBottom = "";
      document.documentElement.style.removeProperty("--ckb-h");
      return;
    }
    const sync = () => {
      const h = Math.ceil(bannerRef.current?.getBoundingClientRect().height ?? 0) + 20;
      document.body.style.paddingBottom = `${h}px`;
      document.documentElement.style.setProperty("--ckb-h", `${h}px`);
    };
    sync();
    const ro = new ResizeObserver(sync);
    if (bannerRef.current) ro.observe(bannerRef.current);
    window.addEventListener("resize", sync);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", sync);
      document.body.style.paddingBottom = "";
      document.documentElement.style.removeProperty("--ckb-h");
    };
  }, [banner]);

  useEffect(() => {
    if (!ready) return;
    const status = document.querySelector("[data-cookie-status]");
    if (status) status.textContent = formatConsentStatus(consent);
  }, [ready, consent, panelOpen]);

  if (!ready) return null;

  const dismiss = () => setDismissed(true);

  const choose = (choice: { analytics: boolean; marketing: boolean }) => {
    writeConsent(choice);
    dismiss();
  };

  return (
    <>
      {banner ? (
        <section
          ref={bannerRef}
          className="ckb"
          role="dialog"
          aria-modal="false"
          aria-labelledby="ckb-h"
          aria-describedby="ckb-t"
        >
          <h2 className="ckb__h" id="ckb-h">
            Zanim wejdziesz do klatki
          </h2>
          <p className="ckb__t" id="ckb-t">
            Używamy niezbędnych plików cookies, żeby gra działała. Za Twoją
            zgodą także analitycznych i&nbsp;marketingowych.{" "}
            <Link href="/cookies">Polityka cookies</Link>
            {" · "}
            <button
              type="button"
              className="ckb__link"
              data-cookie-settings
            >
              Ustawienia
            </button>
          </p>
          <div className="ckb__btns">
            <button
              type="button"
              className="ckb__btn"
              onClick={() => choose({ analytics: true, marketing: true })}
            >
              Akceptuję wszystkie
            </button>
            <button
              type="button"
              className="ckb__btn ckb__btn--dark"
              onClick={() => choose({ analytics: false, marketing: false })}
            >
              Tylko niezbędne
            </button>
          </div>
        </section>
      ) : null}

      <ConsentPanel
        open={panelOpen}
        initial={consent}
        onClose={() => setPanelOpen(false)}
        onSaved={dismiss}
      />
    </>
  );
}
