import { SheetCard } from "@/components/character/sheet/SheetCard";
import { ValueRow } from "@/components/character/sheet/ValueRow";
import { GameIcon } from "@/components/game/GameIcon";
import { STATS, type CharacterStats } from "@/modules/character/characterSheet";
import { STAT_ICON_SRC } from "@/modules/character/layerAssets";

export function StatsCard({ stats }: { stats: CharacterStats }) {
  return (
    <SheetCard id="sheet-stats" title="Statystyki">
      <dl className="m-0">
        {STATS.map(({ key, label }) => (
          <ValueRow key={key} icon={<GameIcon src={STAT_ICON_SRC[key]} size={36} />} label={label} value={String(stats[key])} />
        ))}
      </dl>
    </SheetCard>
  );
}
