import { describe, expect, it } from "vitest";
import { LAYER_STACK, characterLayerSrc } from "@/modules/character/layerAssets";
import { variantCount } from "@/modules/character/appearance";

describe("character image layers", () => {
  it("uses the fixed stack order for creator and profile", () => {
    expect(LAYER_STACK).toEqual(["skin", "tattoo", "beard", "face", "hair"]);
  });

  it("covers every appearance variant with a file mapping", () => {
    expect(characterLayerSrc("skin", variantCount("skin") - 1)).toBe("/character/cialo-5.webp");
    expect(characterLayerSrc("face", variantCount("face") - 1)).toBe("/character/twarz-8.webp");
    expect(characterLayerSrc("hair", 0)).toBe("/character/wlosy-1.webp");
  });
});
