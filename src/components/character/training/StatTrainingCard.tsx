import { GameIcon } from "@/components/game/GameIcon";
import type { StatKey } from "@/modules/character/characterSheet";
import { STAT_ICON_SRC } from "@/modules/character/layerAssets";
import { TRAINING_ACTION_LABEL } from "@/modules/character/training";

type StatTrainingCardProps = {
  stat: StatKey;
  label: string;
  value: number;
  disabled: boolean;
  hint: string | null;
  gainId: number | null;
  onTrain: (stat: StatKey) => void;
};

const BUTTON = [
  "min-h-11 w-full -skew-x-12 bg-blood px-4 py-2 font-display text-xl tracking-wider text-white transition",
  "enabled:hover:brightness-110 enabled:active:translate-y-px",
  "disabled:cursor-not-allowed disabled:bg-white/12 disabled:text-white/50",
].join(" ");

export function StatTrainingCard({ stat, label, value, disabled, hint, gainId, onTrain }: StatTrainingCardProps) {
  const headingId = `training-${stat}`;
  const hintId = `training-hint-${stat}`;

  return (
    <section className="fl-card flex min-w-0 flex-col gap-3 px-3 py-3 desk:px-4" aria-labelledby={headingId}>
      <div className="flex items-center gap-3">
        <GameIcon src={STAT_ICON_SRC[stat]} size={48} />
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
        className={BUTTON}
        disabled={disabled}
        aria-describedby={hint ? hintId : undefined}
        onClick={() => onTrain(stat)}
      >
        <span className="inline-block skew-x-12">{TRAINING_ACTION_LABEL}</span>
      </button>
      {hint ? (
        <p id={hintId} className="m-0 text-center font-cond text-sm font-semibold text-white/70 tabular-nums">
          {hint}
        </p>
      ) : null}
    </section>
  );
}
