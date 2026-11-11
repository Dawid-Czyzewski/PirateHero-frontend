import { describe, expect, it } from "vitest";
import { LAYER_VARIANTS, layerArtOf, OVER_OUTFIT, skinToneOf, UNDER_OUTFIT, type ArtPart } from "@/components/character/preview/layerRegistry";
import { SKIN_TONES } from "@/components/character/preview/palette";
import { DEFAULT_APPEARANCE, variantCount, withVariant } from "@/modules/character/appearance";

const ART_PARTS = Object.keys(LAYER_VARIANTS) as ArtPart[];

describe("layer registry", () => {
  it.each(ART_PARTS)("has one art per %s variant", (part) => {
    expect(LAYER_VARIANTS[part]).toHaveLength(variantCount(part));
  });

  it("has one tone per skin variant", () => {
    expect(SKIN_TONES).toHaveLength(variantCount("skin"));
  });

  it("draws every art part exactly once", () => {
    expect([...UNDER_OUTFIT, ...OVER_OUTFIT].sort()).toEqual([...ART_PARTS].sort());
  });

  it("resolves the selected art and tone", () => {
    const appearance = withVariant(withVariant(DEFAULT_APPEARANCE, "hair", 3), "skin", 4);

    expect(layerArtOf(appearance, "hair")).toBe(LAYER_VARIANTS.hair[3]);
    expect(skinToneOf(appearance)).toBe(SKIN_TONES[4]);
  });
});
