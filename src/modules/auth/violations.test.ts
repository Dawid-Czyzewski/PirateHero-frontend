import { describe, expect, it } from "vitest";
import { fieldErrorsFrom } from "@/modules/auth/violations";

const NOT_BLANK = "c1051bb4-d103-4f74-8988-acbcafc7fdc3";
const INVALID_EMAIL = "bd79c0ab-ddba-46cc-a703-a7a4b08de310";
const TOO_SHORT = "9ff3fdc4-b214-49db-8718-39c315e33d45";

function violation(propertyPath: string, message: string, code: string | null = null) {
  return { propertyPath, message, code };
}

describe("fieldErrorsFrom", () => {
  it("translates conflicts to Polish messages", () => {
    const body = {
      violations: [
        violation("email", "This email is already taken."),
        violation("nick", "This nick is already taken."),
      ],
    };

    expect(fieldErrorsFrom(body)).toEqual({
      email: "Ten e-mail jest już zajęty.",
      nick: "Ten nick jest już zajęty.",
    });
  });

  it("translates constraint violations by code", () => {
    const body = {
      violations: [
        violation("email", "This value should not be blank.", NOT_BLANK),
        violation("nick", "This value is too short.", TOO_SHORT),
        violation("password", "This value is too short.", TOO_SHORT),
      ],
    };

    expect(fieldErrorsFrom(body)).toEqual({
      email: "Podaj adres e-mail.",
      nick: "Nick musi mieć od 3 do 16 znaków.",
      password: "Hasło musi mieć co najmniej 8 znaków.",
    });
  });

  it("keeps the first message per field", () => {
    const body = {
      violations: [
        violation("email", "This value should not be blank.", NOT_BLANK),
        violation("email", "This value is not a valid email address.", INVALID_EMAIL),
      ],
    };

    expect(fieldErrorsFrom(body)).toEqual({ email: "Podaj adres e-mail." });
  });

  it("ignores unknown fields and malformed bodies", () => {
    expect(fieldErrorsFrom({ violations: [violation("", "User already exists."), { foo: 1 }] })).toEqual({});
    expect(fieldErrorsFrom({ violations: [violation("toString", "x")] })).toEqual({});
    expect(fieldErrorsFrom(null)).toEqual({});
    expect(fieldErrorsFrom("oops")).toEqual({});
  });
});
