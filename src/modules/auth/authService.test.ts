import { afterEach, describe, expect, it, vi } from "vitest";
import { postJson, type ApiResult } from "@/lib/api/apiClient";
import { login, registerAndLogin } from "@/modules/auth/authService";

vi.mock("@/lib/api/apiClient", () => ({ postJson: vi.fn() }));

const postJsonMock = vi.mocked(postJson);

function respond(status: number, body: unknown = null): ApiResult {
  return { kind: "response", status, body };
}

const CREDENTIALS = { email: "gracz@example.com", password: "sekret12" };
const REGISTRATION = { ...CREDENTIALS, nick: "Cebulak" };

describe("login", () => {
  afterEach(() => {
    postJsonMock.mockReset();
  });

  it("posts credentials and succeeds on 2xx", async () => {
    postJsonMock.mockResolvedValue(respond(200));

    expect(await login(CREDENTIALS)).toEqual({ kind: "success" });
    expect(postJsonMock).toHaveBeenCalledWith("/api/auth/login", CREDENTIALS);
  });

  it.each([
    [respond(401, { message: "Invalid credentials." }), "bad-credentials"],
    [respond(429), "throttled"],
    [respond(500), "unexpected"],
    [{ kind: "network-error" } as const, "network"],
  ])("maps %o to %s", async (result, reason) => {
    postJsonMock.mockResolvedValue(result);

    expect(await login(CREDENTIALS)).toEqual({ kind: "failure", reason });
  });
});

describe("registerAndLogin", () => {
  afterEach(() => {
    postJsonMock.mockReset();
  });

  it("registers and then logs the player in", async () => {
    postJsonMock.mockResolvedValueOnce(respond(201)).mockResolvedValueOnce(respond(200));

    expect(await registerAndLogin(REGISTRATION)).toEqual({ kind: "success" });
    expect(postJsonMock).toHaveBeenNthCalledWith(1, "/api/auth/register", REGISTRATION);
    expect(postJsonMock).toHaveBeenNthCalledWith(2, "/api/auth/login", CREDENTIALS);
  });

  it("returns field errors for 422", async () => {
    postJsonMock.mockResolvedValue(
      respond(422, { violations: [{ propertyPath: "email", message: "This email is already taken.", code: null }] }),
    );

    expect(await registerAndLogin(REGISTRATION)).toEqual({
      kind: "invalid",
      errors: { email: "Ten e-mail jest już zajęty." },
    });
    expect(postJsonMock).toHaveBeenCalledTimes(1);
  });

  it("treats 422 without known fields as unexpected", async () => {
    postJsonMock.mockResolvedValue(respond(422, { violations: [] }));

    expect(await registerAndLogin(REGISTRATION)).toEqual({ kind: "failure", reason: "unexpected" });
  });

  it("reports throttling", async () => {
    postJsonMock.mockResolvedValue(respond(429));

    expect(await registerAndLogin(REGISTRATION)).toEqual({ kind: "failure", reason: "throttled" });
  });
});
