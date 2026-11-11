import { NOT_BLANK_CODE, violationsOf, type ApiViolation } from "@/lib/api/violations";
import {
  NICK_MAX_LENGTH,
  NICK_MIN_LENGTH,
  PASSWORD_MIN_LENGTH,
  type FieldErrors,
} from "@/modules/auth/validation";

export type AuthField = "email" | "nick" | "password";

type Reason = "required" | "invalid" | "taken";

type ReasonMessages = Record<Exclude<Reason, "taken">, string> & { taken?: string };

const ALREADY_TAKEN = /is already taken\.$/;

const MESSAGES: Record<AuthField, ReasonMessages> = {
  email: {
    required: "Podaj adres e-mail.",
    invalid: "Nieprawidłowy adres e-mail.",
    taken: "Ten e-mail jest już zajęty.",
  },
  nick: {
    required: "Podaj nick zawodnika.",
    invalid: `Nick musi mieć od ${NICK_MIN_LENGTH} do ${NICK_MAX_LENGTH} znaków.`,
    taken: "Ten nick jest już zajęty.",
  },
  password: {
    required: "Podaj hasło.",
    invalid: `Hasło musi mieć co najmniej ${PASSWORD_MIN_LENGTH} znaków.`,
  },
};

function isAuthField(value: string): value is AuthField {
  return Object.hasOwn(MESSAGES, value);
}

function reasonOf(violation: ApiViolation): Reason {
  if (violation.code === NOT_BLANK_CODE) return "required";
  return ALREADY_TAKEN.test(violation.message) ? "taken" : "invalid";
}

export function fieldErrorsFrom(body: unknown): FieldErrors<AuthField> {
  const errors: FieldErrors<AuthField> = {};
  for (const violation of violationsOf(body)) {
    const field = violation.propertyPath;
    if (isAuthField(field) && !errors[field]) {
      const messages = MESSAGES[field];
      errors[field] = messages[reasonOf(violation)] ?? messages.invalid;
    }
  }
  return errors;
}
