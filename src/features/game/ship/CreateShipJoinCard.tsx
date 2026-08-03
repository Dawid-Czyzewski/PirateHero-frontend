import { Trophy } from 'lucide-react';
import { useTranslation } from 'react-i18next';

type Props = {
  onNavigateToRanking?: () => void;
};

export function CreateShipJoinCard({ onNavigateToRanking }: Props) {
  const { t } = useTranslation();

  return (
    <article className="relative flex flex-col overflow-hidden rounded-xl border border-border bg-card/70 shadow-sm backdrop-blur-sm">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-secondary/50 to-transparent"
        aria-hidden
      />
      <div
        className="absolute -left-6 top-1/2 h-40 w-40 -translate-y-1/2 rounded-full bg-[hsl(25_40%_20%_/_0.35)] blur-3xl"
        aria-hidden
      />

      <div className="relative flex flex-col p-5 sm:p-6 md:p-8">
        <div className="mb-4 min-w-0 space-y-1">
          <h2 className="font-heading text-lg font-bold uppercase tracking-wide text-foreground sm:text-xl">
            {t('joinExistingStatek')}
          </h2>
          <p className="text-xs text-muted-foreground sm:text-sm">{t('joinStatekCardLead')}</p>
        </div>

        <div className="flex flex-col gap-3 rounded-lg border border-border/80 bg-background/40 p-4 sm:p-5">
          <p className="text-sm leading-relaxed text-muted-foreground">{t('joinStatekInfo')}</p>

          {onNavigateToRanking ? (
            <button
              type="button"
              onClick={onNavigateToRanking}
              className="flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-primary/40 bg-primary/10 px-6 font-display text-sm font-bold uppercase tracking-wide text-primary transition hover:border-primary/60 hover:bg-primary/15"
            >
              <Trophy className="h-4 w-4 shrink-0" aria-hidden />
              {t('goToRanking')}
            </button>
          ) : null}
        </div>
      </div>
    </article>
  );
}
