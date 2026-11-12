import { afterEach, describe, expect, it, vi } from "vitest";
import { getJson, type ApiResult } from "@/lib/api/apiClient";
import { fetchMyCharacter } from "@/modules/character/myCharacter";

vi.mock("@/lib/api/apiClient", () => ({ getJson: vi.fn() }));

const getJsonMock = vi.mocked(getJson);

const CHARACTER = {
  id: "c1",
  nick: "Cebulak",
  level: 3,
  maxHp: 45,
  stats: { strength: 4, endurance: 2, technique: 1, charisma: 5 },
  wallet: { cebuliony: 1250, zloteZeby: 10, kondycha: 100, zasiegi: 0, medale: 2 },
  appearance: { face: 3, hair: 1, beard: 7, skin: 4, tattoo: 0 },
};

function respond(status: number, body: unknown = null): ApiResult {
  return { kind: "response", status, body };
}

describe("fetchMyCharacter", () => {
  afterEach(() => {
    getJsonMock.mockReset();
  });

  it("returns the parsed character sheet", async () => {
    getJsonMock.mockResolvedValue(respond(200, { ...CHARACTER, "@context": "/api/contexts/Character" }));

    expect(await fetchMyCharacter()).toEqual({ kind: "loaded", character: CHARACTER });
    expect(getJsonMock).toHaveBeenCalledWith("/api/me/character");
  });

  it.each([
    ["no character", respond(404), "missing"],
    ["expired session", respond(401), "unauthenticated"],
    ["server error", respond(500), "unavailable"],
    ["network error", { kind: "network-error" } as const, "unavailable"],
  ])("maps %s to %s", async (_, result, kind) => {
    getJsonMock.mockResolvedValue(result);

    expect(await fetchMyCharacter()).toEqual({ kind });
  });

  it.each([
    ["missing nick", { ...CHARACTER, nick: undefined }],
    ["text level", { ...CHARACTER, level: "3" }],
    ["missing stat", { ...CHARACTER, stats: { strength: 4, endurance: 2, technique: 1 } }],
    ["negative amount", { ...CHARACTER, wallet: { ...CHARACTER.wallet, medale: -1 } }],
    ["unknown variant", { ...CHARACTER, appearance: { ...CHARACTER.appearance, skin: 5 } }],
    ["empty body", null],
  ])("treats a response with %s as unavailable", async (_, body) => {
    getJsonMock.mockResolvedValue(respond(200, body));

    expect(await fetchMyCharacter()).toEqual({ kind: "unavailable" });
  });
});
