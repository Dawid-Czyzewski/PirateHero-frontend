import type { CharacterSheet } from "@/modules/character/characterSheet";

type FighterCardProps = Pick<CharacterSheet, "level" | "maxHp">;

export function FighterCard({ level, maxHp }: FighterCardProps) {
  return (
    <section className="fl-card grid min-w-0 gap-2 px-3 py-2.5 desk:px-4 desk:py-3" aria-label="Poziom i zdrowie">
      <div className="flex items-center justify-between gap-3">
        <p className="m-0 -skew-x-12 bg-blood px-3 py-1 font-cond text-xl font-bold tracking-[.04em] text-white uppercase shadow-[3px_3px_0_#000]">
          <span className="inline-block skew-x-12">Poziom {level}</span>
        </p>
        <p className="m-0 font-cond text-2xl font-bold text-[#f3eadb] uppercase">
          {maxHp} <span className="text-base tracking-[.1em] text-ash">HP</span>
        </p>
      </div>
      <span
        className="block h-3 rounded-sm border border-black bg-[linear-gradient(90deg,var(--color-blood-deep),var(--color-blood))] shadow-[inset_0_1px_0_rgb(255_255_255/0.25)]"
        aria-hidden="true"
      />
    </section>
  );
}
