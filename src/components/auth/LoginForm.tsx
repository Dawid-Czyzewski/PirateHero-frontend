"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { SkewButton } from "@/components/landing/SkewButton";

type LoginStatus = "idle" | "soon" | "error";

function IconMail() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" aria-hidden>
      <path d="M2 5h20v14H2z" fill="#fff" />
      <path
        d="m2 5 10 8 10-8"
        fill="none"
        stroke="#1a1b1f"
        strokeWidth="2"
      />
    </svg>
  );
}

function IconLock() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" aria-hidden>
      <rect x="4" y="10" width="16" height="12" rx="1.5" fill="#fff" />
      <path
        d="M8 10V7a4 4 0 0 1 8 0v3"
        fill="none"
        stroke="#fff"
        strokeWidth="2.4"
      />
    </svg>
  );
}

export function LoginForm() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [status, setStatus] = useState<LoginStatus>("idle");
  const [error, setError] = useState("");

  const clearError = () => {
    if (status === "error") {
      setStatus("idle");
      setError("");
    }
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!identifier.trim()) {
      setStatus("error");
      setError("Podaj e-mail lub nick.");
      return;
    }
    if (password.length < 6) {
      setStatus("error");
      setError("Hasło musi mieć min. 6 znaków.");
      return;
    }
    setStatus("soon");
    setError("");
  };

  const fieldClass =
    "flex h-12 items-center gap-3 rounded-md border border-[#33343a] bg-[#1c1d22] px-3.5 transition focus-within:border-[#e11d24] sm:h-[3.25rem]";

  const inputClass =
    "min-w-0 flex-1 border-0 bg-transparent text-[0.95rem] font-normal text-white outline-none placeholder:text-[#b4b5bb]";

  return (
    <form
      className="flex flex-col gap-3"
      onSubmit={onSubmit}
      noValidate
      aria-label="Formularz logowania"
    >
      <label className={fieldClass} htmlFor="login-identifier">
        <span className="sr-only">E-mail lub nick</span>
        <IconMail />
        <input
          id="login-identifier"
          name="login"
          type="text"
          autoComplete="username"
          placeholder="E-mail lub nick"
          value={identifier}
          onChange={(e) => {
            setIdentifier(e.target.value);
            clearError();
          }}
          className={inputClass}
          required
        />
      </label>

      <label className={fieldClass} htmlFor="login-password">
        <span className="sr-only">Hasło</span>
        <IconLock />
        <input
          id="login-password"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="Hasło"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            clearError();
          }}
          className={inputClass}
          required
        />
      </label>

      <div className="my-1 flex items-center justify-between text-[0.8rem] text-zinc-200 sm:text-[0.85rem]">
        <label
          htmlFor="login-remember"
          className="flex cursor-pointer items-center gap-2.5"
        >
          <input
            id="login-remember"
            type="checkbox"
            name="remember"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            className="peer sr-only"
          />
          <span
            className="block h-[1.15rem] w-[1.15rem] rounded border-2 border-[#8b8c92] peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#e11d24] peer-checked:border-[#e11d24] peer-checked:bg-[#e11d24]"
            aria-hidden
          />
          <span>Zapamiętaj mnie</span>
        </label>
        <Link
          href="/contact"
          className="underline underline-offset-4 transition hover:text-white"
        >
          Zapomniałeś hasła?
        </Link>
      </div>

      <SkewButton
        type="submit"
        size="lg"
        className="mt-1 h-12 w-full max-w-none text-[0.85rem] tracking-[0.08em] hover:bg-[#b91c1c] sm:h-14 sm:text-[0.95rem]"
      >
        Wejdź do gry
      </SkewButton>

      {status === "error" && error ? (
        <p className="min-h-[18px] text-[0.75rem] text-[#e10600]" role="alert">
          {error}
        </p>
      ) : null}
      {status === "soon" ? (
        <p className="text-[0.75rem] text-zinc-300" role="status">
          Logowanie uruchomimy wraz z otwarciem gry. Wróć wkrótce.
        </p>
      ) : null}
    </form>
  );
}
