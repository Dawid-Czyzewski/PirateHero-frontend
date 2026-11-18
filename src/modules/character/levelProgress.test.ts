import { describe, expect, it } from "vitest";
import { levelProgressOf } from "@/modules/character/levelProgress";

describe("levelProgressOf", () => {
  it("counts the experience missing to the next level", () => {
    expect(levelProgressOf({ level: 3, experience: { current: 120, required: 300 } })).toEqual({
      level: 3,
      nextLevel: 4,
      current: 120,
      required: 300,
      missing: 180,
    });
  });

  it("needs the whole threshold right after a level up", () => {
    expect(levelProgressOf({ level: 1, experience: { current: 0, required: 100 } }).missing).toBe(100);
  });
});
