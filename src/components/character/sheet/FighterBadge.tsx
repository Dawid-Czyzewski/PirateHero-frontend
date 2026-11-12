import type { CharacterSheet } from "@/modules/character/characterSheet";

type FighterBadgeProps = Pick<CharacterSheet, "nick" | "level" | "maxHp">;

export function FighterBadge({ nick, level, maxHp }: FighterBadgeProps) {
  return (
    <section className="grid gap-3 rounded-md border border-white/20 bg-panel px-5 py-4" aria-label="Zawodnik">
      <div className="flex items-center justify-between gap-3">
        <p className="m-0 min-w-0 truncate font-display text-3xl tracking-wide">{nick}</p>
        <p className="m-0 shrink-0 -skew-x-12 bg-blood px-3 py-1 font-display text-lg tracking-wider">
          <span className="inline-block skew-x-12">Poziom {level}</span>
        </p>
      </div>
      <div className="grid gap-1.5">
        <p className="m-0 flex items-baseline justify-between font-display tracking-wider">
          <span className="text-ash uppercase">Zdrowie</span>
          <span className="text-xl">{maxHp} HP</span>
        </p>
        <span
          className="block h-3 rounded-sm border border-white/30 bg-[linear-gradient(90deg,var(--color-blood-deep),var(--color-blood))]"
          aria-hidden="true"
        />
      </div>
    </section>
  );
}
