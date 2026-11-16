import { describe, expect, it } from "vitest";
import {
  CURRENCY_ICON_SRC,
  LAYER_STACK,
  appearanceLayerSrc,
  characterLayerSrc,
  layerFileIndex,
} from "@/modules/character/layerAssets";
import { DEFAULT_APPEARANCE } from "@/modules/character/appearance";

describe("layerAssets", () => {
  it("maps zero-based indexes to one-based filenames", () => {
    expect(layerFileIndex(0)).toBe(1);
    expect(characterLayerSrc("face", 7)).toBe("/character/twarz-8.webp");
    expect(characterLayerSrc("skin", 4)).toBe("/character/cialo-5.webp");
  });

  it("keeps the Hero Zero stack order", () => {
    expect(LAYER_STACK).toEqual(["skin", "tattoo", "beard", "face", "hair"]);
  });

  it("resolves appearance parts to asset urls", () => {
    expect(appearanceLayerSrc({ ...DEFAULT_APPEARANCE, hair: 3, skin: 2 }, "hair")).toBe("/character/wlosy-4.webp");
    expect(appearanceLayerSrc({ ...DEFAULT_APPEARANCE, hair: 3, skin: 2 }, "skin")).toBe("/character/cialo-3.webp");
  });

  it("exposes currency icon paths for the sheet screen", () => {
    expect(CURRENCY_ICON_SRC.medale).toBe("/icons/ikona-medale.png");
    expect(CURRENCY_ICON_SRC.cebuliony).toBe("/icons/ikona-cebuliony.png");
  });
});
