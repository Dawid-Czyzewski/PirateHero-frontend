"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { authFieldClass } from "@/components/auth/authFieldStyles";
import { SkewButton } from "@/components/landing/SkewButton";

type RegisterStatus = "idle" | "soon" | "error";

export function RegisterForm() {
  const [nick, setNick] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [status, setStatus] = useState<RegisterStatus>("idle");

  const clearError = () => {
    if (status === "error") setStatus("idle");
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const ok =
      nick.trim() &&
      email.trim() &&
      password &&
      passwordRepeat &&
      password === passwordRepeat &&
      accepted;
    if (!ok) {
      setStatus("error");
      return;
    }
    setStatus("soon");
  };

  const hasError = status === "error";

  return (
    <form
      className="flex w-full flex-col gap-4"
      onSubmit={onSubmit}
      noValidate
      aria-labelledby="register-heading"
    >
      <div className="flex flex-col gap-3.5 sm:gap-4">
        <label className="sr-only" htmlFor="register-nick">
          Nazwa gracza (nick)
        </label>
        <input
          id="register-nick"
          name="nick"
          type="text"
          autoComplete="username"
          placeholder="Nazwa gracza (nick)"
          value={nick}
          onChange={(e) => {
            setNick(e.target.value);
            clearError();
          }}
          className={authFieldClass}
          required
          aria-invalid={hasError}
        />

        <label className="sr-only" htmlFor="register-email">
          Adres e-mail
        </label>
        <input
          id="register-email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="Adres e-mail"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            clearError();
          }}
          className={authFieldClass}
          required
          aria-invalid={hasError}
        />

        <label className="sr-only" htmlFor="register-password">
          Hasło
        </label>
        <input
          id="register-password"
          name="password"
          type="password"
          autoComplete="new-password"
          placeholder="Hasło"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            clearError();
          }}
          className={authFieldClass}
          required
          aria-invalid={hasError}
        />

        <label className="sr-only" htmlFor="register-password-repeat">
          Powtórz hasło
        </label>
        <input
          id="register-password-repeat"
          name="passwordRepeat"
          type="password"
          autoComplete="new-password"
          placeholder="Powtórz hasło"
          value={passwordRepeat}
          onChange={(e) => {
            setPasswordRepeat(e.target.value);
            clearError();
          }}
          className={authFieldClass}
          required
          aria-invalid={hasError}
        />
      </div>

      <label className="flex cursor-pointer items-start gap-2.5 text-[0.8rem] leading-snug text-zinc-300 sm:text-[0.85rem]">
        <input
          type="checkbox"
          checked={accepted}
          onChange={(e) => {
            setAccepted(e.target.checked);
            clearError();
          }}
          className="mt-0.5 h-4 w-4 shrink-0 appearance-none border border-red-600 bg-black/50 checked:bg-red-600"
          required
        />
        <span>
          Akceptuję{" "}
          <Link
            href="/terms"
            className="font-semibold text-white underline decoration-red-600 underline-offset-4 hover:text-red-500"
          >
            regulamin
          </Link>{" "}
          oraz{" "}
          <Link
            href="/privacy"
            className="font-semibold text-white underline decoration-red-600 underline-offset-4 hover:text-red-500"
          >
            politykę prywatności
          </Link>
        </span>
      </label>

      <div className="mt-2 sm:mt-3">
        <SkewButton
          type="submit"
          size="lg"
          className="w-full max-w-none px-10 py-4 text-[0.85rem] sm:py-5 sm:text-[1.05rem]"
        >
          Stwórz konto
        </SkewButton>
      </div>

      {hasError ? (
        <p id="register-form-error" className="text-[0.75rem] text-red-400" role="alert">
          Uzupełnij pola, hasła muszą być takie same i zaakceptuj regulamin.
        </p>
      ) : null}
      {status === "soon" ? (
        <p className="text-[0.75rem] text-zinc-300" role="status">
          Rejestrację uruchomimy wraz z otwarciem gry. Wróć wkrótce.
        </p>
      ) : null}

      <p className="mt-3 text-center text-[0.9rem] text-zinc-200 lg:text-left">
        Masz już konto?{" "}
        <Link
          href="/login"
          className="font-semibold text-white underline decoration-red-600 underline-offset-4 hover:text-red-500"
        >
          Zaloguj się
        </Link>
      </p>
    </form>
  );
}
