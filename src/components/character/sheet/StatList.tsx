import { SheetPanel } from "@/components/character/sheet/SheetPanel";
import { STATS, type CharacterStats } from "@/modules/character/characterSheet";

export function StatList({ stats, className }: { stats: CharacterStats; className?: string }) {
  return (
    <SheetPanel id="sheet-stats" title="Statystyki" className={className}>
      <dl className="m-0 grid gap-2">
        {STATS.map(({ key, label }) => (
          <div key={key} className="flex items-baseline justify-between border-b border-white/10 pb-1.5 last:border-0">
            <dt className="text-lg">{label}</dt>
            <dd className="m-0 font-display text-2xl tracking-wide">{stats[key]}</dd>
          </div>
        ))}
      </dl>
    </SheetPanel>
  );
}
