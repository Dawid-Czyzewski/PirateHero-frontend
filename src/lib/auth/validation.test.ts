import { describe, expect, it } from "vitest";
import {
  validateLogin,
  validateLoginField,
  validateRegister,
  validateRegisterField,
} from "@/lib/auth/validation";

describe("validateLogin", () => {
  it("rejects empty login and short password", () => {
    const result = validateLogin({ login: "", password: "123" });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.login).toMatch(/e-mail lub login/i);
    expect(result.errors.password).toMatch(/8 znaków/i);
    expect(result.first).toBe("login");
  });

  it("accepts valid credentials", () => {
    expect(
      validateLogin({ login: "gracz", password: "sekret12" }).ok,
    ).toBe(true);
    expect(
      validateLoginField("login", {
        login: "dawid@cebula.pl",
        password: "sekret12",
      }),
    ).toBe("");
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
