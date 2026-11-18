import { ProgressBar } from "@/components/game/ProgressBar";

const HP_FILL = "bg-[linear-gradient(90deg,var(--color-blood-deep),var(--color-blood))]";

export function HealthCard({ maxHp }: { maxHp: number }) {
  return (
    <section className="fl-card grid min-w-0 gap-1.5 px-3 py-2.5 desk:px-4 desk:py-3" aria-label="Zdrowie">
      <p className="m-0 flex items-baseline justify-between gap-2 font-cond font-bold tracking-[.06em] uppercase">
        <span className="text-sm text-gold">Zdrowie</span>
        <span className="text-lg text-[#f3eadb] tabular-nums">
          {maxHp} <span className="text-sm tracking-[.1em] text-ash">HP</span>
        </span>
      </p>
      <ProgressBar label={`Zdrowie: ${maxHp} z ${maxHp} HP`} value={maxHp} max={maxHp} fillClassName={HP_FILL} />
    </section>
  );
}
