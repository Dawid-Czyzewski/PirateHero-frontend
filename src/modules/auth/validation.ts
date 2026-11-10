const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const NICK_RE = /^[A-Za-z0-9ĄĆĘŁŃÓŚŹŻąćęłńóśźż_.\-]+$/;
export const NICK_MIN_LENGTH = 3;
export const NICK_MAX_LENGTH = 16;
export const PASSWORD_MIN_LENGTH = 8;

export type LoginFields = {
  email: string;
  password: string;
};

export type RegisterFields = {
  nick: string;
  email: string;
  password: string;
  password2: string;
  terms: boolean;
};

export type FieldErrors<K extends string> = Partial<Record<K, string>>;

export type Validation<K extends string> =
  | { ok: true }
  | { ok: false; errors: FieldErrors<K>; first: K };

export type FieldValidator<V, K extends string> = (name: K, values: V) => string;

export const LOGIN_FIELDS = ["email", "password"] as const satisfies readonly (keyof LoginFields)[];

export const REGISTER_FIELDS = [
  "nick",
  "email",
  "password",
  "password2",
  "terms",
] as const satisfies readonly (keyof RegisterFields)[];

function emailError(value: string): string {
  const email = value.trim();
  if (!email) return "Podaj adres e-mail.";
  return EMAIL_RE.test(email) ? "" : "Nieprawidłowy format e-maila (np. dawid@cebula.pl).";
}

function passwordError(password: string): string {
  if (!password) return "Podaj hasło.";
  return password.length < PASSWORD_MIN_LENGTH ? `Hasło musi mieć co najmniej ${PASSWORD_MIN_LENGTH} znaków.` : "";
}

function nickError(value: string): string {
  const nick = value.trim();
  if (!nick) return "Podaj nick zawodnika.";
  if (nick.length < NICK_MIN_LENGTH || nick.length > NICK_MAX_LENGTH) {
    return `Nick musi mieć od ${NICK_MIN_LENGTH} do ${NICK_MAX_LENGTH} znaków.`;
  }
  return NICK_RE.test(nick) ? "" : "Nick może zawierać tylko litery, cyfry oraz znaki _ . -";
}

function repeatedPasswordError(values: RegisterFields): string {
  if (!values.password2) return "Powtórz hasło.";
  return values.password2 !== values.password ? "Hasła nie są takie same." : "";
}

export function validateFields<V, K extends string>(
  fields: readonly K[],
  validateField: FieldValidator<V, K>,
  values: V,
): Validation<K> {
  const errors: FieldErrors<K> = {};
  for (const name of fields) {
    const message = validateField(name, values);
    if (message) errors[name] = message;
  }
  const first = fields.find((name) => errors[name]);
  return first ? { ok: false, errors, first } : { ok: true };
}

export function validateLoginField(name: keyof LoginFields, values: LoginFields): string {
  return name === "email" ? emailError(values.email) : passwordError(values.password);
}

export function validateRegisterField(name: keyof RegisterFields, values: RegisterFields): string {
  switch (name) {
    case "nick":
      return nickError(values.nick);
    case "email":
      return emailError(values.email);
    case "password":
      return passwordError(values.password);
    case "password2":
      return repeatedPasswordError(values);
    case "terms":
      return values.terms ? "" : "Musisz zaakceptować regulamin, żeby założyć konto.";
  }
}

export function validateLogin(values: LoginFields): Validation<keyof LoginFields> {
  return validateFields(LOGIN_FIELDS, validateLoginField, values);
}

export function validateRegister(values: RegisterFields): Validation<keyof RegisterFields> {
  return validateFields(REGISTER_FIELDS, validateRegisterField, values);
}
