"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

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
    if (typeof parsed.analytics !== "boolean" || typeof parsed.marketing !== "boolean") {
      return null;
    }
    return { necessary: true, analytics: parsed.analytics, marketing: parsed.marketing };
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

  useEffect(() => {
    setVisible(readConsent() === null);
  }, []);

  if (!visible) return null;

  const acceptAll = () => {
    saveConsent({ necessary: true, analytics: true, marketing: true });
    setVisible(false);
  };

  const rejectOptional = () => {
    saveConsent({ necessary: true, analytics: false, marketing: false });
    setVisible(false);
  };

  const saveCustom = () => {
    saveConsent({ necessary: true, analytics, marketing });
    setVisible(false);
  };

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[80] p-3 sm:p-5">
      <aside
        role="dialog"
        aria-labelledby="cookie-banner-title"
        aria-describedby="cookie-banner-text"
        className="pointer-events-auto mx-auto w-full max-w-[1100px] overflow-hidden rounded-md border border-white/12 bg-[#0c1018]/95 shadow-[0_20px_50px_rgba(0,0,0,0.55)] backdrop-blur-md"
      >
        <div className="h-[3px] w-full bg-brand" />
        <div className="flex flex-col gap-4 px-4 py-4 sm:px-6 sm:py-5 lg:flex-row lg:items-start lg:gap-8">
          <div className="min-w-0 flex-1">
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.22em] text-brand">
              Ciasteczka
            </p>
            <h2
              id="cookie-banner-title"
              className="mt-1 font-[family-name:var(--font-marker)] text-2xl leading-none tracking-wide text-white sm:text-[1.7rem]"
            >
              Zanim wejdziesz do klatki
            </h2>
            <p id="cookie-banner-text" className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-300">
              Używamy ciasteczek, żeby strona działała, liczyć ruch i (za Twoją zgodą)
              lepiej dopasować reklamy. Niezbędne są zawsze włączone. Szczegóły znajdziesz w{" "}
              <Link href="/cookies" className="font-semibold text-white underline decoration-brand underline-offset-4">
                polityce cookies
              </Link>
              .
            </p>

            {openSettings ? (
              <div className="mt-4 grid gap-2 sm:grid-cols-3">
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

          <div className="flex shrink-0 flex-col gap-2 sm:flex-row lg:w-[17.5rem] lg:flex-col">
            <button
              type="button"
              onClick={acceptAll}
              className="cursor-pointer rounded-sm bg-brand px-4 py-2.5 text-[0.72rem] font-extrabold uppercase tracking-[0.12em] text-white transition hover:bg-[var(--brand-red-dark)]"
            >
              Akceptuję wszystkie
            </button>
            <button
              type="button"
              onClick={rejectOptional}
              className="cursor-pointer rounded-sm border border-white/25 bg-white/5 px-4 py-2.5 text-[0.72rem] font-bold uppercase tracking-[0.12em] text-white transition hover:bg-white/10"
            >
              Tylko niezbędne
            </button>
            {openSettings ? (
              <button
                type="button"
                onClick={saveCustom}
                className="cursor-pointer rounded-sm border border-brand/50 px-4 py-2.5 text-[0.72rem] font-bold uppercase tracking-[0.12em] text-brand transition hover:bg-brand/10"
              >
                Zapisz wybór
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setOpenSettings(true)}
                className="cursor-pointer rounded-sm px-4 py-2.5 text-[0.72rem] font-bold uppercase tracking-[0.12em] text-zinc-400 transition hover:text-white"
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
      className={`flex items-start justify-between gap-3 rounded-sm border border-white/10 bg-black/25 px-3 py-3 ${
        locked ? "opacity-80" : "cursor-pointer"
      }`}
    >
      <span>
        <span className="block text-[0.7rem] font-bold uppercase tracking-[0.12em] text-white">
          {title}
        </span>
        <span className="mt-1 block text-xs text-zinc-400">{hint}</span>
      </span>
      <input
        type="checkbox"
        className="mt-0.5 h-4 w-4 accent-[var(--brand-red)]"
        checked={checked}
        disabled={locked}
        onChange={(e) => onChange?.(e.target.checked)}
      />
    </label>
  );
}
