import type { ReactNode } from "react";
import { ProgressBar } from "@/components/character/sheet/ProgressBar";
import type { CharacterSheet } from "@/modules/character/characterSheet";
import { levelProgressOf } from "@/modules/character/levelProgress";

type FighterCardProps = Pick<CharacterSheet, "level" | "experience" | "maxHp"> & {
  aside: ReactNode;
};

const XP_FILL = "bg-[linear-gradient(90deg,var(--color-bronze),var(--color-gold),var(--color-gold-light))]";
const HP_FILL = "bg-[linear-gradient(90deg,var(--color-blood-deep),var(--color-blood))]";

export function FighterCard({ level, experience, maxHp, aside }: FighterCardProps) {
  const progress = levelProgressOf({ level, experience });

  return (
    <section className="fl-card grid min-w-0 gap-2.5 px-3 py-2.5 desk:px-4 desk:py-3" aria-label="Poziom i zdrowie">
      <div className="grid gap-1.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="m-0 -skew-x-12 bg-blood px-3 py-1 font-cond text-xl font-bold tracking-[.04em] text-white uppercase shadow-[3px_3px_0_#000]">
            <span className="inline-block skew-x-12">Poziom {progress.level}</span>
          </p>
          {aside}
        </div>
        <ProgressBar
          label={`Doświadczenie: ${progress.current} z ${progress.required} XP`}
          value={progress.current}
          max={progress.required}
          fillClassName={XP_FILL}
        />
        <div className="flex flex-wrap items-baseline justify-between gap-x-3">
          <p className="m-0 font-semi text-sm font-medium text-[#d8d2c8]">
            Brakuje <b className="text-gold-light">{progress.missing} XP</b> do poziomu {progress.nextLevel}
          </p>
          <p className="m-0 font-cond text-lg font-bold text-gold-light tabular-nums">
            {progress.current} / {progress.required} <span className="text-sm tracking-[.1em] text-gold">XP</span>
          </p>
        </div>
      </div>
      <div className="grid gap-1.5">
        <p className="m-0 flex items-baseline justify-between gap-2 font-cond font-bold tracking-[.06em] uppercase">
          <span className="text-sm text-ash">Zdrowie</span>
          <span className="text-lg text-[#f3eadb] tabular-nums">
            {maxHp} <span className="text-sm tracking-[.1em] text-ash">HP</span>
          </span>
        </p>
        <ProgressBar label={`Zdrowie: ${maxHp} z ${maxHp} HP`} value={maxHp} max={maxHp} fillClassName={HP_FILL} />
      </div>
    </section>
  );
}
