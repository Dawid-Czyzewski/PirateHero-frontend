import { layerArtOf, OVER_OUTFIT, skinToneOf, UNDER_OUTFIT, type ArtPart } from "@/components/character/preview/layerRegistry";
import { BodyLayer } from "@/components/character/preview/layers/BodyLayer";
import { OutfitLayer } from "@/components/character/preview/layers/OutfitLayer";
import type { SkinTone } from "@/components/character/preview/palette";
import type { Appearance } from "@/modules/character/appearance";

export const FULL_BODY_VIEW = "0 0 200 310";

type CharacterFigureProps = {
  appearance: Appearance;
  viewBox?: string;
  label?: string;
  animated?: boolean;
  className?: string;
};

const POP = "origin-center animate-layer-pop [transform-box:fill-box] motion-reduce:animate-none";

type PartLayersProps = { parts: readonly ArtPart[]; appearance: Appearance; tone: SkinTone; animated: boolean };

function PartLayers({ parts, appearance, tone, animated }: PartLayersProps) {
  return parts.map((part) => (
    <g
      key={animated ? `${part}-${appearance[part]}` : part}
      data-layer={part}
      data-variant={appearance[part]}
      className={animated ? POP : undefined}
    >
      {layerArtOf(appearance, part)({ tone })}
    </g>
  ));
}

export function CharacterFigure({ appearance, viewBox = FULL_BODY_VIEW, label, animated = false, className }: CharacterFigureProps) {
  const tone = skinToneOf(appearance);
  const a11y = label ? { role: "img", "aria-label": label } : { "aria-hidden": true };

  return (
    <svg className={className} viewBox={viewBox} {...a11y}>
      <g
        key={animated ? `skin-${appearance.skin}` : "skin"}
        data-layer="skin"
        data-variant={appearance.skin}
        className={animated ? POP : undefined}
      >
        <BodyLayer tone={tone} />
      </g>
      <PartLayers parts={UNDER_OUTFIT} appearance={appearance} tone={tone} animated={animated} />
      <OutfitLayer />
      <PartLayers parts={OVER_OUTFIT} appearance={appearance} tone={tone} animated={animated} />
    </svg>
  );
}
