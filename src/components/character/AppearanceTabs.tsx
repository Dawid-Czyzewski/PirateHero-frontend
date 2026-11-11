import { VariantTiles } from "@/components/character/VariantTiles";
import { APPEARANCE_PARTS } from "@/modules/character/appearance";
import type { AppearanceErrors } from "@/modules/character/createCharacter";
import type { AppearanceEditor } from "@/modules/character/hooks/useAppearance";

type AppearanceTabsProps = Pick<AppearanceEditor, "appearance" | "activePart" | "selectPart" | "choose"> & {
  errors: AppearanceErrors;
};

const PANEL_ID = "appearance-tiles";

export function AppearanceTabs({ appearance, activePart, selectPart, choose, errors }: AppearanceTabsProps) {
  const active = APPEARANCE_PARTS.find(({ part }) => part === activePart) ?? APPEARANCE_PARTS[0];
  const activeError = errors[active.part];

  return (
    <section className="grid grid-cols-[minmax(0,1fr)] gap-3.5 lg:hidden" aria-label="Wygląd zawodnika">
      <div
        className="grid grid-cols-5 divide-x divide-white/20 overflow-hidden rounded border border-white/20 bg-panel"
        role="tablist"
      >
        {APPEARANCE_PARTS.map(({ part, label }) => (
          <button
            key={part}
            type="button"
            role="tab"
            id={`tab-${part}`}
            aria-selected={part === activePart}
            aria-controls={PANEL_ID}
            data-invalid={errors[part] ? true : undefined}
            className="min-h-11 px-1 font-display text-[clamp(0.95rem,4vw,1.2rem)] tracking-wide aria-selected:bg-blood data-invalid:not-aria-selected:text-[#ff6b5e]"
            onClick={() => selectPart(part)}
          >
            {label}
          </button>
        ))}
      </div>
      <div id={PANEL_ID} role="tabpanel" aria-labelledby={`tab-${active.part}`}>
        <VariantTiles definition={active} selected={appearance[active.part]} onChoose={choose} />
        {activeError ? <p className="mt-2 text-sm text-[#ff6b5e]">{activeError}</p> : null}
      </div>
    </section>
  );
}
