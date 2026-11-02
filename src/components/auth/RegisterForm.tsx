"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { Field } from "@/components/auth/Field";
import {
  validateRegister,
  validateRegisterField,
  type FieldErrors,
  type RegisterFields,
} from "@/lib/auth/validation";

type Status = { kind: "idle" } | { kind: "err" | "ok"; text: string };

export function RegisterForm() {
  const [values, setValues] = useState<RegisterFields>({
    nick: "",
    email: "",
    password: "",
    password2: "",
    terms: false,
  });
  const [errors, setErrors] = useState<FieldErrors<keyof RegisterFields>>({});
  const [touched, setTouched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const focusRef = useRef<keyof RegisterFields | null>(null);
  const nickRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const password2Ref = useRef<HTMLInputElement>(null);
  const termsRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!focusRef.current) return;
    const map = {
      nick: nickRef,
      email: emailRef,
      password: passwordRef,
      password2: password2Ref,
      terms: termsRef,
    } as const;
    map[focusRef.current].current?.focus();
    focusRef.current = null;
  }, [errors]);

  const setText = (
    name: keyof Omit<RegisterFields, "terms">,
    value: string,
  ) => {
    const next = { ...values, [name]: value };
    setValues(next);
    if (touched || errors[name]) {
      const patch: FieldErrors<keyof RegisterFields> = {
        [name]: validateRegisterField(name, next) || undefined,
      };
      if (name === "password" && next.password2) {
        patch.password2 =
          validateRegisterField("password2", next) || undefined;
      }
      setErrors((prev) => ({ ...prev, ...patch }));
    }
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setTouched(true);
    setStatus({ kind: "idle" });
    const result = validateRegister(values);
    if (!result.ok) {
      setErrors(result.errors);
      focusRef.current = result.first;
      setStatus({ kind: "err", text: "Popraw zaznaczone pola." });
      return;
    }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 1100));
    setLoading(false);
    setStatus({
      kind: "ok",
      text: "Rejestrację uruchomimy wraz z otwarciem gry. Wróć wkrótce.",
    });
  };

  return (
    <form id="registerForm" className="auth__form" onSubmit={onSubmit} noValidate>
      <Field
        label="Nick zawodnika"
        name="nick"
        id="nick"
        value={values.nick}
        onChange={(e) => setText("nick", e.target.value)}
        onBlur={() => {
          if (values.nick) {
            setErrors((prev) => ({
              ...prev,
              nick: validateRegisterField("nick", values) || undefined,
            }));
          }
        }}
        error={errors.nick}
        autoComplete="username"
        placeholder="Nick zawodnika"
        required
        maxLength={16}
        ref={nickRef}
      />

      <Field
        label="E-mail"
        name="email"
        id="email"
        type="email"
        value={values.email}
        onChange={(e) => setText("email", e.target.value)}
        onBlur={() => {
          if (values.email) {
            setErrors((prev) => ({
              ...prev,
              email: validateRegisterField("email", values) || undefined,
            }));
          }
        }}
        error={errors.email}
        inputMode="email"
        autoComplete="email"
        autoCapitalize="none"
        spellCheck={false}
        placeholder="E-mail"
        required
        ref={emailRef}
      />

      <Field
        label="Hasło"
        name="password"
        id="password"
        type="password"
        showPasswordToggle
        value={values.password}
        onChange={(e) => setText("password", e.target.value)}
        onBlur={() => {
          if (values.password) {
            setErrors((prev) => ({
              ...prev,
              password: validateRegisterField("password", values) || undefined,
            }));
          }
        }}
        error={errors.password}
        autoComplete="new-password"
        placeholder="Hasło"
        required
        minLength={8}
        ref={passwordRef}
      />

      <Field
        label="Powtórz hasło"
        name="password2"
        id="password2"
        type="password"
        showPasswordToggle
        value={values.password2}
        onChange={(e) => setText("password2", e.target.value)}
        onBlur={() => {
          if (values.password2) {
            setErrors((prev) => ({
              ...prev,
              password2:
                validateRegisterField("password2", values) || undefined,
            }));
          }
        }}
        error={errors.password2}
        autoComplete="new-password"
        placeholder="Powtórz hasło"
        required
        minLength={8}
        ref={password2Ref}
      />

      <div
        className={`auth__row field${errors.terms ? " is-invalid" : ""}`}
        data-field="terms"
      >
        <label className="check">
          <input
            ref={termsRef}
            type="checkbox"
            id="terms"
            name="terms"
            checked={values.terms}
            onChange={(e) => {
              const next = { ...values, terms: e.target.checked };
              setValues(next);
              if (touched || errors.terms) {
                setErrors((prev) => ({
                  ...prev,
                  terms: validateRegisterField("terms", next) || undefined,
                }));
              }
            }}
            required
            aria-invalid={errors.terms ? true : false}
            aria-describedby="terms-err"
          />
          <span className="check__box" aria-hidden="true">
            <svg viewBox="0 0 16 16">
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
          <span>
            Akceptuję{" "}
            <Link href="/terms" target="_blank" rel="noopener">
              regulamin
            </Link>
          </span>
        </label>
        <p className="field__error" id="terms-err" aria-live="polite">
          {errors.terms || ""}
        </p>
      </div>

      <button
        className={`auth__submit btn-red${loading ? " is-loading" : ""}`}
        type="submit"
        disabled={loading}
        aria-busy={loading}
        data-loading="TWORZENIE…"
      >
        <span className="spin" aria-hidden="true" />
        <span className="label">
          {loading ? "TWORZENIE…" : "ZAŁÓŻ KONTO"}
        </span>
      </button>

      <p
        className={`auth__status${status.kind === "ok" ? " is-ok" : ""}${status.kind === "err" ? " is-err" : ""}`}
        role="status"
        aria-live="polite"
      >
        {status.kind === "idle" ? "" : status.text}
      </p>
    </form>
  );
}
