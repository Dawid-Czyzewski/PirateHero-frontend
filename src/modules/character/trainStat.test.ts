import { afterEach, describe, expect, it, vi } from "vitest";
import { postJson, type ApiResult } from "@/lib/api/apiClient";
import { trainStat, type TrainStatResult } from "@/modules/character/trainStat";

vi.mock("@/lib/api/apiClient", () => ({ postJson: vi.fn() }));

const postJsonMock = vi.mocked(postJson);

const CHARACTER = {
  id: "c1",
  nick: "Cebulak",
  level: 3,
  maxHp: 45,
  experience: { current: 120, required: 300 },
  stats: { strength: 5, endurance: 2, technique: 1, charisma: 5 },
  stamina: { current: 60, max: 100, nextPointInSeconds: 180 },
  wallet: { onions: 1250, goldTeeth: 10, reach: 0, medals: 2 },
  appearance: { face: 3, hair: 1, beard: 7, skin: 4, tattoo: 0 },
};

function respond(status: number, body: unknown = null): ApiResult {
  return { kind: "response", status, body };
}

describe("trainStat", () => {
  afterEach(() => {
    postJsonMock.mockReset();
  });

  it("posts the chosen stat and returns the updated character", async () => {
    postJsonMock.mockResolvedValue(respond(200, CHARACTER));

    expect(await trainStat("strength")).toEqual({ kind: "trained", character: CHARACTER });
    expect(postJsonMock).toHaveBeenCalledWith("/api/me/character/training", { stat: "strength" });
  });

  it.each<[string, ApiResult, TrainStatResult]>([
    ["missing stamina", respond(409, { detail: "Za mało Kondychy" }), { kind: "failure", reason: "no-stamina" }],
    ["rejected stat", respond(422), { kind: "failure", reason: "invalid" }],
    ["server error", respond(500), { kind: "failure", reason: "unexpected" }],
    ["malformed body", respond(200, { id: "c1" }), { kind: "failure", reason: "unexpected" }],
    ["network error", { kind: "network-error" }, { kind: "failure", reason: "network" }],
    ["expired session", respond(401), { kind: "unauthenticated" }],
    ["no character", respond(404), { kind: "missing" }],
  ])("maps %s", async (_, response, expected) => {
    postJsonMock.mockResolvedValue(response);

    expect(await trainStat("charisma")).toEqual(expected);
  });
});
