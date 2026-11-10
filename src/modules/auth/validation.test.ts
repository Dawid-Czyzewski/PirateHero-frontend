import { describe, expect, it } from "vitest";
import {
  validateLogin,
  validateLoginField,
  validateRegister,
  validateRegisterField,
} from "@/modules/auth/validation";

describe("validateLogin", () => {
  it("rejects empty email and short password", () => {
    const result = validateLogin({ email: "", password: "123" });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.email).toMatch(/podaj adres e-mail/i);
    expect(result.errors.password).toMatch(/8 znaków/i);
    expect(result.first).toBe("email");
  });

  it("rejects a nick in place of email", () => {
    expect(validateLoginField("email", { email: "gracz", password: "sekret12" })).toMatch(/format e-maila/i);
  });

  it("accepts valid credentials", () => {
    expect(validateLogin({ email: "dawid@cebula.pl", password: "sekret12" }).ok).toBe(true);
  });
});

describe("validateRegister", () => {
  it("requires matching passwords and accepted terms", () => {
    const result = validateRegister({
      nick: "Freak",
      email: "a@b.pl",
      password: "sekret12",
      password2: "sekret99",
      terms: false,
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.password2).toMatch(/nie są takie same/i);
    expect(result.errors.terms).toMatch(/regulamin/i);
  });

  it("rejects invalid nick characters", () => {
    expect(
      validateRegisterField("nick", {
        nick: "bad nick!",
        email: "",
        password: "",
        password2: "",
        terms: false,
      }),
    ).toMatch(/litery, cyfry/i);
  });

  it("accepts a valid registration payload", () => {
    expect(
      validateRegister({
        nick: "Freak_1",
        email: "dawid@cebula.pl",
        password: "sekret12",
        password2: "sekret12",
        terms: true,
      }).ok,
    ).toBe(true);
  });
});
