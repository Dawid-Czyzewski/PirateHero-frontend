"use client";

import Link from "next/link";
import { useEffect, useEffectEvent, useId, useRef } from "react";
import {
  CONSENT_CARD,
  CONSENT_SURFACE,
  DARK_FRAME_BUTTON,
  GOLD_FRAME_BUTTON,
} from "@/components/site/consentStyles";
import { writeConsent, type Consent } from "@/lib/consent";

type ConsentPanelProps = {
  open: boolean;
  initial: Pick<Consent, "analytics" | "marketing"> | null;
  onClose: () => void;
  onSaved: (c: Consent) => void;
};

const ROWS = [
  {
    id: "necessary",
    title: "Niezbędne",
    desc: "Logowanie, bezpieczeństwo, zapamiętanie Twojego wyboru i płatności. Bez nich gra nie działa.",
    always: true,
  },
  {
    id: "analytics",
    title: "Analityczne",
    desc: "Anonimowe statystyki, które pomagają nam poprawiać grę ([dostawca analityki]).",
    always: false,
  },
  {
    id: "marketing",
    title: "Marketingowe",
    desc: "Reklamy dopasowane do Ciebie i pomiar kampanii ([sieć reklamowa]). Bez zgody reklamy nie są personalizowane.",
    always: false,
  },
] as const;

const PANEL_BOX = [
  "relative max-h-[calc(100dvh-24px)] w-[min(560px,100%)] overflow-auto px-5 pt-[22px] pb-[18px]",
  "shadow-[0_16px_60px_rgb(0_0_0/0.85),inset_0_0_0_1px_rgb(240_195_90/0.18)]",
].join(" ");

const SWITCH_TRACK = [
  "absolute inset-0 rounded-full bg-[#2a2321] shadow-[inset_0_0_0_2px_#5a4a3c] transition-colors motion-reduce:transition-none",
  "after:absolute after:top-1 after:left-1 after:size-6 after:rounded-full after:bg-[#cfc6bb] after:transition-transform after:content-[''] motion-reduce:after:transition-none",
  "peer-checked:bg-[#b51f16] peer-checked:shadow-[inset_0_0_0_2px_#e0342a] peer-checked:after:translate-x-6 peer-checked:after:bg-white",
  "peer-disabled:opacity-75 peer-focus-visible:outline-3 peer-focus-visible:outline-offset-3 peer-focus-visible:outline-gold",
].join(" ");

export function ConsentPanel({
  open,
  initial,
  onClose,
  onSaved,
}: ConsentPanelProps) {
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const analyticsRef = useRef<HTMLInputElement>(null);
  const marketingRef = useRef<HTMLInputElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    lastFocus.current = document.activeElement as HTMLElement | null;
    document.documentElement.classList.add("overflow-hidden");
    if (analyticsRef.current) {
      analyticsRef.current.checked = !!initial?.analytics;
    }
    if (marketingRef.current) {
      marketingRef.current.checked = !!initial?.marketing;
    }
    requestAnimationFrame(() => closeRef.current?.focus());
    return () => document.documentElement.classList.remove("overflow-hidden");
  }, [open, initial]);

  const close = () => {
    onClose();
    if (lastFocus.current && document.contains(lastFocus.current)) {
      lastFocus.current.focus();
    }
  };

  const closeOnEscape = useEffectEvent(close);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeOnEscape();
      }
      if (e.key === "Tab" && boxRef.current) {
        const nodes = boxRef.current.querySelectorAll<HTMLElement>(
          "button,input:not([disabled]),a[href]",
        );
        const first = nodes[0];
        const last = nodes[nodes.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  if (!open) return null;

  return (
    <div
      className={`${CONSENT_SURFACE} fixed inset-0 z-80 grid place-items-center bg-black/65 p-3`}
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div
        ref={boxRef}
        className={`${CONSENT_CARD} ${PANEL_BOX}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <button
          ref={closeRef}
          type="button"
          className="absolute top-2.5 right-2.5 grid size-11 cursor-pointer place-items-center rounded-lg border border-gold/40 bg-transparent text-[#f2efea]"
          aria-label="Zamknij ustawienia cookies"
          onClick={close}
        >
          <svg className="size-[18px]" viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M5 5l14 14M19 5L5 19"
              stroke="currentColor"
              strokeWidth="2.6"
              strokeLinecap="round"
            />
          </svg>
        </button>
        <h2
          className="m-0 mr-10 mb-1.5 font-cond text-[26px] leading-[1.1] font-bold tracking-[0.02em] uppercase"
          id={titleId}
        >
          Ustawienia cookies
        </h2>
        <p className="mb-3 text-[15px] leading-[1.45] text-dust">
          Wybierz, na które pliki cookies się zgadzasz. Zgodę możesz w każdej
          chwili zmienić lub wycofać.
        </p>
        {ROWS.map((row) => (
          <div
            className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1 border-t border-white/8 py-3.5"
            key={row.id}
          >
            <h3
              className="m-0 font-cond text-[19px] leading-[1.2] font-bold text-[#f3eadb]"
              id={`ckp-${row.id}`}
            >
              {row.title}
            </h3>
            {row.always ? (
              <span className="col-start-2 row-start-1 text-right font-cond text-[13px] leading-none font-semibold tracking-[0.04em] text-ok uppercase">
                Zawsze aktywne
              </span>
            ) : null}
            <p
              className="col-start-1 m-0 text-[14.5px] leading-[1.4] text-[#bdb3a7]"
              id={`ckp-${row.id}-d`}
            >
              {row.desc}
            </p>
            {row.always ? null : (
              <label className="relative col-start-2 row-span-2 row-start-1 h-8 w-14 flex-none">
                <input
                  ref={row.id === "analytics" ? analyticsRef : marketingRef}
                  className="peer absolute -inset-1.5 z-1 m-0 h-11 w-[68px] cursor-pointer opacity-0 disabled:cursor-not-allowed"
                  type="checkbox"
                  role="switch"
                  name={row.id}
                  aria-labelledby={`ckp-${row.id}`}
                  aria-describedby={`ckp-${row.id}-d`}
                />
                <span className={SWITCH_TRACK} />
              </label>
            )}
          </div>
        ))}
        <div className="mt-3.5 flex gap-2.5">
          <button
            type="button"
            className={GOLD_FRAME_BUTTON}
            onClick={() => {
              const c = writeConsent({
                analytics: !!analyticsRef.current?.checked,
                marketing: !!marketingRef.current?.checked,
              });
              onSaved(c);
              close();
            }}
          >
            Zapisz wybór
          </button>
          <button
            type="button"
            className={DARK_FRAME_BUTTON}
            onClick={() => {
              const c = writeConsent({ analytics: true, marketing: true });
              onSaved(c);
              close();
            }}
          >
            Akceptuję wszystkie
          </button>
        </div>
        <p
          className="mt-2.5 min-h-[1.2em] text-center text-[14px] text-ok"
          role="status"
          aria-live="polite"
        />
        <p className="mt-3 text-center text-[14px] text-dust">
          Szczegóły:{" "}
          <Link href="/cookies" className="text-gold">
            Polityka cookies
          </Link>
        </p>
      </div>
    </div>
  );
}
