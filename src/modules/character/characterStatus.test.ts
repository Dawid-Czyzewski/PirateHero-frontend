import { afterEach, describe, expect, it, vi } from "vitest";
import { getJson, type ApiResult } from "@/lib/api/apiClient";
import { fetchCharacterStatus } from "@/modules/character/characterStatus";
import { resolvePlayerHome } from "@/modules/character/playerHome";

vi.mock("@/lib/api/apiClient", () => ({ getJson: vi.fn() }));

const getJsonMock = vi.mocked(getJson);

function respond(status: number): ApiResult {
  return { kind: "response", status, body: null };
}

describe("character status", () => {
  afterEach(() => {
    getJsonMock.mockReset();
  });

  it.each([
    [respond(200), "exists"],
    [respond(404), "missing"],
    [respond(401), "unavailable"],
    [respond(500), "unavailable"],
    [{ kind: "network-error" } as const, "unavailable"],
  ])("maps %o to %s", async (result, status) => {
    getJsonMock.mockResolvedValue(result);

    expect(await fetchCharacterStatus()).toBe(status);
    expect(getJsonMock).toHaveBeenCalledWith("/api/me/character");
  });

  it("sends a player with a character to the profile", async () => {
    getJsonMock.mockResolvedValue(respond(200));

    expect(await resolvePlayerHome()).toBe("/postac");
  });

  it.each([respond(404), respond(500)])("sends everyone else to the creator (%o)", async (result) => {
    getJsonMock.mockResolvedValue(result);

    expect(await resolvePlayerHome()).toBe("/create-character");
  });
});
