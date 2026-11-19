import { STAT_ICONS } from "@/components/character/icons/statIcons";
import type { StatKey } from "@/modules/character/characterSheet";
import { TRAINING_ACTION_LABEL } from "@/modules/character/training";

type StatTrainingCardProps = {
  stat: StatKey;
  label: string;
  value: number;
  pending: boolean;
  disabled: boolean;
  hint: string | null;
  gainId: number | null;
  onTrain: (stat: StatKey) => void;
};

const BUTTON = "min-h-11 w-full -skew-x-12 px-4 py-2 font-display text-xl tracking-wider transition";

const READY = [
  "bg-blood text-white enabled:hover:brightness-110 enabled:active:translate-y-px",
  "disabled:cursor-not-allowed disabled:bg-white/12 disabled:text-white/50",
].join(" ");

const PENDING = "cursor-wait bg-blood/70 text-white";

export function StatTrainingCard({ stat, label, value, pending, disabled, hint, gainId, onTrain }: StatTrainingCardProps) {
  const headingId = `training-${stat}`;
  const hintId = `training-hint-${stat}`;

  return (
    <section className="fl-card flex min-w-0 flex-col gap-3 px-3 py-3 desk:px-4" aria-labelledby={headingId}>
      <div className="flex items-center gap-3">
        <span
          className="grid size-12 shrink-0 place-items-center rounded-full border border-gold/40 bg-black/55 [&>svg]:size-7"
          aria-hidden="true"
        >
          {STAT_ICONS[stat]}
        </span>
        <h2 id={headingId} className="m-0 min-w-0 flex-1 font-cond text-lg font-bold tracking-[.12em] text-gold uppercase">
          {label}
        </h2>
        <p className="relative m-0 font-display text-4xl leading-none text-white tabular-nums">
          <span className="sr-only">Wartość: </span>
          {value}
          {gainId === null ? null : (
            <span
              key={gainId}
              className="pointer-events-none absolute right-0 bottom-full animate-gain font-cond text-xl font-bold text-gold [text-shadow:0_1px_2px_#000] motion-reduce:hidden"
              aria-hidden="true"
            >
              +1
            </span>
          )}
        </p>
      </div>
      <button
        type="button"
        className={`${BUTTON} ${pending ? PENDING : READY}`}
        disabled={disabled}
        aria-busy={pending}
        aria-describedby={hint ? hintId : undefined}
        onClick={() => onTrain(stat)}
      >
        <span className="inline-block skew-x-12">{pending ? "Trenuję…" : TRAINING_ACTION_LABEL}</span>
      </button>
      {hint ? (
        <p id={hintId} className="m-0 text-center font-cond text-sm font-semibold text-white/70 tabular-nums">
          {hint}
        </p>
      ) : null}
    </section>
  );
}
