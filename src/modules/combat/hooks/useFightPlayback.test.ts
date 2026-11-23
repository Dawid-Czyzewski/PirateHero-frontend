import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { FIGHT_AGAINST_KOSA } from "@/modules/combat/__fixtures__/combat";
import { ROUND_MS, useFightPlayback } from "@/modules/combat/hooks/useFightPlayback";

function advanceRound() {
  act(() => {
    vi.advanceTimersByTime(ROUND_MS);
  });
}

describe("useFightPlayback", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("starts before the first blow with full health", () => {
    const { result } = renderHook(() => useFightPlayback(FIGHT_AGAINST_KOSA));

    expect(result.current).toMatchObject({ round: null, playerHp: 15, npcHp: 15, finished: false });
  });

  it("reveals one round every 800 ms", () => {
    const { result } = renderHook(() => useFightPlayback(FIGHT_AGAINST_KOSA));

    act(() => {
      vi.advanceTimersByTime(ROUND_MS - 1);
    });
    expect(result.current.round).toBeNull();

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(result.current).toMatchObject({ round: FIGHT_AGAINST_KOSA.rounds[0], playerHp: 15, npcHp: 12 });

    advanceRound();
    expect(result.current).toMatchObject({ round: FIGHT_AGAINST_KOSA.rounds[1], playerHp: 12, npcHp: 12, finished: true });
  });

  it("stops after the last round", () => {
    const { result } = renderHook(() => useFightPlayback(FIGHT_AGAINST_KOSA));

    advanceRound();
    advanceRound();
    advanceRound();

    expect(result.current.round).toEqual(FIGHT_AGAINST_KOSA.rounds[1]);
    expect(vi.getTimerCount()).toBe(0);
  });

  it("jumps to the final state when skipped", () => {
    const { result } = renderHook(() => useFightPlayback(FIGHT_AGAINST_KOSA));

    act(() => result.current.skip());

    expect(result.current).toMatchObject({ round: FIGHT_AGAINST_KOSA.rounds[1], finished: true, playerHp: 12, npcHp: 12 });
    expect(vi.getTimerCount()).toBe(0);
  });
});
