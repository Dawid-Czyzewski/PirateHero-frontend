"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import type { Appearance } from "@/modules/character/appearance";
import { CHARACTER_ROUTES } from "@/modules/character/characterRoutes";
import {
  createCharacter,
  type AppearanceErrors,
  type CreateCharacterFailure,
  type CreateCharacterResult,
} from "@/modules/character/createCharacter";

export type CreationStatus = { kind: "idle" } | { kind: "ok" | "err"; text: string };

export type CharacterCreation = {
  submitting: boolean;
  errors: AppearanceErrors;
  status: CreationStatus;
  submit: (appearance: Appearance) => Promise<void>;
};

const IDLE: CreationStatus = { kind: "idle" };

const CREATED_MESSAGE = "Zawodnik gotowy! Wchodzisz do oktagonu…";
const EXISTS_MESSAGE = "Masz już zawodnika. Przenosimy Cię do niego…";
const INVALID_MESSAGE = "Popraw zaznaczone elementy wyglądu.";

const FAILURE_MESSAGES: Record<CreateCharacterFailure, string> = {
  network: "Brak połączenia z serwerem gry. Sprawdź internet i spróbuj ponownie.",
  unexpected: "Nie udało się stworzyć zawodnika. Spróbuj ponownie za chwilę.",
};

export function useCharacterCreation(): CharacterCreation {
  const router = useRouter();
  const inFlight = useRef(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<AppearanceErrors>({});
  const [status, setStatus] = useState<CreationStatus>(IDLE);

  const finishWith = (status: CreationStatus) => {
    inFlight.current = false;
    setSubmitting(false);
    setStatus(status);
  };

  const apply = (result: CreateCharacterResult) => {
    switch (result.kind) {
      case "created":
        setStatus({ kind: "ok", text: CREATED_MESSAGE });
        router.push(CHARACTER_ROUTES.profile);
        return;
      case "exists":
        setStatus({ kind: "err", text: EXISTS_MESSAGE });
        router.push(CHARACTER_ROUTES.profile);
        return;
      case "invalid":
        setErrors(result.errors);
        finishWith({ kind: "err", text: INVALID_MESSAGE });
        return;
      case "failure":
        finishWith({ kind: "err", text: FAILURE_MESSAGES[result.reason] });
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
