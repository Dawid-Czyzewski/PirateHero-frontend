import type { KeyboardEvent } from "react";
import { arrowStep, focusNth } from "@/components/character/creator/arrowKeys";
import { VariantTiles } from "@/components/character/creator/VariantTiles";
import { APPEARANCE_PARTS, partIndex, steppedPart } from "@/modules/character/appearance";
import type { AppearanceErrors } from "@/modules/character/createCharacter";
import type { AppearanceEditor } from "@/modules/character/hooks/useAppearance";

type AppearancePickerProps = Pick<AppearanceEditor, "appearance" | "activePart" | "selectPart" | "choose"> & {
  errors: AppearanceErrors;
};

const PANEL_ID = "appearance-tiles";

const TAB = [
  "relative min-h-11 min-w-0 flex-[1_0_4.3rem] snap-start border-[9px] border-solid px-0 font-cond text-[clamp(0.85rem,3.4vw,1.05rem)] leading-none font-bold tracking-[.03em] uppercase",
  "text-[#f4efe8] [text-shadow:0_2px_0_rgb(0_0_0/0.6)] [border-image:url(/assets/fl/frames/nav@2x.png)_40_fill_/_9px_stretch]",
  "transition-[filter] duration-150 hover:brightness-125",
  "aria-selected:text-[#1d1206] aria-selected:[text-shadow:0_1px_0_rgb(255_230_160/0.35)] aria-selected:[border-image:url(/assets/fl/frames/btn-gold@2x.png)_40_fill_/_9px_stretch]",
  "data-invalid:not-aria-selected:text-[#ff6b5e] desk:min-h-12 desk:text-[clamp(0.9rem,1.15vw,1.15rem)]",
].join(" ");

export function AppearancePicker({ appearance, activePart, selectPart, choose, errors }: AppearancePickerProps) {
  const active = APPEARANCE_PARTS.find(({ part }) => part === activePart) ?? APPEARANCE_PARTS[0];
  const activeError = errors[active.part];

  const moveWithKeys = (event: KeyboardEvent<HTMLDivElement>) => {
    const step = arrowStep(event.key);
    if (!step) return;
    event.preventDefault();
    const next = steppedPart(activePart, step);
    selectPart(next);
    focusNth(event.currentTarget, '[role="tab"]', partIndex(next));
  };

  return (
    <section className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-3" aria-label="Wygląd zawodnika">
      <div className="-mx-1 flex snap-x gap-1 overflow-x-auto px-1 pb-0.5 [scrollbar-width:none] sm:gap-1.5 [&::-webkit-scrollbar]:hidden" role="tablist" aria-label="Części wyglądu" onKeyDown={moveWithKeys}>
        {APPEARANCE_PARTS.map(({ part, label }) => (
          <button
            key={part}
            type="button"
            role="tab"
            id={`tab-${part}`}
            aria-selected={part === activePart}
            tabIndex={part === activePart ? 0 : -1}
            aria-controls={PANEL_ID}
            data-invalid={errors[part] ? true : undefined}
            className={TAB}
            onClick={() => selectPart(part)}
          >
            {label}
          </button>
        ))}
      </div>
      <div id={PANEL_ID} role="tabpanel" aria-labelledby={`tab-${active.part}`} aria-describedby={activeError ? "tiles-error" : undefined}>
        <VariantTiles definition={active} appearance={appearance} onChoose={choose} />
        {activeError ? (
          <p className="mt-2 mb-0 font-semi text-sm text-[#ff6b5e]" id="tiles-error">
            {activeError}
          </p>
        ) : null}
      </div>
    </section>
  );
}
