"use client";

import { useRef, useState, type FormEvent } from "react";
import {
  CHECK,
  CHECK_BOX,
  CONSENT_ERROR,
  DONE,
  ERROR,
  FIELD_GAP,
  INPUT,
  LABEL,
  SELECT,
  SELECT_PREFIX,
  SELECT_WRAP,
  SPINNER,
  STATUS,
  SUBMIT,
  TEXTAREA,
  TOPIC_LABEL,
} from "@/components/legal/contactFormStyles";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type FieldName = "name" | "email" | "topic" | "message" | "consent";

const RULES: Record<
  FieldName,
  (value: string, el?: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement) => string
> = {
  name: (v) => {
    v = v.trim();
    if (!v) return "Podaj imię lub nick.";
    if (v.length < 2) return "Imię lub nick musi mieć co najmniej 2 znaki.";
    return "";
  },
  email: (v) => {
    v = v.trim();
    if (!v) return "Podaj adres e-mail.";
    if (!EMAIL.test(v)) return "Zły format e-maila, np. dawid@cebula.pl";
    return "";
  },
  topic: (v) => (v ? "" : "Wybierz temat."),
  message: (v) => {
    v = v.trim();
    if (!v) return "Napisz wiadomość.";
    if (v.length < 10) return "Wiadomość musi mieć co najmniej 10 znaków.";
    return "";
  },
  consent: (_v, el) =>
    el instanceof HTMLInputElement && el.checked
      ? ""
      : "Zaznacz zgodę, żebyśmy mogli odpowiedzieć.",
};

