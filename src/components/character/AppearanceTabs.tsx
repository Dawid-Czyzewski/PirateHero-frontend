import { VariantTiles } from "@/components/character/VariantTiles";
import { APPEARANCE_PARTS } from "@/modules/character/appearance";
import type { AppearanceEditor } from "@/modules/character/hooks/useAppearance";

type AppearanceTabsProps = Pick<AppearanceEditor, "appearance" | "activePart" | "selectPart" | "choose">;

const PANEL_ID = "appearance-tiles";

export function AppearanceTabs({ appearance, activePart, selectPart, choose }: AppearanceTabsProps) {
  const active = APPEARANCE_PARTS.find(({ part }) => part === activePart) ?? APPEARANCE_PARTS[0];

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
            className="min-h-11 px-1 font-display text-[clamp(0.95rem,4vw,1.2rem)] tracking-wide aria-selected:bg-blood"
            onClick={() => selectPart(part)}
          >
            {label}
          </button>
        ))}
      </div>
      <div id={PANEL_ID} role="tabpanel" aria-labelledby={`tab-${active.part}`}>
        <VariantTiles definition={active} selected={appearance[active.part]} onChoose={choose} />
      </div>
    </section>
  );
}
