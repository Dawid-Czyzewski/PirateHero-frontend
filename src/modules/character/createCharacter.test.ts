import { afterEach, describe, expect, it, vi } from "vitest";
import { postJson, type ApiResult } from "@/lib/api/apiClient";
import { DEFAULT_APPEARANCE } from "@/modules/character/appearance";
import { createCharacter } from "@/modules/character/createCharacter";

vi.mock("@/lib/api/apiClient", () => ({ postJson: vi.fn() }));

const postJsonMock = vi.mocked(postJson);

function respond(status: number, body: unknown = null): ApiResult {
  return { kind: "response", status, body };
}

const APPEARANCE = { ...DEFAULT_APPEARANCE, face: 3, skin: 4 };

describe("createCharacter", () => {
  afterEach(() => {
    postJsonMock.mockReset();
  });

  it("posts the appearance and reports creation", async () => {
    postJsonMock.mockResolvedValue(respond(201, { id: "c1" }));

    expect(await createCharacter(APPEARANCE)).toEqual({ kind: "created" });
    expect(postJsonMock).toHaveBeenCalledWith("/api/characters", APPEARANCE);
  });

  it("reports an existing character on 409", async () => {
    postJsonMock.mockResolvedValue(respond(409, { detail: "Character already exists." }));

    expect(await createCharacter(APPEARANCE)).toEqual({ kind: "exists" });
  });

  it("maps 422 violations to Polish messages per part", async () => {
    postJsonMock.mockResolvedValue(
      respond(422, {
        violations: [
          { propertyPath: "skin", message: "This value should be between 0 and 4.", code: "x" },
          { propertyPath: "hair", message: "This value should not be null.", code: "y" },
          { propertyPath: "unknown", message: "Ignored.", code: null },
        ],
      }),
    );

    expect(await createCharacter(APPEARANCE)).toEqual({
      kind: "invalid",
      errors: { skin: "Skóra: wybierz poprawny wariant.", hair: "Włosy: wybierz poprawny wariant." },
    });
  });

  it.each([
    ["422 without known parts", respond(422, { violations: [] }), "unexpected"],
    ["server error", respond(500), "unexpected"],
    ["expired session", respond(401), "unexpected"],
    ["network error", { kind: "network-error" } as const, "network"],
  ])("reports %s as a failure", async (_, result, reason) => {
    postJsonMock.mockResolvedValue(result);

    expect(await createCharacter(APPEARANCE)).toEqual({ kind: "failure", reason });
  });
});
