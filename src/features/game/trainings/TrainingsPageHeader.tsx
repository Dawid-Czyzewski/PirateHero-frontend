import { Dumbbell, Plus } from 'lucide-react';
import { gamePageTitleH1Class } from '@/features/game/layout/gamePageTitleClasses';

type Props = {
  currentTrainingPoints: number;
  maxTrainingPoints: number;
  trainingPointsPercent: number;
  t: (key: string) => string;
  onTrainingRefillClick?: () => void;
  trainingRefillPlusDisabled?: boolean;
  trainingRefillPlusTooltip?: string;
};

export function TrainingsPageHeader({
  currentTrainingPoints,
  maxTrainingPoints,
  trainingPointsPercent,
  t,
  onTrainingRefillClick,
  trainingRefillPlusDisabled = false,
  trainingRefillPlusTooltip,
}: Props) {
  const plusTooltip = trainingRefillPlusTooltip ?? t('refillTrainingPoints');
  return (
    <header className="flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-x-4 sm:gap-y-3">
      <h1 className={`${gamePageTitleH1Class} min-w-0`}>
        {t('training')}
      </h1>

      <div
        className="flex min-h-[3.5rem] w-full min-w-0 items-center gap-2 rounded-xl border border-white/[0.14] bg-[hsl(220_16%_9%)] px-3 py-3 pl-3 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] sm:ml-auto sm:w-auto sm:gap-3 sm:px-4"
        role="status"
        aria-label={`${t('trainingsPage.trainingPointsStatus')}: ${currentTrainingPoints} / ${maxTrainingPoints}`}
      >
        <Dumbbell
          className="h-6 w-6 shrink-0 text-emerald-400/90 [&>path]:stroke-emerald-400/55"
          strokeWidth={2}
          aria-hidden
        />
        <span className="shrink-0 font-heading text-lg font-bold tabular-nums text-white sm:text-xl">
          {currentTrainingPoints}
          <span className="text-white/45">/</span>
          {maxTrainingPoints}
        </span>
        <div
          className="h-2.5 min-w-0 flex-1 rounded-full bg-black/65 sm:w-44 sm:flex-none"
          role="progressbar"
          aria-valuenow={currentTrainingPoints}
          aria-valuemin={0}
          aria-valuemax={maxTrainingPoints}
        >
          <div
            className="h-full rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.45)] transition-[width] duration-700 ease-out"
            style={{ width: `${trainingPointsPercent}%` }}
          />
        </div>

        <button
          type="button"
          disabled={trainingRefillPlusDisabled}
          onClick={() => onTrainingRefillClick?.()}
          title={plusTooltip}
          aria-label={plusTooltip}
          className={
            trainingRefillPlusDisabled
              ? 'flex h-11 w-11 shrink-0 cursor-not-allowed items-center justify-center rounded-lg border border-white/10 bg-white/[0.06] text-white/35'
              : 'flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-emerald-500/35 bg-emerald-500/10 text-emerald-300 transition hover:border-emerald-400/55 hover:bg-emerald-500/18'
          }
        >
          <Plus className="h-5 w-5" strokeWidth={2.5} aria-hidden />
        </button>
      </div>
    </header>
  );
}
