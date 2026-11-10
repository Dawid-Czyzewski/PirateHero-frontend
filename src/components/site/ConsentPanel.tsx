"use client";

import Link from "next/link";
import { useEffect, useEffectEvent, useId, useRef } from "react";
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
    document.documentElement.classList.add("ckp-open");
    if (analyticsRef.current) {
      analyticsRef.current.checked = !!initial?.analytics;
    }
    if (marketingRef.current) {
      marketingRef.current.checked = !!initial?.marketing;
    }
    requestAnimationFrame(() => closeRef.current?.focus());
    return () => document.documentElement.classList.remove("ckp-open");
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
      className="ckp"
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div
        ref={boxRef}
        className="ckp__box"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <button
          ref={closeRef}
          type="button"
          className="ckp__close"
          aria-label="Zamknij ustawienia cookies"
          onClick={close}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M5 5l14 14M19 5L5 19"
              stroke="currentColor"
              strokeWidth="2.6"
              strokeLinecap="round"
            />
          </svg>
        </button>
        <h2 className="ckp__h" id={titleId}>
          Ustawienia cookies
        </h2>
        <p className="ckp__intro">
          Wybierz, na które pliki cookies się zgadzasz. Zgodę możesz w każdej
          chwili zmienić lub wycofać.
        </p>
        {ROWS.map((row) => (
          <div className="ckp__row" key={row.id}>
            <h3 id={`ckp-${row.id}`}>{row.title}</h3>
            {row.always ? (
              <span className="ckp__always">Zawsze aktywne</span>
            ) : null}
            <p id={`ckp-${row.id}-d`}>{row.desc}</p>
            {row.always ? null : (
              <label className="ckp__sw">
                <input
                  ref={row.id === "analytics" ? analyticsRef : marketingRef}
                  type="checkbox"
                  role="switch"
                  name={row.id}
                  aria-labelledby={`ckp-${row.id}`}
                  aria-describedby={`ckp-${row.id}-d`}
                />
                <span />
              </label>
            )}
          </div>
        ))}
        <div className="ckp__btns">
          <button
            type="button"
            className="ckp__btn"
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
            className="ckp__btn ckp__btn--dark"
            onClick={() => {
              const c = writeConsent({ analytics: true, marketing: true });
              onSaved(c);
              close();
            }}
          >
            Akceptuję wszystkie
          </button>
        </div>
        <p className="ckp__ok" role="status" aria-live="polite" />
        <p className="ckp__more">
          Szczegóły: <Link href="/cookies">Polityka cookies</Link>
        </p>
      </div>
    </div>
  );
}
