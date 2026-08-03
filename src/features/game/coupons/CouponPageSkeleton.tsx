import { useTranslation } from 'react-i18next';
import { CouponHistorySkeleton } from './CouponHistorySkeleton';

export function CouponPageSkeleton() {
  const { t } = useTranslation();

  return (
    <section
      className="w-full"
      aria-busy="true"
      aria-live="polite"
      aria-label={t('couponPage.skeletonAria')}
    >
      <div className="animate-pulse space-y-6">
      <header className="min-w-0 space-y-3">
        <div className="h-9 w-48 rounded-md bg-muted/45 sm:h-11 sm:w-64 md:h-12 md:w-72" />
        <div className="h-4 w-full max-w-xl rounded bg-muted/35" />
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:items-start">
        <div className="space-y-4">
          <div className="rounded-xl border border-border/50 bg-card/40 p-6 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-stretch">
              <div className="h-11 min-h-11 flex-1 rounded-lg bg-muted/50" />
              <div className="h-11 min-h-11 w-full shrink-0 rounded-lg bg-muted/45 sm:w-[140px]" />
            </div>
          </div>
          <div className="h-14 rounded-lg border border-border/30 bg-muted/25" />
        </div>

        <div className="space-y-3">
          <div className="h-4 w-40 rounded bg-muted/40" />
          <div className="rounded-xl border border-border/50 bg-card/40 p-1 shadow-sm [&_ul]:animate-none">
            <CouponHistorySkeleton rows={5} />
          </div>
        </div>
      </div>
      </div>
    </section>
  );
}
