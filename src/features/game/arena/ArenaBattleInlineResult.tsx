import { Star } from 'lucide-react';
import type { TFunction } from 'react-i18next';
import type { ArenaBattleResult } from './arenaTypes';

type Props = {
  t: TFunction;
  result: ArenaBattleResult;
  isReplay: boolean;
  onClose: () => void;
  primaryActionLabel?: string;
  hideFameDisplay?: boolean;
};

export function ArenaBattleInlineResult({
  t,
  result,
  isReplay,
  onClose,
  primaryActionLabel,
  hideFameDisplay = false,
}: Props) {
  const closeLabel = primaryActionLabel ?? String(t('arenaPage.backToArena'));
  return (
    <div className="w-full border-t border-border bg-card">
      <div className="animate-arena-scale-in mx-auto flex max-w-3xl flex-col items-center gap-3 px-4 py-4 sm:px-6">
        <div
          className={`font-display text-2xl font-bold ${
            result.won ? 'text-gold-gradient' : 'text-accent'
          }`}
        >
          {result.won ? t('arenaPage.wonMessage') : t('arenaPage.lostMessage')}
        </div>
        {result.won && isReplay ? (
          <div className="flex flex-wrap justify-center gap-3 text-sm">
            <span className="inline-flex items-center gap-2 rounded-lg border border-purple-500/40 bg-purple-500/15 px-4 py-2 font-display font-semibold tabular-nums text-purple-200">
              <Star className="h-4 w-4 shrink-0 fill-purple-400/90 text-purple-400" aria-hidden />
              <span>+{result.fameEarned ?? 0}</span>
              <span className="text-sm font-normal text-purple-300/85">
                {t('characterPage.fameLabel')}
              </span>
            </span>
          </div>
        ) : null}
        {!result.won && !hideFameDisplay && (
          <div className="flex flex-wrap justify-center gap-3 text-sm">
            <span className="inline-flex items-center gap-2 rounded-lg border border-border/60 bg-muted/25 px-4 py-2 font-display font-medium tabular-nums text-muted-foreground">
              <Star className="h-4 w-4 shrink-0 text-muted-foreground/50" aria-hidden />
              <span>
                {result.famePointsChange > 0 ? '+' : ''}
                {result.famePointsChange}
              </span>
              <span className="text-sm font-normal">{t('characterPage.fameLabel')}</span>
            </span>
          </div>
        )}
        <button
          type="button"
          onClick={onClose}
          className="cursor-pointer rounded-lg bg-primary px-6 py-2 font-display font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          {closeLabel}
        </button>
      </div>
    </div>
  );
}
