import { describe, expect, it } from "vitest";
import {
  APPEARANCE_PARTS,
  DEFAULT_APPEARANCE,
  appearanceEquals,
  isValidVariant,
  randomAppearance,
  describeAppearance,
  steppedPart,
  steppedVariant,
  variantCount,
  withVariant,
  type Appearance,
} from "@/modules/character/appearance";

describe("appearance", () => {
  it("defines 8 variants per part and 5 skin tones", () => {
    expect(APPEARANCE_PARTS.map(({ part }) => [part, variantCount(part)])).toEqual([
      ["face", 8],
      ["hair", 8],
      ["beard", 8],
      ["tattoo", 8],
      ["skin", 5],
    ]);
  });

  it("steps forward and wraps around at the end", () => {
    expect(steppedVariant("face", 0, 1)).toBe(1);
    expect(steppedVariant("face", 7, 1)).toBe(0);
  });

  it("steps backward and wraps around at the start", () => {
    expect(steppedVariant("face", 0, -1)).toBe(7);
    expect(steppedVariant("skin", 0, -1)).toBe(4);
  });

  it("cycles through the parts in tab order", () => {
    expect(steppedPart("face", 1)).toBe("hair");
    expect(steppedPart("face", -1)).toBe("skin");
    expect(steppedPart("skin", 1)).toBe("face");
  });

  it("changes only the chosen part", () => {
    expect(withVariant(DEFAULT_APPEARANCE, "hair", 1)).toEqual({ ...DEFAULT_APPEARANCE, hair: 1 });
  });

  it("ignores variants outside the allowed range", () => {
    expect(isValidVariant("skin", 5)).toBe(false);
    expect(isValidVariant("tattoo", 1.5)).toBe(false);
    expect(withVariant(DEFAULT_APPEARANCE, "skin", 5)).toBe(DEFAULT_APPEARANCE);
    expect(withVariant(DEFAULT_APPEARANCE, "beard", -1)).toBe(DEFAULT_APPEARANCE);
  });

  it("describes the appearance with variant names", () => {
    expect(describeAppearance({ face: 2, hair: 5, beard: 6, skin: 4, tattoo: 7 })).toBe(
      "twarz: Wściekły, włosy: Afro, broda: Bokobrody, tatuaż: Dwa iksy, skóra: Ciemna",
    );
  });

  it("randomizes every part within its range", () => {
    expect(randomAppearance((max) => max - 1)).toEqual({ face: 7, hair: 7, beard: 7, skin: 4, tattoo: 7 });
    expect(randomAppearance(() => 0)).toEqual(DEFAULT_APPEARANCE);
  });

  it("never returns the same set twice when previous is provided", () => {
    const previous: Appearance = { face: 3, hair: 3, beard: 3, skin: 3, tattoo: 3 };
    const stuckOnPrevious = () => 3;
    const next = randomAppearance(stuckOnPrevious, previous);

    expect(appearanceEquals(next, previous)).toBe(false);
    expect(next).toEqual({ ...previous, face: 4 });
  });

  it("keeps rolling until the set differs from previous", () => {
    const previous = DEFAULT_APPEARANCE;
    const sequence = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 4, 0];
    let i = 0;
    const next = randomAppearance((max) => sequence[i++] % max, previous);

    expect(appearanceEquals(next, previous)).toBe(false);
    expect(next).toEqual({ face: 1, hair: 2, beard: 3, tattoo: 4, skin: 0 });
  });
});
