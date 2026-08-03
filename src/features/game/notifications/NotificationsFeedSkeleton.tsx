import { useTranslation } from 'react-i18next';
import { gamePageTitleH1Class } from '@/features/game/layout/gamePageTitleClasses';

export function NotificationsFeedSkeleton() {
  const { t } = useTranslation();

  return (
    <section
      className="w-full min-w-0 animate-pulse space-y-6"
      role="status"
      aria-busy="true"
      aria-live="polite"
      aria-label={String(t('loadingNotifications'))}
    >
      <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-3">
        <div className={`${gamePageTitleH1Class} h-9 w-44 rounded bg-muted/50`} />
        <div className="h-7 w-28 rounded-full bg-muted/40" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: 4 }, (_, i) => (
          <div
            key={i}
            className="flex items-start gap-4 rounded-lg border border-border/50 bg-card/30 p-4"
          >
            <div className="h-11 w-11 shrink-0 rounded-lg bg-muted/45" />
            <div className="min-w-0 flex-1 space-y-2">
              <div className="h-4 w-40 rounded bg-muted/50" />
              <div className="h-3 w-full max-w-lg rounded bg-muted/35" />
              <div className="h-3 w-32 rounded bg-muted/30" />
            </div>
            <div className="h-8 w-20 shrink-0 rounded-md bg-muted/40" />
          </div>
        ))}
      </div>
    </section>
  );
}
