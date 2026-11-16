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
    <section
      className="grid grid-cols-[minmax(0,1fr)] gap-3 rounded-lg border-2 border-blood/45 bg-panel p-2.5 shadow-[0_0_24px_rgb(225_25_45/0.15)] sm:p-3.5"
      aria-label="Wygląd zawodnika"
    >
      <div className="grid grid-cols-5 gap-1.5" role="tablist" aria-label="Części wyglądu" onKeyDown={moveWithKeys}>
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
            className="min-h-10 -skew-x-12 border-2 border-blood/55 bg-black/40 px-0.5 font-cond text-[clamp(0.95rem,4vw,1.2rem)] font-bold text-[#f3eadb] uppercase italic transition hover:bg-blood/20 aria-selected:border-blood aria-selected:bg-blood aria-selected:text-white data-invalid:not-aria-selected:text-[#ff6b5e]"
            onClick={() => selectPart(part)}
          >
            <span className="inline-block skew-x-12">{label}</span>
          </button>
        ))}
      </div>
      <div id={PANEL_ID} role="tabpanel" aria-labelledby={`tab-${active.part}`} aria-describedby={activeError ? "tiles-error" : undefined}>
        <VariantTiles definition={active} appearance={appearance} onChoose={choose} />
        {activeError ? (
          <p className="mt-2 mb-0 text-sm text-[#ff6b5e]" id="tiles-error">
            {activeError}
          </p>
        ) : null}
      </div>
    </section>
  );
}
