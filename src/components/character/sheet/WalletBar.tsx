import { CurrencyIcon } from "@/components/character/icons/CurrencyIcon";
import { formatAmount } from "@/components/character/sheet/formatAmount";
import { currencyLabel, WALLET_GROUP, type Wallet } from "@/modules/character/characterSheet";

export function WalletBar({ wallet }: { wallet: Wallet }) {
  return (
    <section aria-label={WALLET_GROUP.title}>
      <dl className="m-0 flex flex-wrap justify-end gap-1.5 sm:gap-2">
        {WALLET_GROUP.currencies.map((key) => (
          <div
            key={key}
            className="flex min-h-9 items-center gap-1.5 rounded-full border border-gold/40 bg-black/70 py-1 pr-3 pl-1 shadow-[inset_0_1px_0_rgb(255_215_122/0.15)]"
          >
            <CurrencyIcon currency={key} />
            <dt className="sr-only">{currencyLabel(key)}</dt>
            <dd className="m-0 font-cond text-lg leading-none font-bold text-gold-light tabular-nums sm:text-xl">
              {formatAmount(wallet[key])}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
