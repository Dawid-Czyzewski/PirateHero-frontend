"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ConsentPanel } from "@/components/site/ConsentPanel";
import {
  formatConsentStatus,
  readConsent,
  writeConsent,
  type Consent,
} from "@/lib/consent";

export function CookieBanner() {
  const [ready, setReady] = useState(false);
  const [banner, setBanner] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [consent, setConsent] = useState<Consent | null>(null);
  const bannerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const c = readConsent();
    setConsent(c);
    setBanner(c === null);
    setReady(true);
  }, []);

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

  const save = (c: Consent) => {
    setConsent(c);
    setBanner(false);
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
              onClick={() =>
                save(writeConsent({ analytics: true, marketing: true }))
              }
            >
              Akceptuję wszystkie
            </button>
            <button
              type="button"
              className="ckb__btn ckb__btn--dark"
              onClick={() =>
                save(writeConsent({ analytics: false, marketing: false }))
              }
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
        onSaved={save}
      />
    </>
  );
}
