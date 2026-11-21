import { GameIcon } from "@/components/game/GameIcon";
import { ProgressBar } from "@/components/game/ProgressBar";
import { STAT_ICON_SRC } from "@/modules/character/layerAssets";

const HP_FILL = "bg-[linear-gradient(90deg,var(--color-blood-deep),var(--color-blood))]";

export function HealthCard({ maxHp }: { maxHp: number }) {
  return (
    <section className="fl-card flex min-w-0 items-center gap-3 px-3 py-2.5 desk:px-4 desk:py-3" aria-label="Zdrowie">
      <GameIcon src={STAT_ICON_SRC.hp} size={36} />
      <div className="grid min-w-0 flex-1 gap-1.5">
        <p className="m-0 flex items-baseline justify-between gap-2 font-cond font-bold tracking-[.06em] uppercase">
          <span className="text-sm text-gold">Zdrowie</span>
          <span className="text-lg text-[#f3eadb] tabular-nums">
            {maxHp} <span className="text-sm tracking-[.1em] text-ash">HP</span>
          </span>
        </p>
        <ProgressBar label={`Zdrowie: ${maxHp} z ${maxHp} HP`} value={maxHp} max={maxHp} fillClassName={HP_FILL} />
      </div>
    </section>
  );
}
