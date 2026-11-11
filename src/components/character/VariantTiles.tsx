import type { CSSProperties } from "react";
import { SKIN_TONES } from "@/components/character/preview/palette";
import type { AppearancePart, PartDefinition } from "@/modules/character/appearance";

type VariantTilesProps = {
  definition: PartDefinition;
  selected: number;
  onChoose: (part: AppearancePart, variant: number) => void;
};

const TILE =
  "aspect-square w-17 flex-none snap-start rounded-md border border-white/55 bg-panel font-display text-[1.6rem] text-foreground aria-checked:border-2 aria-checked:border-blood aria-checked:shadow-[0_0_0_3px_rgb(225_25_45/0.35)]";
const SWATCH =
  "bg-[linear-gradient(var(--swatch),var(--swatch))] bg-[length:60%_18%] bg-[position:center_78%] bg-no-repeat";

function variantsOf(count: number): number[] {
  return Array.from({ length: count }, (_, variant) => variant);
}

function swatchStyle(part: AppearancePart, variant: number): CSSProperties | undefined {
  return part === "skin" ? ({ "--swatch": SKIN_TONES[variant]?.base } as CSSProperties) : undefined;
}

export function VariantTiles({ definition, selected, onChoose }: VariantTilesProps) {
  const { part, label, variants } = definition;

  return (
    <div
      className="-mx-4 flex snap-x snap-mandatory gap-2.5 overflow-x-auto px-4 py-1 [scrollbar-width:none]"
      role="radiogroup"
      aria-label={`${label}: wybierz wariant`}
    >
      {variantsOf(variants).map((variant) => (
        <button
          key={variant}
          type="button"
          role="radio"
          aria-checked={variant === selected}
          aria-label={`${label} ${variant + 1}`}
          className={part === "skin" ? `${TILE} ${SWATCH}` : TILE}
          style={swatchStyle(part, variant)}
          onClick={() => onChoose(part, variant)}
        >
          {variant + 1}
        </button>
      ))}
    </div>
  );
}
