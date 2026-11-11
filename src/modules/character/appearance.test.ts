import { describe, expect, it } from "vitest";
import {
  APPEARANCE_PARTS,
  DEFAULT_APPEARANCE,
  isValidVariant,
  randomAppearance,
  stepVariant,
  variantCount,
  variantPosition,
  withVariant,
} from "@/modules/character/appearance";

describe("appearance", () => {
  it("defines 8 variants per part and 5 skin tones", () => {
    expect(APPEARANCE_PARTS.map(({ part }) => [part, variantCount(part)])).toEqual([
      ["face", 8],
      ["hair", 8],
      ["beard", 8],
      ["skin", 5],
      ["tattoo", 8],
    ]);
  });

  it("steps forward and wraps around at the end", () => {
    const last = withVariant(DEFAULT_APPEARANCE, "face", 7);

    expect(stepVariant(DEFAULT_APPEARANCE, "face", 1).face).toBe(1);
    expect(stepVariant(last, "face", 1).face).toBe(0);
  });

  it("steps backward and wraps around at the start", () => {
    expect(stepVariant(DEFAULT_APPEARANCE, "face", -1).face).toBe(7);
    expect(stepVariant(DEFAULT_APPEARANCE, "skin", -1).skin).toBe(4);
  });

  it("changes only the chosen part", () => {
    expect(stepVariant(DEFAULT_APPEARANCE, "hair", 1)).toEqual({ ...DEFAULT_APPEARANCE, hair: 1 });
  });

  it("ignores variants outside the allowed range", () => {
    expect(isValidVariant("skin", 5)).toBe(false);
    expect(isValidVariant("tattoo", 1.5)).toBe(false);
    expect(withVariant(DEFAULT_APPEARANCE, "skin", 5)).toBe(DEFAULT_APPEARANCE);
    expect(withVariant(DEFAULT_APPEARANCE, "beard", -1)).toBe(DEFAULT_APPEARANCE);
  });

  it("describes the position as one-based counter", () => {
    expect(variantPosition(withVariant(DEFAULT_APPEARANCE, "beard", 2), "beard")).toBe("3/8");
    expect(variantPosition(DEFAULT_APPEARANCE, "skin")).toBe("1/5");
  });

  it("randomizes every part within its range", () => {
    expect(randomAppearance((max) => max - 1)).toEqual({ face: 7, hair: 7, beard: 7, skin: 4, tattoo: 7 });
    expect(randomAppearance(() => 0)).toEqual(DEFAULT_APPEARANCE);
  });
});
