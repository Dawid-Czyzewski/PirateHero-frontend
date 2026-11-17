import { SectionHeading } from "@/components/character/SectionHeading";
import { STAT_ICONS, type StatIconKey } from "@/components/character/icons/statIcons";
import { STATS } from "@/modules/character/characterSheet";
import { STARTING_MAX_HP, STARTING_STATS } from "@/modules/character/startingStats";

type StatTile = { key: StatIconKey; label: string; value: number };

const TILES: readonly StatTile[] = [
  ...STATS.map(({ key, label }) => ({ key, label, value: STARTING_STATS[key] })),
  { key: "hp", label: "HP", value: STARTING_MAX_HP },
];

export function StartingStats() {
  return (
    <section aria-labelledby="starting-stats" className="min-w-0">
      <SectionHeading id="starting-stats">Statystyki na start</SectionHeading>
      <ul className="m-0 grid list-none grid-cols-3 gap-1.5 p-0 min-[30rem]:grid-cols-5 sm:gap-2">
        {TILES.map(({ key, label, value }) => (
          <li
            key={key}
            className="flex min-w-0 items-center justify-center gap-1.5 rounded-[4px] border border-[#3a2a1a] bg-[linear-gradient(#1b1210,#0d0808)] px-1 py-1.5 text-center min-[30rem]:flex-col min-[30rem]:gap-0.5 shadow-[inset_0_1px_0_rgba(255,215,122,.12)]"
          >
            {STAT_ICONS[key]}
            <span className="min-w-0 font-cond text-[clamp(0.72rem,3.1vw,0.85rem)] leading-tight [overflow-wrap:anywhere] min-[30rem]:text-[clamp(0.62rem,1.9vw,0.85rem)] desk:text-[clamp(0.7rem,0.9vw,0.85rem)] font-bold tracking-[.02em] text-[#f3eadb] uppercase">
              {label} <b className="text-gold-light">{value}</b>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
