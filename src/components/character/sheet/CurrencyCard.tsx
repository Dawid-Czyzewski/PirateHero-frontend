import { CurrencyIcon } from "@/components/character/icons/CurrencyIcon";
import { formatAmount } from "@/components/character/sheet/formatAmount";
import { SheetCard } from "@/components/character/sheet/SheetCard";
import { ValueRow } from "@/components/character/sheet/ValueRow";
import { currencyLabel, type CurrencyGroup, type Wallet } from "@/modules/character/characterSheet";

type CurrencyCardProps = {
  group: CurrencyGroup;
  wallet: Wallet;
};

export function CurrencyCard({ group, wallet }: CurrencyCardProps) {
  return (
    <SheetCard id={`sheet-${group.id}`} title={group.title}>
      <dl className="m-0">
        {group.currencies.map((key) => (
          <ValueRow key={key} icon={<CurrencyIcon currency={key} />} label={currencyLabel(key)} value={formatAmount(wallet[key])} />
        ))}
      </dl>
    </SheetCard>
  );
}
