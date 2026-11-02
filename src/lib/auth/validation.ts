const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const NICK_RE = /^[A-Za-z0-9ĄĆĘŁŃÓŚŹŻąćęłńóśźż_.\-]+$/;

export type LoginFields = {
  login: string;
  password: string;
};

export type RegisterFields = {
  nick: string;
  email: string;
  password: string;
  password2: string;
  terms: boolean;
};

export type FieldErrors<T extends string> = Partial<Record<T, string>>;

export function validateLoginField(
  name: keyof LoginFields,
  values: LoginFields,
): string {
  if (name === "login") {
    const v = values.login.trim();
    if (!v) return "Podaj e-mail lub login.";
    if (v.includes("@")) {
      return EMAIL_RE.test(v)
        ? ""
        : "Nieprawidłowy format e-maila (np. dawid@cebula.pl).";
    }
    if (v.length < 3 || v.length > 16) {
      return "Login musi mieć od 3 do 16 znaków.";
    }
    return "";
  }

  if (!values.password) return "Podaj hasło.";
  return values.password.length < 8
    ? "Hasło musi mieć co najmniej 8 znaków."
    : "";
}

export function validateLogin(
  values: LoginFields,
): { ok: true } | { ok: false; errors: FieldErrors<keyof LoginFields>; first: keyof LoginFields } {
  const errors: FieldErrors<keyof LoginFields> = {};
  (["login", "password"] as const).forEach((name) => {
    const msg = validateLoginField(name, values);
    if (msg) errors[name] = msg;
  });
  const first = (["login", "password"] as const).find((name) => errors[name]);
  if (first) return { ok: false, errors, first };
  return { ok: true };
}

export function validateRegisterField(
  name: keyof RegisterFields,
  values: RegisterFields,
): string {
  if (name === "nick") {
    const v = values.nick.trim();
    if (!v) return "Podaj nick zawodnika.";
    if (v.length < 3 || v.length > 16) {
      return "Nick musi mieć od 3 do 16 znaków.";
    }
    if (!NICK_RE.test(v)) {
      return "Nick może zawierać tylko litery, cyfry oraz znaki _ . -";
    }
    return "";
  }
  if (name === "email") {
    const v = values.email.trim();
    if (!v) return "Podaj adres e-mail.";
    return EMAIL_RE.test(v)
      ? ""
      : "Nieprawidłowy format e-maila (np. dawid@cebula.pl).";
  }
  if (name === "password") {
    if (!values.password) return "Podaj hasło.";
    return values.password.length < 8
      ? "Hasło musi mieć co najmniej 8 znaków."
      : "";
  }
  if (name === "password2") {
    if (!values.password2) return "Powtórz hasło.";
    return values.password2 !== values.password
      ? "Hasła nie są takie same."
      : "";
  }
  return values.terms
    ? ""
    : "Musisz zaakceptować regulamin, żeby założyć konto.";
}

export function validateRegister(
  values: RegisterFields,
): {
  ok: true;
} | {
  ok: false;
  errors: FieldErrors<keyof RegisterFields>;
  first: keyof RegisterFields;
} {
  const errors: FieldErrors<keyof RegisterFields> = {};
  (["nick", "email", "password", "password2", "terms"] as const).forEach(
    (name) => {
      const msg = validateRegisterField(name, values);
      if (msg) errors[name] = msg;
    },
  );
  const first = (
    ["nick", "email", "password", "password2", "terms"] as const
  ).find((name) => errors[name]);
  if (first) return { ok: false, errors, first };
  return { ok: true };
}
