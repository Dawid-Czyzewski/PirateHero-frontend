import { CURRENCY_ICONS } from "@/components/character/sheet/currencyIcons";
import { formatAmount } from "@/components/character/sheet/formatAmount";
import { SheetPanel } from "@/components/character/sheet/SheetPanel";
import { CURRENCIES, type Wallet } from "@/modules/character/characterSheet";

export function WalletList({ wallet, className }: { wallet: Wallet; className?: string }) {
  return (
    <SheetPanel id="sheet-wallet" title="Waluty" className={className}>
      <dl className="m-0 grid gap-2">
        {CURRENCIES.map(({ key, label }) => (
          <div key={key} className="flex items-center gap-3 border-b border-white/10 pb-1.5 last:border-0">
            {CURRENCY_ICONS[key]}
            <dt className="flex-1 text-lg">{label}</dt>
            <dd className="m-0 font-display text-2xl tracking-wide tabular-nums">{formatAmount(wallet[key])}</dd>
          </div>
        ))}
      </dl>
    </SheetPanel>
  );
}
