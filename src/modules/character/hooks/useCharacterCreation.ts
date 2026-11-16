"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { AUTH_ROUTES } from "@/modules/auth/authRoutes";
import type { Appearance } from "@/modules/character/appearance";
import { CHARACTER_ROUTES } from "@/modules/character/characterRoutes";
import {
  createCharacter,
  type AppearanceErrors,
  type CreateCharacterFailure,
  type CreateCharacterResult,
} from "@/modules/character/createCharacter";

export type StatusAction = "open-profile" | "retry";

export type CreationStatus = { kind: "idle" } | { kind: "ok" | "err"; text: string; action?: StatusAction };

export type CharacterCreation = {
  submitting: boolean;
  errors: AppearanceErrors;
  status: CreationStatus;
  submit: (appearance: Appearance) => Promise<void>;
};

const IDLE: CreationStatus = { kind: "idle" };

const CREATED: CreationStatus = { kind: "ok", text: "Zawodnik gotowy! Wchodzisz do oktagonu…" };
const EXISTS: CreationStatus = { kind: "err", text: "Masz już zawodnika na tym koncie.", action: "open-profile" };
const INVALID: CreationStatus = { kind: "err", text: "Popraw zaznaczone elementy wyglądu." };
const SESSION_EXPIRED: CreationStatus = { kind: "err", text: "Sesja wygasła. Przenosimy Cię do logowania…" };

const FAILURES: Record<CreateCharacterFailure, CreationStatus> = {
  network: { kind: "err", text: "Brak połączenia z serwerem gry. Sprawdź internet.", action: "retry" },
  unexpected: { kind: "err", text: "Nie udało się stworzyć zawodnika. Spróbuj za chwilę.", action: "retry" },
};

export function useCharacterCreation(): CharacterCreation {
  const router = useRouter();
  const inFlight = useRef(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<AppearanceErrors>({});
  const [status, setStatus] = useState<CreationStatus>(IDLE);

  const finishWith = (next: CreationStatus) => {
    inFlight.current = false;
    setSubmitting(false);
    setStatus(next);
  };

  const apply = (result: CreateCharacterResult) => {
    switch (result.kind) {
      case "created":
        setStatus(CREATED);
        router.push(CHARACTER_ROUTES.profile);
        return;
      case "unauthenticated":
        setStatus(SESSION_EXPIRED);
        router.replace(AUTH_ROUTES.login);
        return;
      case "exists":
        finishWith(EXISTS);
        return;
      case "invalid":
        setErrors(result.errors);
        finishWith(INVALID);
        return;
      case "failure":
        finishWith(FAILURES[result.reason]);
    }
  };

  const submit = async (appearance: Appearance) => {
    if (inFlight.current) return;
    inFlight.current = true;
    setSubmitting(true);
    setErrors({});
    setStatus(IDLE);
    apply(await createCharacter(appearance));
  };

  return { submitting, errors, status, submit };
}
