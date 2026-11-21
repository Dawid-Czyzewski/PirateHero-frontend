import { formatAmount } from "@/components/character/sheet/formatAmount";
import { SheetCard } from "@/components/character/sheet/SheetCard";
import { ValueRow } from "@/components/character/sheet/ValueRow";
import { GameIcon } from "@/components/game/GameIcon";
import {
  currencyLabel,
  RESOURCES_GROUP,
  STAMINA_LABEL,
  type Stamina,
  type Wallet,
} from "@/modules/character/characterSheet";
import { CURRENCY_ICON_SRC } from "@/modules/character/layerAssets";

type ResourcesCardProps = {
  stamina: Stamina;
  wallet: Wallet;
};

export function ResourcesCard({ stamina, wallet }: ResourcesCardProps) {
  return (
    <SheetCard id={`sheet-${RESOURCES_GROUP.id}`} title={RESOURCES_GROUP.title}>
      <dl className="m-0">
        <ValueRow icon={<GameIcon src={CURRENCY_ICON_SRC.energy} size={36} />} label={STAMINA_LABEL} value={`${stamina.current}/${stamina.max}`} />
        {RESOURCES_GROUP.currencies.map((key) => (
          <ValueRow key={key} icon={<GameIcon src={CURRENCY_ICON_SRC[key]} size={36} />} label={currencyLabel(key)} value={formatAmount(wallet[key])} />
        ))}
      </dl>
    </SheetCard>
  );
}
