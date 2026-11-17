import { STAT_ICONS } from "@/components/character/icons/statIcons";
import { SheetCard } from "@/components/character/sheet/SheetCard";
import { ValueRow } from "@/components/character/sheet/ValueRow";
import { STATS, type CharacterStats } from "@/modules/character/characterSheet";

export function StatsCard({ stats }: { stats: CharacterStats }) {
  return (
    <SheetCard id="sheet-stats" title="Statystyki">
      <dl className="m-0">
        {STATS.map(({ key, label }) => (
          <ValueRow key={key} icon={STAT_ICONS[key]} label={label} value={String(stats[key])} />
        ))}
      </dl>
    </SheetCard>
  );
}
