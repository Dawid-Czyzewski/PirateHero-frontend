import type { LayerArt } from "@/components/character/preview/layerArt";
import { BEARD_VARIANTS } from "@/components/character/preview/layers/BeardLayer";
import { FACE_VARIANTS } from "@/components/character/preview/layers/FaceLayer";
import { HAIR_VARIANTS } from "@/components/character/preview/layers/HairLayer";
import { TATTOO_VARIANTS } from "@/components/character/preview/layers/TattooLayer";
import { SKIN_TONES, type SkinTone } from "@/components/character/preview/palette";
import type { Appearance, AppearancePart } from "@/modules/character/appearance";

export type ArtPart = Exclude<AppearancePart, "skin">;

export const LAYER_VARIANTS: Record<ArtPart, readonly LayerArt[]> = {
  tattoo: TATTOO_VARIANTS,
  face: FACE_VARIANTS,
  beard: BEARD_VARIANTS,
  hair: HAIR_VARIANTS,
};

export const UNDER_OUTFIT: readonly ArtPart[] = ["tattoo"];

export const OVER_OUTFIT: readonly ArtPart[] = ["face", "beard", "hair"];

export function skinToneOf(appearance: Appearance): SkinTone {
  return SKIN_TONES[appearance.skin] ?? SKIN_TONES[0];
}

export function layerArtOf(appearance: Appearance, part: ArtPart): LayerArt {
  return LAYER_VARIANTS[part][appearance[part]] ?? LAYER_VARIANTS[part][0];
}
