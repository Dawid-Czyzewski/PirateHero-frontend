import { afterEach, describe, expect, it, vi } from "vitest";
import { postJson, type ApiResult } from "@/lib/api/apiClient";
import { FIGHT_AGAINST_KOSA } from "@/modules/combat/__fixtures__/combat";
import { leveledUp, playerWon } from "@/modules/combat/fight";
import { FIGHT_ERRORS, fightNpc, type FightNpcResult } from "@/modules/combat/fightNpc";

vi.mock("@/lib/api/apiClient", () => ({ postJson: vi.fn() }));

const postJsonMock = vi.mocked(postJson);

function respond(status: number, body: unknown = null): ApiResult {
  return { kind: "response", status, body };
}

describe("fightNpc", () => {
  afterEach(() => {
    postJsonMock.mockReset();
  });

  it("posts the opponent and returns the parsed fight", async () => {
    postJsonMock.mockResolvedValue(respond(200, FIGHT_AGAINST_KOSA));

    expect(await fightNpc("kosa")).toEqual({ kind: "fought", fight: FIGHT_AGAINST_KOSA });
    expect(postJsonMock).toHaveBeenCalledWith("/api/me/fights", { npcId: "kosa" });
  });

  it.each<[string, ApiResult, FightNpcResult]>([
    ["unknown opponent", respond(404), { kind: "failure", reason: "not-found" }],
    ["missing stamina", respond(409), { kind: "failure", reason: "no-fight-points" }],
    ["rejected id", respond(422), { kind: "failure", reason: "invalid" }],
    ["server error", respond(500), { kind: "failure", reason: "unexpected" }],
    ["fight without rounds", respond(200, { ...FIGHT_AGAINST_KOSA, rounds: [] }), { kind: "failure", reason: "unexpected" }],
    ["unknown winner", respond(200, { ...FIGHT_AGAINST_KOSA, winner: "draw" }), { kind: "failure", reason: "unexpected" }],
    ["network error", { kind: "network-error" }, { kind: "failure", reason: "network" }],
    ["expired session", respond(401), { kind: "unauthenticated" }],
  ])("maps %s", async (_, response, expected) => {
    postJsonMock.mockResolvedValue(response);

    expect(await fightNpc("kosa")).toEqual(expected);
  });

  it("explains every failure in Polish", () => {
    expect(Object.values(FIGHT_ERRORS).every((message) => message.length > 0)).toBe(true);
    expect(FIGHT_ERRORS["no-fight-points"]).toMatch(/punktów walki/);
  });

  it("tells who won and whether the player levelled up", () => {
    expect(playerWon(FIGHT_AGAINST_KOSA)).toBe(true);
    expect(leveledUp(FIGHT_AGAINST_KOSA)).toBe(false);
    expect(leveledUp({ ...FIGHT_AGAINST_KOSA, level: { before: 1, after: 2 } })).toBe(true);
  });
});
