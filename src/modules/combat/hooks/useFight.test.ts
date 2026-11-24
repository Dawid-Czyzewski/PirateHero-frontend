import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { FIGHT_AGAINST_KOSA } from "@/modules/combat/__fixtures__/combat";
import { fightNpc, type FightNpcResult } from "@/modules/combat/fightNpc";
import { useFight } from "@/modules/combat/hooks/useFight";

const replace = vi.fn();
const router = { replace };

vi.mock("next/navigation", () => ({ useRouter: () => router }));
vi.mock("@/modules/combat/fightNpc", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/modules/combat/fightNpc")>()),
  fightNpc: vi.fn(),
}));

const fightMock = vi.mocked(fightNpc);

async function fightWith(result: FightNpcResult) {
  fightMock.mockResolvedValue(result);
  const view = renderHook(() => useFight());
  await act(async () => {
    view.result.current.start("kosa");
  });
  return view.result;
}

describe("useFight", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("is pending until the server answers", () => {
    fightMock.mockReturnValue(new Promise(() => undefined));
    const { result } = renderHook(() => useFight());

    act(() => {
      result.current.start("kosa");
    });

    expect(result.current.state).toEqual({ kind: "pending", npcId: "kosa" });
    expect(fightMock).toHaveBeenCalledWith("kosa");
  });

  it("keeps the fight result", async () => {
    const result = await fightWith({ kind: "fought", fight: FIGHT_AGAINST_KOSA });

    expect(result.current.state).toEqual({ kind: "done", fight: FIGHT_AGAINST_KOSA });
  });

  it("shows a Polish message when the fight fails", async () => {
    const result = await fightWith({ kind: "failure", reason: "no-fight-points" });

    expect(result.current.state).toEqual({ kind: "failed", reason: "no-fight-points", message: expect.stringMatching(/Za mało punktów walki/) });
  });

  it("sends an expired session to the login page", async () => {
    await fightWith({ kind: "unauthenticated" });

    expect(replace).toHaveBeenCalledWith("/login");
  });

  it("goes back to idle on reset", async () => {
    const result = await fightWith({ kind: "fought", fight: FIGHT_AGAINST_KOSA });

    act(() => result.current.reset());

    expect(result.current.state).toEqual({ kind: "idle" });
  });
});
