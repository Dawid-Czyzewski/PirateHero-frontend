import { describe, expect, it } from "vitest";
import {
  FIGHT_POINT_SECONDS_PER_POINT,
  formatCountdown,
  secondsUntil,
  STAMINA_SECONDS_PER_POINT,
  waitHint,
} from "@/modules/character/regenPool";

const pool = (current: number, max: number, nextPointInSeconds: number | null) => ({ current, max, nextPointInSeconds });

describe("regenerating pools", () => {
  it.each([
    [pool(9, 100, 134), 10, 134],
    [pool(7, 100, 60), 10, 60 + 2 * STAMINA_SECONDS_PER_POINT],
    [pool(10, 100, 50), 10, 0],
    [pool(100, 100, null), 10, 0],
  ])("counts seconds until %o reaches %i stamina", (value, required, expected) => {
    expect(secondsUntil(value, required, STAMINA_SECONDS_PER_POINT)).toBe(expected);
  });

  it("uses the regeneration pace of the pool", () => {
    expect(secondsUntil(pool(0, 10, 840), 2, FIGHT_POINT_SECONDS_PER_POINT)).toBe(840 + 900);
  });

  it("formats countdowns as minutes and seconds", () => {
    expect(formatCountdown(134)).toBe("2:14");
    expect(formatCountdown(5)).toBe("0:05");
    expect(formatCountdown(1260)).toBe("21:00");
    expect(formatCountdown(-3)).toBe("0:00");
  });

  it("builds a wait hint only while the pool is short", () => {
    expect(waitHint(pool(0, 10, 840), 1, FIGHT_POINT_SECONDS_PER_POINT, "Następna walka za")).toBe("Następna walka za 14:00");
    expect(waitHint(pool(3, 10, 840), 1, FIGHT_POINT_SECONDS_PER_POINT, "Następna walka za")).toBeNull();
  });
});
