import { useTranslation } from 'react-i18next';
import { CheckCircle2 } from 'lucide-react';
import type { CouponHistoryEntryDto } from '@/types/coupon';
import { CouponRewardIcon } from './CouponRewardIcon';
import { formatReward } from './utils';

export type CouponHistoryListProps = {
  entries: CouponHistoryEntryDto[];
};

function localeFromI18n(lng: string): string {
  if (lng.startsWith('pl')) return 'pl-PL';
  return 'en-US';
}

export function CouponHistoryList({ entries }: CouponHistoryListProps) {
  const { t, i18n } = useTranslation();
  const loc = localeFromI18n(i18n.language);

  return (
    <ul className="space-y-2" aria-label={t('couponHistory')}>
      {entries.map((entry) => (
        <li key={entry.id}>
          <div className="flex items-center gap-4 rounded-lg border border-border bg-card/80 p-4 transition-colors hover:bg-card">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" aria-hidden />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-sm font-bold tracking-wider text-foreground">{entry.code}</span>
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                  {formatReward(entry.rewardReceived, t)}
                </span>
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground">
                <time dateTime={entry.usedAt}>{new Date(entry.usedAt).toLocaleString(loc)}</time>
              </p>
            </div>
            <CouponRewardIcon reward={entry.rewardReceived} className="h-5 w-5 shrink-0" />
          </div>
        </li>
      ))}
    </ul>
  );
}
