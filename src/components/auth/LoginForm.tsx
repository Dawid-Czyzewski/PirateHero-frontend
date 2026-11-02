"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { Field } from "@/components/auth/Field";
import { IconLock, IconMail } from "@/components/auth/fieldIcons";
import {
  validateLogin,
  validateLoginField,
  type FieldErrors,
  type LoginFields,
} from "@/lib/auth/validation";

type Status = { kind: "idle" } | { kind: "err" | "ok"; text: string };

export function LoginForm() {
  const [values, setValues] = useState<LoginFields>({
    login: "",
    password: "",
  });
  const [remember, setRemember] = useState(false);
  const [errors, setErrors] = useState<FieldErrors<keyof LoginFields>>({});
  const [touched, setTouched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const focusRef = useRef<keyof LoginFields | null>(null);
  const loginRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("fl_login");
      if (saved) {
        setValues((v) => ({ ...v, login: saved }));
        setRemember(true);
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    if (!focusRef.current) return;
    const el =
      focusRef.current === "login" ? loginRef.current : passwordRef.current;
    el?.focus();
    focusRef.current = null;
  }, [errors]);

  const setField = (name: keyof LoginFields, value: string) => {
    const next = { ...values, [name]: value };
    setValues(next);
    if (touched || errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: validateLoginField(name, next) || undefined,
      }));
    }
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setTouched(true);
    setStatus({ kind: "idle" });
    const result = validateLogin(values);
    if (!result.ok) {
      setErrors(result.errors);
      focusRef.current = result.first;
      setStatus({ kind: "err", text: "Popraw zaznaczone pola." });
      return;
    }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 1100));
    try {
      if (remember) localStorage.setItem("fl_login", values.login.trim());
      else localStorage.removeItem("fl_login");
    } catch {
      /* ignore */
    }
    setLoading(false);
    setStatus({
      kind: "ok",
      text: "Logowanie uruchomimy wraz z otwarciem gry. Wróć wkrótce.",
    });
  };

  return (
    <form id="loginForm" className="auth__form" onSubmit={onSubmit} noValidate>
      <Field
        label="E-mail lub login"
        name="login"
        id="login"
        icon={<IconMail />}
        value={values.login}
        onChange={(e) => setField("login", e.target.value)}
        onBlur={() => {
          if (values.login) {
            setErrors((prev) => ({
              ...prev,
              login: validateLoginField("login", values) || undefined,
            }));
          }
        }}
        error={errors.login}
        inputMode="email"
        autoComplete="username"
        autoCapitalize="none"
        spellCheck={false}
        placeholder="E-mail lub login"
        required
        ref={loginRef}
      />

      <Field
        label="Hasło"
        name="password"
        id="password"
        type="password"
        showPasswordToggle
        icon={<IconLock />}
        value={values.password}
        onChange={(e) => setField("password", e.target.value)}
        onBlur={() => {
          if (values.password) {
            setErrors((prev) => ({
              ...prev,
              password: validateLoginField("password", values) || undefined,
            }));
          }
        }}
        error={errors.password}
        autoComplete="current-password"
        placeholder="Hasło"
        required
        minLength={8}
        ref={passwordRef}
      />

      <div className="auth__row">
        <label className="check">
          <input
            type="checkbox"
            id="remember"
            name="remember"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
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
          <span>Zapamiętaj mnie</span>
        </label>
        <Link className="small-link" href="#reset">
          Nie pamiętasz hasła?
        </Link>
      </div>

      <button
        className={`auth__submit btn-gold${loading ? " is-loading" : ""}`}
        type="submit"
        disabled={loading}
        aria-busy={loading}
        data-loading="LOGOWANIE…"
      >
        <span className="spin" aria-hidden="true" />
        <span className="label">{loading ? "LOGOWANIE…" : "ZALOGUJ"}</span>
      </button>

      <p
        className={`auth__status${status.kind === "ok" ? " is-ok" : ""}${status.kind === "err" ? " is-err" : ""}`}
        role="status"
        aria-live="polite"
      >
        {status.kind === "idle" ? "" : status.text}
      </p>
      <div className="auth__divider" aria-hidden="true" />
    </form>
  );
}
