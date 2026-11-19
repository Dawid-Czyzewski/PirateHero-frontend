import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Stamina } from "@/modules/character/characterSheet";
import { useStaminaCountdown } from "@/modules/character/hooks/useStaminaCountdown";

function renderCountdown(stamina: Stamina, onElapsed = vi.fn()) {
  const view = renderHook(({ value }) => useStaminaCountdown(value, onElapsed), { initialProps: { value: stamina } });
  return { ...view, onElapsed };
}

describe("useStaminaCountdown", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("counts down every second on the client", () => {
    const { result } = renderCountdown({ current: 70, max: 100, nextPointInSeconds: 134 });

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(result.current).toEqual({ current: 70, max: 100, nextPointInSeconds: 131 });
  });

  it("asks for fresh data once the next point is due", () => {
    const { onElapsed } = renderCountdown({ current: 70, max: 100, nextPointInSeconds: 2 });

    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(onElapsed).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(onElapsed).toHaveBeenCalledTimes(1);

    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(onElapsed).toHaveBeenCalledTimes(1);
  });

  it("restarts from the server value when stamina changes", () => {
    const { result, rerender } = renderCountdown({ current: 70, max: 100, nextPointInSeconds: 10 });

    act(() => {
      vi.advanceTimersByTime(4000);
    });
    rerender({ value: { current: 60, max: 100, nextPointInSeconds: 180 } });

    expect(result.current.nextPointInSeconds).toBe(180);
  });

  it("stays idle when stamina is full", () => {
    const { result, onElapsed } = renderCountdown({ current: 100, max: 100, nextPointInSeconds: null });

    act(() => {
      vi.advanceTimersByTime(10_000);
    });

    expect(result.current.nextPointInSeconds).toBeNull();
    expect(onElapsed).not.toHaveBeenCalled();
  });
});
