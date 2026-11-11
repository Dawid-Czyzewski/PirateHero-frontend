import type { ReactNode } from "react";
import type { SkinTone } from "@/components/character/preview/palette";

export type LayerArtProps = { tone: SkinTone };

export type LayerArt = (props: LayerArtProps) => ReactNode;

export const EMPTY_LAYER: LayerArt = () => null;
