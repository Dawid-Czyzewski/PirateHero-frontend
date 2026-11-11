"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { ConsentPanel } from "@/components/site/ConsentPanel";
import {
  CONSENT_CARD,
  CONSENT_LINK,
  CONSENT_SURFACE,
  DARK_FRAME_BUTTON,
  GOLD_FRAME_BUTTON,
} from "@/components/site/consentStyles";
import {
  parseConsent,
  readConsentRaw,
  subscribeConsent,
  writeConsent,
} from "@/lib/consent";
import { useHydrated } from "@/lib/useHydrated";

const BANNER = [
  "fixed bottom-[calc(10px+env(safe-area-inset-bottom))] left-1/2 z-70 w-[calc(100vw-24px)] max-w-[560px] -translate-x-1/2",
  "max-h-[30dvh] overflow-auto overscroll-contain px-4 pt-4 pb-3.5",
  "shadow-[0_12px_40px_rgb(0_0_0/0.75),inset_0_0_0_1px_rgb(240_195_90/0.16)]",
  "desk:bottom-4 desk:grid desk:max-w-[980px] desk:grid-cols-[1fr_auto] desk:items-center desk:gap-x-7 desk:px-[22px] desk:py-[18px]",
].join(" ");

const BANNER_BUTTON = "desk:min-w-[170px] desk:flex-none";

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
          className={`${CONSENT_SURFACE} ${CONSENT_CARD} ${BANNER}`}
          role="dialog"
          aria-modal="false"
          aria-labelledby="ckb-h"
          aria-describedby="ckb-t"
        >
          <h2
            className="m-0 truncate font-cond text-[22px] leading-[1.1] font-bold tracking-[0.02em] uppercase desk:col-start-1"
            id="ckb-h"
          >
            Zanim wejdziesz do klatki
          </h2>
          <p
            className="mt-1.5 mb-3 text-[14px] leading-[1.4] text-dust desk:col-start-1 desk:mb-0 desk:text-[15px]"
            id="ckb-t"
          >
            Używamy niezbędnych plików cookies, żeby gra działała. Za Twoją
            zgodą także analitycznych i&nbsp;marketingowych.{" "}
            <Link href="/cookies" className={CONSENT_LINK}>
              Polityka cookies
            </Link>
            {" · "}
            <button type="button" className={CONSENT_LINK} data-cookie-settings>
              Ustawienia
            </button>
          </p>
          <div className="flex gap-2.5 desk:col-start-2 desk:row-span-2 desk:row-start-1">
            <button
              type="button"
              className={`${GOLD_FRAME_BUTTON} ${BANNER_BUTTON}`}
              onClick={() => choose({ analytics: true, marketing: true })}
            >
              Akceptuję wszystkie
            </button>
            <button
              type="button"
              className={`${DARK_FRAME_BUTTON} ${BANNER_BUTTON}`}
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
