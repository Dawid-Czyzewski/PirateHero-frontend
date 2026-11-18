import type { Appearance } from "@/modules/character/appearance";

export const LAYER_STACK = ["skin", "tattoo", "beard", "face", "hair"] as const;

export type CharacterLayer = (typeof LAYER_STACK)[number];

const PART_FILE: Record<CharacterLayer, string> = {
  skin: "cialo",
  tattoo: "tatuaz",
  face: "twarz",
  beard: "broda",
  hair: "wlosy",
};

export function layerFileIndex(variant: number): number {
  return variant + 1;
}

export function characterLayerSrc(layer: CharacterLayer, variant: number): string {
  return `/character/${PART_FILE[layer]}-${layerFileIndex(variant)}.webp`;
}

export function appearanceLayerSrc(appearance: Appearance, layer: CharacterLayer): string {
  const variant = layer === "skin" ? appearance.skin : appearance[layer];
  return characterLayerSrc(layer, variant);
}

export const SCENE_BACKGROUND_SRC = "/character/tlo-sceny.webp";
export const CREATOR_HEADER = { src: "/character/naglowek.webp", width: 1200, height: 490 } as const;
export const SHEET_HEADER = { src: "/character/naglowek-postac.webp", width: 1460, height: 313 } as const;

export const CURRENCY_ICON_SRC = {
  onions: "/icons/ikona-cebuliony.png",
  goldTeeth: "/icons/ikona-zlote-zeby.png",
  energy: "/icons/ikona-kondycha.png",
  reach: "/icons/ikona-zasiegi.png",
  medals: "/icons/ikona-medale.png",
} as const;

export const EQUIPMENT_SLOT_SRC = "/icons/slot-ekwipunku.png";

export type CurrencyIconKey = keyof typeof CURRENCY_ICON_SRC;
