import { Play, SkipForward } from 'lucide-react';
import type { TFunction } from 'react-i18next';

type Props = {
  t: TFunction;
  title: string | null;
  isReplay: boolean;
  showSkip: boolean;
  onSkip: () => void;
};

export function ArenaBattleHeader({ t, title, isReplay, showSkip, onSkip }: Props) {
  return (
    <div className="mb-3 flex flex-wrap items-center justify-between gap-3 px-1 sm:px-2">
      <div className="flex min-w-0 flex-wrap items-center gap-2">
        {title ? (
          <h2 className="font-display text-lg font-bold text-gold-gradient">{title}</h2>
        ) : null}
        {isReplay && (
          <span className="flex items-center gap-1 rounded-full bg-muted/60 px-2 py-0.5 text-xs text-muted-foreground">
            <Play className="h-3 w-3" aria-hidden />
            {t('arenaPage.replayBadge')}
          </span>
        )}
      </div>
      {showSkip && (
        <button
          type="button"
          onClick={onSkip}
          className="flex cursor-pointer items-center gap-2 rounded-lg bg-primary/90 px-4 py-2 font-display text-sm font-semibold text-primary-foreground shadow-lg transition-colors hover:bg-primary"
        >
          <SkipForward className="h-4 w-4" aria-hidden />
          {t('arenaPage.skipBattle')}
        </button>
      )}
    </div>
  );
}
