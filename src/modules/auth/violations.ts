import {
  NICK_MAX_LENGTH,
  NICK_MIN_LENGTH,
  PASSWORD_MIN_LENGTH,
  type FieldErrors,
} from "@/modules/auth/validation";

export type AuthField = "email" | "nick" | "password";

type Reason = "required" | "invalid" | "taken";

type ReasonMessages = Record<Exclude<Reason, "taken">, string> & { taken?: string };

type ApiViolation = { propertyPath: string; code: string | null; message: string };

const NOT_BLANK_CODE = "c1051bb4-d103-4f74-8988-acbcafc7fdc3";
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

function isViolation(value: unknown): value is ApiViolation {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.propertyPath === "string" &&
    typeof candidate.message === "string" &&
    (typeof candidate.code === "string" || candidate.code === null || candidate.code === undefined)
  );
}

function reasonOf(violation: ApiViolation): Reason {
  if (violation.code === NOT_BLANK_CODE) return "required";
  return ALREADY_TAKEN.test(violation.message) ? "taken" : "invalid";
}

function violationsOf(body: unknown): ApiViolation[] {
  if (typeof body !== "object" || body === null) return [];
  const list = (body as { violations?: unknown }).violations;
  return Array.isArray(list) ? list.filter(isViolation) : [];
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
