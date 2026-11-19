import { CurrencyIcon } from "@/components/character/icons/CurrencyIcon";
import { ProgressBar } from "@/components/game/ProgressBar";
import { STAMINA_LABEL, type Stamina } from "@/modules/character/characterSheet";
import { formatCountdown } from "@/modules/character/training";

const STAMINA_FILL = "bg-[linear-gradient(90deg,#b8860b,var(--color-gold))]";

function regenerationText(nextPointInSeconds: number | null): string {
  return nextPointInSeconds === null ? "Kondycha pełna" : `Następny punkt za ${formatCountdown(nextPointInSeconds)}`;
}

export function StaminaPanel({ stamina }: { stamina: Stamina }) {
  return (
    <section className="fl-card flex min-w-0 items-center gap-3 px-3 py-3 desk:px-5" aria-label={STAMINA_LABEL}>
      <CurrencyIcon currency="energy" />
      <div className="grid min-w-0 flex-1 gap-1.5">
        <p className="m-0 flex items-baseline justify-between gap-2 font-cond font-bold tracking-[.06em] uppercase">
          <span className="text-sm text-gold">{STAMINA_LABEL}</span>
          <span className="text-sm text-[#f3eadb] tabular-nums" role="timer">
            {regenerationText(stamina.nextPointInSeconds)}
          </span>
        </p>
        <ProgressBar
          label={`${STAMINA_LABEL}: ${stamina.current} z ${stamina.max}`}
          value={stamina.current}
          max={stamina.max}
          fillClassName={STAMINA_FILL}
          caption={`${stamina.current}/${stamina.max}`}
          className="h-5"
        />
      </div>
    </section>
  );
}
