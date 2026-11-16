import { STAT_ICONS, type StatIconKey } from "@/components/character/creator/statIcons";
import { STATS } from "@/modules/character/characterSheet";
import { STARTING_MAX_HP, STARTING_STATS } from "@/modules/character/startingStats";

type StatTile = { key: StatIconKey; label: string; value: number };

const TILES: readonly StatTile[] = [
  ...STATS.map(({ key, label }) => ({ key, label, value: STARTING_STATS[key] })),
  { key: "hp", label: "HP", value: STARTING_MAX_HP },
];

export function StartingStats() {
  return (
    <section aria-labelledby="starting-stats">
      <h2 className="m-0 mb-1.5 font-cond text-sm font-bold tracking-[.12em] text-ash uppercase" id="starting-stats">
        Statystyki na start
      </h2>
      <ul className="m-0 grid list-none grid-cols-5 gap-1.5 p-0 sm:gap-2">
        {TILES.map(({ key, label, value }) => (
          <li
            key={key}
            className="grid justify-items-center gap-1 rounded-md border border-white/15 bg-panel px-0.5 py-2 text-center"
          >
            {STAT_ICONS[key]}
            <span className="font-cond text-[0.78rem] leading-tight font-bold tracking-[.02em] uppercase sm:text-sm">
              {label} {value}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
