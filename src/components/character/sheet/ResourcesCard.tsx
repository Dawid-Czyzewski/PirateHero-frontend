import { formatAmount } from "@/components/character/sheet/formatAmount";
import { SheetCard } from "@/components/character/sheet/SheetCard";
import { ValueRow } from "@/components/character/sheet/ValueRow";
import { GameIcon } from "@/components/game/GameIcon";
import {
  currencyLabel,
  FIGHT_POINTS_LABEL,
  RESOURCES_GROUP,
  STAMINA_LABEL,
  type Wallet,
} from "@/modules/character/characterSheet";
import { CURRENCY_ICON_SRC } from "@/modules/character/layerAssets";
import type { RegenPool } from "@/modules/character/regenPool";
import { FIGHT_ICON_SRC } from "@/modules/combat/combatAssets";

type ResourcesCardProps = {
  stamina: RegenPool;
  fightPoints: RegenPool;
  wallet: Wallet;
};

function poolValue(pool: RegenPool): string {
  return `${pool.current}/${pool.max}`;
}

export function ResourcesCard({ stamina, fightPoints, wallet }: ResourcesCardProps) {
  return (
    <SheetCard id={`sheet-${RESOURCES_GROUP.id}`} title={RESOURCES_GROUP.title}>
      <dl className="m-0">
        <ValueRow icon={<GameIcon src={CURRENCY_ICON_SRC.energy} size={36} />} label={STAMINA_LABEL} value={poolValue(stamina)} />
        <ValueRow icon={<GameIcon src={FIGHT_ICON_SRC.hit} size={36} />} label={FIGHT_POINTS_LABEL} value={poolValue(fightPoints)} />
        {RESOURCES_GROUP.currencies.map((key) => (
          <ValueRow key={key} icon={<GameIcon src={CURRENCY_ICON_SRC[key]} size={36} />} label={currencyLabel(key)} value={formatAmount(wallet[key])} />
        ))}
      </dl>
    </SheetCard>
  );
}
