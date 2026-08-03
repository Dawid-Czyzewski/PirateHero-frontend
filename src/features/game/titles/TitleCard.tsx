import { Lock, CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { PlayerTitleDto } from '@/types/playerTitle';

type Props = {
  title: PlayerTitleDto;
  isEquipped: boolean;
  isEquipping: boolean;
  onEquip: (code: string) => void;
};

export function TitleCard({ title, isEquipped, isEquipping, onEquip }: Props) {
  const { t } = useTranslation();

  if (title.unlocked) {
    return (
      <article className="flex flex-col gap-3 rounded-lg border border-border bg-card/40 p-4 shadow-sm">
        <div className="flex items-start gap-3">
          <span className="text-2xl" aria-hidden>
            🏴‍☠️
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-bold text-foreground">{t(title.nameKey)}</h2>
            <p className="mt-1 flex items-center gap-1 text-sm text-emerald-400">
              <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden />
              {t('titlesPage.unlocked')}
            </p>
          </div>
        </div>
        {isEquipped ? (
          <span className="inline-flex w-fit rounded-md border border-primary/40 bg-primary/10 px-3 py-1.5 text-sm font-semibold text-primary">
            {t('titlesPage.active')}
          </span>
        ) : (
          <button
            type="button"
            className="inline-flex w-fit rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-50"
            disabled={isEquipping}
            onClick={() => onEquip(title.code)}
          >
            {t('titlesPage.activate')}
          </button>
        )}
      </article>
    );
  }

  return (
    <article className="flex flex-col gap-3 rounded-lg border border-dashed border-border/80 bg-muted/10 p-4 opacity-90">
      <div className="flex items-start gap-3">
        <span className="text-2xl text-muted-foreground" aria-hidden>
          <Lock className="h-6 w-6" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-bold text-muted-foreground">{t(title.nameKey)}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{t(title.descriptionKey)}</p>
          {title.progress ? (
            <div className="mt-2 space-y-1">
              <div className="h-1.5 overflow-hidden rounded-full bg-muted/40">
                <div
                  className="h-full rounded-full bg-primary/70 transition-all"
                  style={{
                    width: `${Math.min(100, Math.round((title.progress.current / Math.max(1, title.progress.target)) * 100))}%`,
                  }}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {t('titlesPage.progress', {
                  current: title.progress.current,
                  target: title.progress.target,
                })}
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
}
