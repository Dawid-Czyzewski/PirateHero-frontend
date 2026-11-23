import { afterEach, describe, expect, it, vi } from "vitest";
import { getJson, type ApiResult } from "@/lib/api/apiClient";
import { KOSA, MLODY_WILK, REKIN } from "@/modules/combat/__fixtures__/combat";
import { byLevel, isHardFor } from "@/modules/combat/npc";
import { fetchNpcs } from "@/modules/combat/npcs";
import { parseNpc } from "@/modules/combat/parseNpc";

vi.mock("@/lib/api/apiClient", () => ({ getJson: vi.fn() }));

const getJsonMock = vi.mocked(getJson);

function respond(status: number, body: unknown = null): ApiResult {
  return { kind: "response", status, body };
}

describe("fetchNpcs", () => {
  afterEach(() => {
    getJsonMock.mockReset();
  });

  it("loads the opponents sorted by level", async () => {
    getJsonMock.mockResolvedValue(respond(200, [REKIN, KOSA, MLODY_WILK]));

    expect(await fetchNpcs()).toEqual({ kind: "loaded", npcs: [KOSA, MLODY_WILK, REKIN] });
    expect(getJsonMock).toHaveBeenCalledWith("/api/npcs");
  });

  it.each<[string, ApiResult, string]>([
    ["expired session", respond(401), "unauthenticated"],
    ["server error", respond(500), "unavailable"],
    ["network error", { kind: "network-error" }, "unavailable"],
    ["not a list", respond(200, { member: [] }), "unavailable"],
    ["broken npc", respond(200, [{ ...KOSA, look: { ...KOSA.look, skin: 9 } }]), "unavailable"],
  ])("reports %s", async (_, response, kind) => {
    getJsonMock.mockResolvedValue(response);

    expect((await fetchNpcs()).kind).toBe(kind);
  });
});

describe("npc rules", () => {
  it("rejects npcs with an invalid slug or level", () => {
    expect(parseNpc({ ...KOSA, id: "Kosa!" })).toBeNull();
    expect(parseNpc({ ...KOSA, level: 0 })).toBeNull();
    expect(parseNpc(KOSA)).toEqual(KOSA);
  });

  it("marks opponents two or more levels above the player as hard", () => {
    expect(isHardFor(MLODY_WILK, 1)).toBe(false);
    expect(isHardFor(REKIN, 3)).toBe(true);
    expect(isHardFor(REKIN, 4)).toBe(false);
  });

  it("sorts without changing the input", () => {
    const input = [REKIN, KOSA];

    expect(byLevel(input)).toEqual([KOSA, REKIN]);
    expect(input).toEqual([REKIN, KOSA]);
  });
});
