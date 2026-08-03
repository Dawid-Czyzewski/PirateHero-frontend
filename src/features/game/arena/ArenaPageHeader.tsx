import type { ReactNode } from 'react';
import type { TFunction } from 'react-i18next';
import { Plus, Star, Swords } from 'lucide-react';
import { gamePageTitleH1Class } from '@/features/game/layout/gamePageTitleClasses';

export type ArenaFightPointsStrip = {
  current: number;
  max: number;
  percent: number;
  onRefillClick: () => void;
  refillPlusDisabled: boolean;
  refillPlusTooltip: string;
};

type Props = {
  t: TFunction;
  actions?: ReactNode;
  fightPoints?: ArenaFightPointsStrip;
  playerFamePoints?: number;
};

export function ArenaPageHeader({ t, actions, fightPoints, playerFamePoints }: Props) {
  return (
    <header className="flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-x-4 sm:gap-y-3">
      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-4 gap-y-2">
        <h1 className={gamePageTitleH1Class}>
          {t('arena')}
        </h1>
        {typeof playerFamePoints === 'number' ? (
          <div
            className="flex items-center gap-1.5 tabular-nums"
            title={String(t('famePoints'))}
          >
            <Star className="h-5 w-5 shrink-0 text-purple-400" strokeWidth={2} aria-hidden />
            <span className="font-heading text-sm font-bold text-purple-300 sm:text-base">
              {playerFamePoints.toLocaleString()}
            </span>
          </div>
        ) : null}
      </div>

      <div className="flex w-full flex-col gap-2 sm:ml-auto sm:w-auto sm:flex-row sm:flex-wrap sm:items-center sm:justify-end sm:gap-3">
        {fightPoints ? (
          <div
            className="flex min-h-[3.5rem] w-full min-w-0 items-center gap-2 rounded-xl border border-white/[0.14] bg-[hsl(220_16%_9%)] px-3 py-3 pl-3 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] sm:w-auto sm:gap-3 sm:px-4"
            role="status"
            aria-label={`${t('arenaPage.fightPointsStatus')}: ${fightPoints.current} / ${fightPoints.max}`}
          >
            <Swords
              className="h-6 w-6 shrink-0 text-amber-400 [&>path]:stroke-amber-400"
              strokeWidth={2}
              aria-hidden
            />
            <span className="shrink-0 font-heading text-lg font-bold tabular-nums text-white sm:text-xl">
              {fightPoints.current}
              <span className="text-white/45">/</span>
              {fightPoints.max}
            </span>
            <div
              className="h-2.5 min-w-0 flex-1 rounded-full bg-black/65 sm:w-44 sm:flex-none"
              role="progressbar"
              aria-valuenow={fightPoints.current}
              aria-valuemin={0}
              aria-valuemax={fightPoints.max}
            >
              <div
                className="h-full rounded-full bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.5)] transition-[width] duration-700 ease-out"
                style={{ width: `${fightPoints.percent}%` }}
              />
            </div>

            <button
              type="button"
              disabled={fightPoints.refillPlusDisabled}
              onClick={() => fightPoints.onRefillClick()}
              title={fightPoints.refillPlusTooltip}
              aria-label={fightPoints.refillPlusTooltip}
              className={
                fightPoints.refillPlusDisabled
                  ? 'flex h-11 w-11 shrink-0 cursor-not-allowed items-center justify-center rounded-lg border border-white/10 bg-white/[0.06] text-white/35'
                  : 'flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-primary/35 bg-primary/10 text-primary transition hover:border-primary/55 hover:bg-primary/18'
              }
            >
              <Plus className="h-5 w-5" strokeWidth={2.5} aria-hidden />
            </button>
          </div>
        ) : null}
        {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
      </div>
    </header>
  );
}
