import { act, renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { CharacterSheet } from "@/modules/character/characterSheet";
import { CharacterSheetProvider, useCharacterSheetSession } from "@/modules/character/hooks/CharacterSheetContext";
import { useTraining } from "@/modules/character/hooks/useTraining";
import { fetchMyCharacter } from "@/modules/character/myCharacter";
import { trainStat, type TrainStatResult } from "@/modules/character/trainStat";

const replace = vi.fn();
const router = { replace };

vi.mock("next/navigation", () => ({ useRouter: () => router }));
vi.mock("@/modules/character/myCharacter", () => ({ fetchMyCharacter: vi.fn() }));
vi.mock("@/modules/character/trainStat", () => ({ trainStat: vi.fn() }));

const fetchMock = vi.mocked(fetchMyCharacter);
const trainMock = vi.mocked(trainStat);

const CHARACTER: CharacterSheet = {
  id: "c1",
  nick: "Cebulak",
  level: 1,
  maxHp: 20,
  experience: { current: 0, required: 100 },
  stats: { strength: 1, endurance: 1, technique: 1, charisma: 1 },
  stamina: { current: 100, max: 100, nextPointInSeconds: null },
  wallet: { onions: 0, goldTeeth: 0, reach: 0, medals: 0 },
  appearance: { face: 0, hair: 0, beard: 0, skin: 0, tattoo: 0 },
};

const SERVER_AFTER_ENDURANCE: CharacterSheet = {
  ...CHARACTER,
  maxHp: 25,
  stats: { ...CHARACTER.stats, endurance: 2 },
  stamina: { current: 90, max: 100, nextPointInSeconds: 178 },
};

function wrapper({ children }: { children: ReactNode }) {
  return <CharacterSheetProvider>{children}</CharacterSheetProvider>;
}

function deferred() {
  let resolve: (result: TrainStatResult) => void = () => undefined;
  const promise = new Promise<TrainStatResult>((done) => (resolve = done));
  return { promise, resolve };
}

async function renderTraining() {
  fetchMock.mockResolvedValue({ kind: "loaded", character: CHARACTER });
  const view = renderHook(() => ({ training: useTraining(), session: useCharacterSheetSession() }), { wrapper });
  await waitFor(() => expect(view.result.current.session.state.kind).toBe("loaded"));
  return view.result;
}

function characterOf(result: Awaited<ReturnType<typeof renderTraining>>): CharacterSheet {
  const { state } = result.current.session;
  if (state.kind !== "loaded") throw new Error("character not loaded");
  return state.character;
}

describe("useTraining", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("applies training at once and then takes the server state", async () => {
    const answer = deferred();
    trainMock.mockReturnValue(answer.promise);
    const result = await renderTraining();

    act(() => result.current.training.train("endurance"));

    expect(characterOf(result).stats.endurance).toBe(2);
    expect(characterOf(result).stamina).toEqual({ current: 90, max: 100, nextPointInSeconds: 180 });
    expect(result.current.training.lastGain).toEqual({ stat: "endurance", id: 1 });

    await act(async () => answer.resolve({ kind: "trained", character: SERVER_AFTER_ENDURANCE }));

    expect(characterOf(result)).toEqual(SERVER_AFTER_ENDURANCE);
    expect(trainMock).toHaveBeenCalledWith("endurance");
  });

  it("rolls back and explains the error in Polish when the server refuses", async () => {
    trainMock.mockResolvedValue({ kind: "failure", reason: "unexpected" });
    const result = await renderTraining();

    await act(async () => result.current.training.train("strength"));

    expect(characterOf(result)).toEqual(CHARACTER);
    expect(result.current.training.error).toBe("Serwer ma chwilowy problem. Spróbuj ponownie za moment.");
    expect(result.current.training.lastGain).toBeNull();
  });

  it("resyncs stamina from the server after a conflict", async () => {
    trainMock.mockResolvedValue({ kind: "failure", reason: "no-stamina" });
    const result = await renderTraining();

    await act(async () => result.current.training.train("strength"));

    expect(result.current.training.error).toMatch(/Za mało Kondychy/);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("sends rapid trainings in order and keeps the confirmed state when a later one fails", async () => {
    trainMock
      .mockResolvedValueOnce({ kind: "trained", character: SERVER_AFTER_ENDURANCE })
      .mockResolvedValueOnce({ kind: "failure", reason: "network" });
    const result = await renderTraining();

    act(() => {
      result.current.training.train("endurance");
      result.current.training.train("charisma");
    });
    expect(characterOf(result).stats).toEqual({ strength: 1, endurance: 2, technique: 1, charisma: 2 });
    expect(characterOf(result).stamina.current).toBe(80);

    await waitFor(() => expect(result.current.training.error).toMatch(/Brak połączenia/));
    expect(trainMock.mock.calls).toEqual([["endurance"], ["charisma"]]);
    expect(characterOf(result)).toEqual(SERVER_AFTER_ENDURANCE);
  });

  it.each([
    [{ kind: "unauthenticated" } as const, "/login"],
    [{ kind: "missing" } as const, "/create-character"],
  ])("rolls back and redirects when %o", async (outcome, path) => {
    trainMock.mockResolvedValue(outcome);
    const result = await renderTraining();

    await act(async () => result.current.training.train("technique"));

    expect(characterOf(result)).toEqual(CHARACTER);
    expect(replace).toHaveBeenCalledWith(path);
  });
});
