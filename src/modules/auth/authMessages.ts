import type { AuthFailure } from "@/modules/auth/authService";

export const FIX_FIELDS_MESSAGE = "Popraw zaznaczone pola.";

export const SUCCESS_MESSAGE = "Gotowe! Wchodzisz do oktagonu…";

const FAILURE_MESSAGES: Record<AuthFailure, string> = {
  "bad-credentials": "Nieprawidłowy e-mail lub hasło.",
  throttled: "Za dużo prób. Odczekaj chwilę i spróbuj ponownie.",
  network: "Brak połączenia z serwerem gry. Sprawdź internet i spróbuj ponownie.",
  unexpected: "Coś poszło nie tak po stronie serwera. Spróbuj ponownie za chwilę.",
};

export function failureMessage(reason: AuthFailure): string {
  return FAILURE_MESSAGES[reason];
}