export function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const doneRef = useRef<HTMLDivElement>(null);
  const [tried, setTried] = useState(false);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});
  const [status, setStatus] = useState("");

  const check = (name: FieldName, form: HTMLFormElement) => {
    const el = form.elements.namedItem(name) as
      | HTMLInputElement
      | HTMLSelectElement
      | HTMLTextAreaElement
      | null;
    if (!el) return true;
    const msg = RULES[name](el.value, el);
    setErrors((prev) => ({ ...prev, [name]: msg || undefined }));
    el.setAttribute("aria-invalid", msg ? "true" : "false");
    return !msg;
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    setTried(true);
    setStatus("");
    const bad = (Object.keys(RULES) as FieldName[]).filter(
      (n) => !check(n, form),
    );
    if (bad.length) {
      setStatus("Popraw zaznaczone pola.");
      const first = form.elements.namedItem(bad[0]) as HTMLElement | null;
      first?.focus();
      return;
    }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 1100));
    setLoading(false);
    setSent(true);
    setStatus("Wiadomość wysłana. Dzięki!");
    doneRef.current?.focus();
  };

  const resetForm = () => {
    formRef.current?.reset();
    setTried(false);
    setSent(false);
    setErrors({});
    setStatus("");
    const name = formRef.current?.elements.namedItem("name") as
      | HTMLInputElement
      | undefined;
    name?.focus();
  };

  const touchField = (name: FieldName, value: string) => {
    if (!tried && !value) return;
    if (formRef.current) check(name, formRef.current);
  };

  const onChangeField = (name: FieldName) => {
    if (!tried) return;
    if (formRef.current) check(name, formRef.current);
  };

  return (
    <form ref={formRef} id="contactForm" onSubmit={onSubmit} noValidate>
      <div className={sent ? "hidden" : undefined}>
        <div className="relative" data-field="name">
          <label className={LABEL} htmlFor="name">
            Imię lub nick
          </label>
          <input
            className={INPUT}
            id="name"
            name="name"
            type="text"
            autoComplete="nickname"
            maxLength={40}
            required
            aria-describedby="name-err"
            aria-invalid={errors.name ? true : undefined}
            onBlur={(e) => touchField("name", e.target.value)}
            onInput={(e) => touchField("name", e.currentTarget.value)}
          />
          <p className={ERROR} id="name-err" aria-live="polite">
            {errors.name ?? ""}
          </p>
        </div>
        <div className={`relative ${FIELD_GAP}`} data-field="email">
          <label className={LABEL} htmlFor="email">
            E-mail
          </label>
          <input
            className={INPUT}
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            autoCapitalize="none"
            spellCheck={false}
            required
            aria-describedby="email-err"
            aria-invalid={errors.email ? true : undefined}
            onBlur={(e) => touchField("email", e.target.value)}
            onInput={(e) => touchField("email", e.currentTarget.value)}
          />
          <p className={ERROR} id="email-err" aria-live="polite">
            {errors.email ?? ""}
          </p>
        </div>
        <div className={`relative ${FIELD_GAP}`} data-field="topic">
          <label className={TOPIC_LABEL} htmlFor="topic">
            Temat
          </label>
          <div className={SELECT_WRAP}>
            <span className={SELECT_PREFIX} aria-hidden="true">
              Temat:
            </span>
            <select
              className={SELECT}
              id="topic"
              name="topic"
              required
              defaultValue="pytanie"
              aria-describedby="topic-err"
              aria-invalid={errors.topic ? true : undefined}
              onBlur={(e) => touchField("topic", e.target.value)}
              onChange={() => onChangeField("topic")}
            >
              <option value="pytanie">Pytanie</option>
              <option value="blad">Błąd w grze</option>
              <option value="wspolpraca">Współpraca</option>
              <option value="inne">Inne</option>
            </select>
          </div>
          <p className={ERROR} id="topic-err" aria-live="polite">
            {errors.topic ?? ""}
          </p>
        </div>
        <div className={`relative ${FIELD_GAP}`} data-field="message">
          <label className={LABEL} htmlFor="message">
            Wiadomość
          </label>
          <textarea
            className={TEXTAREA}
            id="message"
            name="message"
            rows={4}
            maxLength={2000}
            required
            aria-describedby="message-err"
            aria-invalid={errors.message ? true : undefined}
            onBlur={(e) => touchField("message", e.target.value)}
            onInput={(e) => touchField("message", e.currentTarget.value)}
          />
          <p className={ERROR} id="message-err" aria-live="polite">
            {errors.message ?? ""}
          </p>
        </div>
        <div className={`relative ${FIELD_GAP} desk:mt-20`} data-field="consent">
          <label className={CHECK}>
            <input
              className="peer absolute h-px w-px opacity-0"
              type="checkbox"
              id="consent"
              name="consent"
              required
              aria-describedby="consent-err"
              aria-invalid={errors.consent ? true : undefined}
              onChange={() => onChangeField("consent")}
            />
            <span className={CHECK_BOX} aria-hidden="true">
              <svg className="size-4/5 opacity-0" viewBox="0 0 16 16">
                <path
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 8.5l3.2 3L13 4.5"
                />
              </svg>
            </span>
            <span>Wyrażam zgodę na przetwarzanie danych w&nbsp;celu odpowiedzi (RODO).</span>
          </label>
          <p className={CONSENT_ERROR} id="consent-err" aria-live="polite">
            {errors.consent ?? ""}
          </p>
        </div>
        <button
          className={`${SUBMIT}${loading ? " pointer-events-none saturate-[.7]" : ""}`}
          type="submit"
          disabled={loading}
          aria-busy={loading}
        >
          {loading ? <span className={SPINNER} aria-hidden="true" /> : null}
          <span>{loading ? "WYSYŁANIE…" : "Wyślij wiadomość"}</span>
        </button>
        <p className={`${STATUS} text-[#ff6b5e]`} role="status" aria-live="polite">
          {sent ? "" : status}
        </p>
      </div>
      <div className={sent ? DONE : "hidden"} tabIndex={-1} ref={doneRef}>
        <h2 className="font-cond text-[calc(40*var(--k))] leading-[1.05] font-bold text-ok uppercase">
          Wiadomość wysłana!
        </h2>
        <p className="mt-14 text-[calc(22*var(--k))] leading-[1.35]">
          Dzięki! Odpiszemy na podany adres e-mail zwykle w&nbsp;1–2 dni robocze.
        </p>
        <button className="fl-btn mx-auto mt-24 h-60 w-320 [--fs:28]" type="button" onClick={resetForm}>
          <span>Napisz kolejną</span>
        </button>
      </div>
    </form>
  );
}
