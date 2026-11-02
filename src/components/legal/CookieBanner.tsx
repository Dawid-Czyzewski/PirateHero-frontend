"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const STORAGE_KEY = "fl-cookie-consent";

type Consent = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
};

function readConsent(): Consent | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<Consent>;
    if (
      typeof parsed.analytics !== "boolean" ||
      typeof parsed.marketing !== "boolean"
    ) {
      return null;
    }
    return {
      necessary: true,
      analytics: parsed.analytics,
      marketing: parsed.marketing,
    };
  } catch {
    return null;
  }
}

function saveConsent(consent: Consent) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
}

export function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);
  const [analytics, setAnalytics] = useState(true);
  const [marketing, setMarketing] = useState(false);
  const panelRef = useRef<HTMLElement>(null);
  const firstBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const show = readConsent() === null;
    setVisible(show);
    if (show) {
      requestAnimationFrame(() => firstBtnRef.current?.focus());
    }
  }, []);

  useEffect(() => {
    if (!visible) {
      document.body.style.paddingBottom = "";
      return;
    }

    const syncPad = () => {
      const h = panelRef.current?.offsetHeight ?? 0;
      document.body.style.paddingBottom = h ? `${h + 12}px` : "";
    };

    syncPad();
    const ro = new ResizeObserver(syncPad);
    if (panelRef.current) ro.observe(panelRef.current);
    window.addEventListener("resize", syncPad);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", syncPad);
      document.body.style.paddingBottom = "";
    };
  }, [visible, openSettings]);

  if (!visible) return null;

  const hide = () => setVisible(false);

  const acceptAll = () => {
    saveConsent({ necessary: true, analytics: true, marketing: true });
    hide();
  };

  const rejectOptional = () => {
    saveConsent({ necessary: true, analytics: false, marketing: false });
    hide();
  };

  const saveCustom = () => {
    saveConsent({ necessary: true, analytics, marketing });
    hide();
  };

  return (
    <div className="fl-cookies">
      <aside
        ref={panelRef}
        className="fl-cookies__panel"
        role="dialog"
        aria-labelledby="cookie-banner-title"
        aria-describedby="cookie-banner-text"
      >
        <div className="fl-cookies__inner">
          <div className="fl-cookies__copy">
            <p className="fl-cookies__eyebrow">Ciasteczka</p>
            <h2 id="cookie-banner-title" className="fl-cookies__title">
              Zanim wejdziesz do klatki
            </h2>
            <p id="cookie-banner-text" className="fl-cookies__text">
              Używamy ciasteczek, żeby strona działała, liczyć ruch i (za Twoją
              zgodą) lepiej dopasować reklamy. Niezbędne są zawsze włączone.
              Szczegóły znajdziesz w{" "}
              <Link href="/cookies">polityce cookies</Link>.
            </p>

            {openSettings ? (
              <div className="fl-cookies__toggles">
                <CookieToggle
                  title="Niezbędne"
                  hint="Logowanie, bezpieczeństwo, sesja."
                  checked
                  locked
                />
                <CookieToggle
                  title="Analityczne"
                  hint="Ruch i ulepszanie gry."
                  checked={analytics}
                  onChange={setAnalytics}
                />
                <CookieToggle
                  title="Marketingowe"
                  hint="Reklamy i partnerzy."
                  checked={marketing}
                  onChange={setMarketing}
                />
              </div>
            ) : null}
          </div>

          <div className="fl-cookies__actions">
            <button
              ref={firstBtnRef}
              type="button"
              className="fl-cookies__btn"
              onClick={acceptAll}
            >
              Akceptuję wszystkie
            </button>
            <button
              type="button"
              className="fl-cookies__btn fl-cookies__btn--dark"
              onClick={rejectOptional}
            >
              Tylko niezbędne
            </button>
            {openSettings ? (
              <button
                type="button"
                className="fl-cookies__btn fl-cookies__btn--ghost"
                onClick={saveCustom}
              >
                Zapisz wybór
              </button>
            ) : (
              <button
                type="button"
                className="fl-cookies__btn fl-cookies__btn--ghost"
                onClick={() => setOpenSettings(true)}
              >
                Ustawienia
              </button>
            )}
          </div>
        </div>
      </aside>
    </div>
  );
}

function CookieToggle({
  title,
  hint,
  checked,
  locked = false,
  onChange,
}: {
  title: string;
  hint: string;
  checked: boolean;
  locked?: boolean;
  onChange?: (value: boolean) => void;
}) {
  return (
    <label
      className={`fl-cookies__toggle${locked ? " is-locked" : ""}`}
    >
      <span>
        <span className="fl-cookies__toggle-title">{title}</span>
        <span className="fl-cookies__toggle-hint">{hint}</span>
      </span>
      <input
        type="checkbox"
        checked={checked}
        disabled={locked}
        onChange={(e) => onChange?.(e.target.checked)}
      />
    </label>
  );
}
