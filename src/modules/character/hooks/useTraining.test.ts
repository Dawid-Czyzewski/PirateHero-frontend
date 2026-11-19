import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { CharacterSheet } from "@/modules/character/characterSheet";
import { useTraining } from "@/modules/character/hooks/useTraining";
import { trainStat, type TrainStatResult } from "@/modules/character/trainStat";

const replace = vi.fn();
const router = { replace };
const refresh = vi.fn();
const replaceCharacter = vi.fn();

vi.mock("next/navigation", () => ({ useRouter: () => router }));
vi.mock("@/modules/character/trainStat", () => ({ trainStat: vi.fn() }));
vi.mock("@/modules/character/hooks/CharacterSheetContext", () => ({
  useCharacterSheetSession: () => ({ refresh, replaceCharacter }),
}));

const trainMock = vi.mocked(trainStat);

const CHARACTER: CharacterSheet = {
  id: "c1",
  nick: "Cebulak",
  level: 1,
  maxHp: 25,
  experience: { current: 0, required: 100 },
  stats: { strength: 2, endurance: 1, technique: 1, charisma: 1 },
  stamina: { current: 90, max: 100, nextPointInSeconds: 180 },
  wallet: { onions: 0, goldTeeth: 0, reach: 0, medals: 0 },
  appearance: { face: 0, hair: 0, beard: 0, skin: 0, tattoo: 0 },
};

async function trainWith(result: TrainStatResult) {
  trainMock.mockResolvedValue(result);
  const view = renderHook(() => useTraining());
  await act(async () => {
    view.result.current.train("strength");
  });
  return view.result;
}

describe("useTraining", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("marks the stat as pending until the server answers", async () => {
    let answer: (result: TrainStatResult) => void = () => undefined;
    trainMock.mockReturnValue(new Promise((resolve) => (answer = resolve)));
    const { result } = renderHook(() => useTraining());

    act(() => {
      result.current.train("technique");
    });
    expect(result.current.pendingStat).toBe("technique");

    await act(async () => answer({ kind: "trained", character: CHARACTER }));
    expect(result.current.pendingStat).toBeNull();
  });

  it("replaces the character and records the gain", async () => {
    const result = await trainWith({ kind: "trained", character: CHARACTER });

    expect(trainMock).toHaveBeenCalledWith("strength");
    expect(replaceCharacter).toHaveBeenCalledWith(CHARACTER);
    expect(result.current.lastGain).toEqual({ stat: "strength", id: 1 });
    expect(result.current.error).toBeNull();
  });

  it("explains missing stamina in Polish and resyncs the sheet", async () => {
    const result = await trainWith({ kind: "failure", reason: "no-stamina" });

    expect(result.current.error).toMatch(/Za mało Kondychy/);
    expect(refresh).toHaveBeenCalledTimes(1);
    expect(replaceCharacter).not.toHaveBeenCalled();
  });

  it.each([
    ["invalid", /nie da się teraz trenować/],
    ["network", /Brak połączenia/],
    ["unexpected", /chwilowy problem/],
  ] as const)("shows a readable message for %s failures", async (reason, message) => {
    const result = await trainWith({ kind: "failure", reason });

    expect(result.current.error).toMatch(message);
    expect(refresh).not.toHaveBeenCalled();
  });

  it.each([
    [{ kind: "unauthenticated" } as const, "/login"],
    [{ kind: "missing" } as const, "/create-character"],
  ])("redirects when %o", async (outcome, path) => {
    await trainWith(outcome);

    expect(replace).toHaveBeenCalledWith(path);
  });
});
