import { GameIcon } from "@/components/game/GameIcon";
import { STATS, type CharacterStats } from "@/modules/character/characterSheet";
import { STAT_ICON_SRC } from "@/modules/character/layerAssets";

export function NpcStats({ stats }: { stats: CharacterStats }) {
  return (
    <dl className="m-0 grid grid-cols-2 gap-x-3 gap-y-1">
      {STATS.map(({ key, label }) => (
        <div key={key} className="flex min-w-0 items-center gap-1.5">
          <GameIcon src={STAT_ICON_SRC[key]} size={24} />
          <dt className="sr-only">{label}</dt>
          <dd className="m-0 font-cond text-lg leading-none font-bold text-gold-light tabular-nums">{stats[key]}</dd>
        </div>
      ))}
    </dl>
  );
}
