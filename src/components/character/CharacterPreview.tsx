import { layerArtOf, OVER_OUTFIT, skinToneOf, UNDER_OUTFIT, type ArtPart } from "@/components/character/preview/layerRegistry";
import { BodyLayer } from "@/components/character/preview/layers/BodyLayer";
import { OutfitLayer } from "@/components/character/preview/layers/OutfitLayer";
import type { SkinTone } from "@/components/character/preview/palette";
import { APPEARANCE_PARTS, variantPosition, type Appearance } from "@/modules/character/appearance";

function describe(appearance: Appearance): string {
  const parts = APPEARANCE_PARTS.map(({ part, label }) => `${label.toLowerCase()} ${variantPosition(appearance, part)}`);
  return `Podgląd zawodnika: ${parts.join(", ")}`;
}

function PartLayers({ parts, appearance, tone }: { parts: readonly ArtPart[]; appearance: Appearance; tone: SkinTone }) {
  return parts.map((part) => (
    <g key={part} data-layer={part} data-variant={appearance[part]}>
      {layerArtOf(appearance, part)({ tone })}
    </g>
  ));
}

export function CharacterPreview({ appearance }: { appearance: Appearance }) {
  const tone = skinToneOf(appearance);

  return (
    <figure className="relative m-0 grid justify-items-center pb-6">
      <svg
        className="relative z-10 h-auto w-[min(64vw,16rem)] drop-shadow-[0_0_18px_rgb(225_25_45/0.45)] lg:w-72"
        viewBox="0 0 200 310"
        role="img"
        aria-label={describe(appearance)}
      >
        <g data-layer="skin" data-variant={appearance.skin}>
          <BodyLayer tone={tone} />
        </g>
        <PartLayers parts={UNDER_OUTFIT} appearance={appearance} tone={tone} />
        <OutfitLayer />
        <PartLayers parts={OVER_OUTFIT} appearance={appearance} tone={tone} />
      </svg>
      <span
        className="clip-octagon absolute bottom-4 aspect-[4/1] w-[min(80vw,22rem)] bg-blood-deep bg-[radial-gradient(closest-side,rgb(225_25_45/0.75),rgb(225_25_45/0.12)_80%)] lg:w-96"
        aria-hidden="true"
      />
    </figure>
  );
}
