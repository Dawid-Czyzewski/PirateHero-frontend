import { describe, expect, it } from "vitest";
import { existsSync } from "node:fs";
import path from "node:path";
import { STATS } from "@/modules/character/characterSheet";
import { CURRENCY_ICON_SRC, LAYER_STACK, STAT_ICON_SRC, characterLayerSrc } from "@/modules/character/layerAssets";
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

describe("game icons", () => {
  const publicFile = (src: string) => path.join(process.cwd(), "public", src);

  it("maps every stat and HP to its own PNG", () => {
    expect(Object.keys(STAT_ICON_SRC).sort()).toEqual([...STATS.map(({ key }) => key), "hp"].sort());
    expect(new Set(Object.values(STAT_ICON_SRC)).size).toBe(Object.keys(STAT_ICON_SRC).length);
    expect(STAT_ICON_SRC.strength).toBe("/icons/ikona-sila.png");
  });

  it("points stat and currency icons at files that exist", () => {
    for (const src of [...Object.values(STAT_ICON_SRC), ...Object.values(CURRENCY_ICON_SRC)]) {
      expect(existsSync(publicFile(src)), src).toBe(true);
    }
  });
});
