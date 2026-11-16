import type { KeyboardEvent } from "react";
import { arrowStep, focusNth } from "@/components/character/creator/arrowKeys";
import { VariantTile } from "@/components/character/creator/VariantTile";
import { steppedVariant, withVariant, type Appearance, type AppearancePart, type PartDefinition } from "@/modules/character/appearance";
import { VARIANT_NAMES } from "@/modules/character/variantNames";

type VariantTilesProps = {
  definition: PartDefinition;
  appearance: Appearance;
  onChoose: (part: AppearancePart, variant: number) => void;
};

export function VariantTiles({ definition, appearance, onChoose }: VariantTilesProps) {
  const { part, label } = definition;
  const selected = appearance[part];

  const moveWithKeys = (event: KeyboardEvent<HTMLDivElement>) => {
    const step = arrowStep(event.key);
    if (!step) return;
    event.preventDefault();
    const next = steppedVariant(part, selected, step);
    onChoose(part, next);
    focusNth(event.currentTarget, '[role="radio"]', next);
  };

  return (
    <div
      className="mx-auto grid w-full grid-cols-4 gap-1.5 sm:gap-2.5 desk:max-w-[54dvh]"
      role="radiogroup"
      aria-label={`${label}: wybierz wariant`}
      onKeyDown={moveWithKeys}
    >
      {VARIANT_NAMES[part].map((name, variant) => (
        <VariantTile
          key={name}
          part={part}
          name={name}
          appearance={withVariant(appearance, part, variant)}
          checked={variant === selected}
          onSelect={() => onChoose(part, variant)}
        />
      ))}
    </div>
  );
}
