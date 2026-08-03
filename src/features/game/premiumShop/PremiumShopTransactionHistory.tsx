import { useTranslation } from 'react-i18next';
import { Gem, Receipt } from 'lucide-react';
import type { PremiumShopTransactionDto } from '@/types/premiumShop';

type Props = {
  transactions: PremiumShopTransactionDto[];
  loading?: boolean;
};

function localeFromI18n(lng: string): string {
  if (lng.startsWith('pl')) {
    return 'pl-PL';
  }
  return 'en-US';
}

export function PremiumShopTransactionHistory({ transactions, loading = false }: Props) {
  const { t, i18n } = useTranslation();
  const loc = localeFromI18n(i18n.language);

  return (
    <section className="space-y-3" aria-labelledby="premium-shop-history-heading">
      <h2
        id="premium-shop-history-heading"
        className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
      >
        {t('premiumShopPage.historyTitle')}
      </h2>
      <div className="rounded-xl border border-border bg-card/60 p-1 shadow-sm">
        {loading ? (
          <div className="py-12 text-center text-sm text-muted-foreground">
            {t('premiumShopPage.historyLoading')}
          </div>
        ) : transactions.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-12 text-center text-muted-foreground">
            <Receipt className="h-10 w-10 opacity-30" aria-hidden />
            <p>{t('premiumShopPage.noTransactions')}</p>
          </div>
        ) : (
          <ul className="space-y-2 p-2" aria-label={t('premiumShopPage.historyTitle')}>
            {transactions.map((entry) => (
              <li key={String(entry.id)}>
                <div className="flex items-center gap-4 rounded-lg border border-border bg-card/80 p-4 transition-colors hover:bg-card">
                  <Gem className="h-5 w-5 shrink-0 text-blue-400" aria-hidden />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-semibold text-foreground">
                        {t(`premiumShopPage.packs.${entry.packId}.name`, { defaultValue: entry.packId })}
                      </span>
                      <span className="rounded-full bg-blue-500/15 px-2 py-0.5 text-xs font-medium text-blue-200">
                        {t('premiumShopPage.transactionDiamonds', { count: entry.diamonds })}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      <time dateTime={entry.purchasedAt}>
                        {new Date(entry.purchasedAt).toLocaleString(loc)}
                      </time>
                      {' · '}
                      {t('premiumShopPage.buyFor', { price: entry.pricePln.toFixed(2) })}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
