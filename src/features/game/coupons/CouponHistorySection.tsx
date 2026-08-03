import { useTranslation } from 'react-i18next';
import { Ticket } from 'lucide-react';
import type { CouponHistoryEntryDto } from '@/types/coupon';
import { CouponHistoryList } from './CouponHistoryList';
import { CouponHistorySkeleton } from './CouponHistorySkeleton';

export type CouponHistorySectionProps = {
  history: CouponHistoryEntryDto[];
  loading: boolean;
};

export function CouponHistorySection({ history, loading }: CouponHistorySectionProps) {
  const { t } = useTranslation();

  return (
    <section className="space-y-3" aria-labelledby="coupon-history-heading">
      <h2 id="coupon-history-heading" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {t('couponHistory')}
      </h2>
      <div className="rounded-xl border border-border bg-card/60 p-1 shadow-sm">
        {loading ? (
          <CouponHistorySkeleton rows={5} />
        ) : history.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-12 text-center text-muted-foreground">
            <Ticket className="h-10 w-10 opacity-30" aria-hidden />
            <p>{t('noCouponsUsed')}</p>
          </div>
        ) : (
          <div className="p-2">
            <CouponHistoryList entries={history} />
          </div>
        )}
      </div>
    </section>
  );
}

export default CouponHistorySection;
