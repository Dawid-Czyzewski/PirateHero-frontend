import { AppearanceStepper } from "@/components/character/AppearanceStepper";
import { APPEARANCE_PARTS, variantPosition } from "@/modules/character/appearance";
import type { AppearanceEditor } from "@/modules/character/hooks/useAppearance";

type AppearancePanelProps = Pick<AppearanceEditor, "appearance" | "step"> & {
  nick: string;
};

export function AppearancePanel({ nick, appearance, step }: AppearancePanelProps) {
  return (
    <section
      className="hidden rounded-md border border-white/20 bg-panel px-6 py-5 lg:block"
      aria-labelledby="appearance-heading"
    >
      <p className="mb-4 rounded border border-white/55 px-3.5 py-2.5 font-display text-2xl tracking-wide">{nick}</p>
      <h2 className="sr-only" id="appearance-heading">
        Wygląd zawodnika
      </h2>
      <ul className="m-0 list-none border-t border-white/20 p-0">
        {APPEARANCE_PARTS.map((definition) => (
          <AppearanceStepper
            key={definition.part}
            definition={definition}
            position={variantPosition(appearance, definition.part)}
            onStep={step}
          />
        ))}
      </ul>
    </section>
  );
}
