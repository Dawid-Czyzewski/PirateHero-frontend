import { describe, expect, it } from "vitest";
import { APPEARANCE_PARTS } from "@/modules/character/appearance";
import { VARIANT_NAMES, variantName } from "@/modules/character/variantNames";

describe("variant names", () => {
  it("names every variant with a unique name", () => {
    for (const { part, variants } of APPEARANCE_PARTS) {
      expect(new Set(VARIANT_NAMES[part]).size).toBe(variants);
    }
  });

  it("maps indexes sent to the API to names", () => {
    expect(variantName("hair", 2)).toBe("Irokez");
    expect(variantName("beard", 0)).toBe("Gładko");
    expect(variantName("skin", 4)).toBe("Ciemna");
  });

  it("rejects indexes outside the range", () => {
    expect(() => variantName("skin", 5)).toThrow(RangeError);
  });
});
