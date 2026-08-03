import { useTranslation } from 'react-i18next';
import type { BestiaryEntryView } from './useBestiaryState';

type Props = {
  entry: BestiaryEntryView;
  highlighted?: boolean;
  onSelect: (entry: BestiaryEntryView) => void;
};

export function BestiaryEntryCard({ entry, highlighted = false, onSelect }: Props) {
  const { t } = useTranslation();

  if (!entry.discovered) {
    return (
      <button
        type="button"
        disabled
        className={`relative overflow-hidden rounded-xl border bg-card/60 text-left opacity-90 ${
          highlighted ? 'border-primary/50 ring-2 ring-primary/30' : 'border-border/50'
        }`}
        aria-label={t('bestiaryPage.unknownEnemy')}
      >
        <div className="flex aspect-[4/5] flex-col items-center justify-center gap-3 bg-muted/20 p-4">
          <span className="flex h-16 w-16 items-center justify-center rounded-full border border-dashed border-muted-foreground/40 bg-muted/30 font-heading text-3xl font-black text-muted-foreground">
            ?
          </span>
          <span className="font-heading text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            {t('bestiaryPage.undiscovered')}
          </span>
        </div>
        <div className="border-t border-border/40 px-3 py-2.5">
          <p className="text-center text-xs text-muted-foreground">{t('bestiaryPage.unknownEnemy')}</p>
        </div>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => onSelect(entry)}
      className={`group relative cursor-pointer overflow-hidden rounded-xl border bg-card text-left transition-all hover:border-primary/40 hover:shadow-[0_0_24px_hsl(42,90%,50%,0.12)] ${
        highlighted ? 'border-primary/50 ring-2 ring-primary/30' : 'border-border'
      }`}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-muted/20">
        <img
          src={entry.portraitSrc}
          alt=""
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <span className="absolute left-2 top-2 rounded-full border border-emerald-400/40 bg-black/55 px-2 py-0.5 font-heading text-[10px] font-bold uppercase tracking-wider text-emerald-300 backdrop-blur-sm">
          {t('bestiaryPage.defeated')}
        </span>
      </div>
      <div className="space-y-1 border-t border-border/40 px-3 py-2.5">
        <p className="line-clamp-2 min-h-[2.5rem] font-display text-sm font-semibold leading-tight">
          {t(entry.nameKey)}
        </p>
        <p className="text-[11px] text-muted-foreground">
          {t(entry.dungeonNameKey)} · {t('bestiaryPage.stageLabel', { stage: entry.stage })}
        </p>
      </div>
    </button>
  );
}

export function BestiaryEntryCardPlaceholder() {
  return (
    <div className="overflow-hidden rounded-xl border border-border/40 bg-card/40">
      <div className="aspect-[4/5] animate-pulse bg-muted/20" />
      <div className="space-y-2 border-t border-border/40 p-3">
        <div className="h-4 animate-pulse rounded bg-muted/30" />
        <div className="h-3 w-2/3 animate-pulse rounded bg-muted/20" />
      </div>
    </div>
  );
}
