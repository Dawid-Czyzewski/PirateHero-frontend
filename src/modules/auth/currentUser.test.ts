import { afterEach, describe, expect, it, vi } from "vitest";
import { getJson, type ApiResult } from "@/lib/api/apiClient";
import { fetchCurrentUser } from "@/modules/auth/currentUser";

vi.mock("@/lib/api/apiClient", () => ({ getJson: vi.fn() }));

const getJsonMock = vi.mocked(getJson);

function respond(status: number, body: unknown = null): ApiResult {
  return { kind: "response", status, body };
}

describe("fetchCurrentUser", () => {
  afterEach(() => {
    getJsonMock.mockReset();
  });

  it("returns the authenticated player", async () => {
    getJsonMock.mockResolvedValue(
      respond(200, { id: "u1", email: "gracz@example.com", nick: "Cebulak", roles: ["ROLE_USER"] }),
    );

    expect(await fetchCurrentUser()).toEqual({
      kind: "authenticated",
      user: { id: "u1", email: "gracz@example.com", nick: "Cebulak" },
    });
    expect(getJsonMock).toHaveBeenCalledWith("/api/me");
  });

  it("reports a missing session", async () => {
    getJsonMock.mockResolvedValue(respond(401));

    expect(await fetchCurrentUser()).toEqual({ kind: "unauthenticated" });
  });

  it.each([
    ["server error", respond(500)],
    ["malformed body", respond(200, { id: 1 })],
    ["network error", { kind: "network-error" } as const],
  ])("reports %s as unavailable", async (_, result) => {
    getJsonMock.mockResolvedValue(result);

    expect(await fetchCurrentUser()).toEqual({ kind: "unavailable" });
  });
});
