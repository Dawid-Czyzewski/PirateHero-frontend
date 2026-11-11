import type { AppearancePart, PartDefinition, Step } from "@/modules/character/appearance";

type AppearanceStepperProps = {
  definition: PartDefinition;
  position: string;
  error?: string;
  onStep: (part: AppearancePart, step: Step) => void;
};

const ARROW =
  "grid h-8 w-10 place-items-center rounded-sm border border-white/55 text-foreground transition-colors hover:border-blood hover:bg-blood/20 active:bg-blood";

export function AppearanceStepper({ definition, position, error, onStep }: AppearanceStepperProps) {
  const { part, label } = definition;
  const labelId = `stepper-${part}`;
  const errorId = `stepper-${part}-error`;

  return (
    <li className="grid grid-cols-[1fr_auto_3rem] items-center gap-4 py-2.5 font-display text-2xl tracking-wide">
      <span id={labelId}>{label}</span>
      <div className="flex gap-1.5" role="group" aria-labelledby={labelId} aria-describedby={error ? errorId : undefined}>
        <button type="button" className={ARROW} aria-label={`${label}: poprzedni wariant`} onClick={() => onStep(part, -1)}>
          <ArrowIcon direction="left" />
        </button>
        <button type="button" className={ARROW} aria-label={`${label}: następny wariant`} onClick={() => onStep(part, 1)}>
          <ArrowIcon direction="right" />
        </button>
      </div>
      <output className="text-right tabular-nums" aria-live="polite" aria-label={`${label}: wariant ${position}`}>
        {position}
      </output>
      {error ? (
        <p className="col-span-full -mt-2 font-sans text-sm tracking-normal text-[#ff6b5e]" id={errorId}>
          {error}
        </p>
      ) : null}
    </li>
  );
}

function ArrowIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg className="size-4" viewBox="0 0 16 16" aria-hidden="true">
      <path
        d={direction === "left" ? "M10 3 5 8l5 5" : "M6 3l5 5-5 5"}
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
