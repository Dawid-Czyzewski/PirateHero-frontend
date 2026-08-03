import { Plus, Zap } from 'lucide-react';
import { gamePageTitleH1Class } from '@/features/game/layout/gamePageTitleClasses';

type Props = {
  currentEnergy: number;
  maxEnergy: number;
  energyPercent: number;
  t: (key: string) => string;
  onEnergyRefillClick?: () => void;
  energyRefillPlusDisabled?: boolean;
  energyRefillPlusTooltip?: string;
};

export function MissionsPageHeader({
  currentEnergy,
  maxEnergy,
  energyPercent,
  t,
  onEnergyRefillClick,
  energyRefillPlusDisabled = false,
  energyRefillPlusTooltip,
}: Props) {
  const plusTooltip = energyRefillPlusTooltip ?? t('refillEnergy');
  return (
    <header className="flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-x-4 sm:gap-y-3">
      <h1 className={`${gamePageTitleH1Class} min-w-0`}>
        {t('missions')}
      </h1>

      <div
        className="flex min-h-[3.5rem] w-full min-w-0 items-center gap-2 rounded-xl border border-white/[0.14] bg-[hsl(220_16%_9%)] px-3 py-3 pl-3 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] sm:ml-auto sm:w-auto sm:gap-3 sm:px-4"
        role="status"
        aria-label={`${t('missionsPage.energyStatus')}: ${currentEnergy} / ${maxEnergy}`}
      >
        <Zap
          className="h-6 w-6 shrink-0 text-amber-400 [&>path]:fill-amber-400/45"
          strokeWidth={2}
          aria-hidden
        />
        <span className="shrink-0 font-heading text-lg font-bold tabular-nums text-white sm:text-xl">
          {currentEnergy}
          <span className="text-white/45">/</span>
          {maxEnergy}
        </span>
        <div
          className="h-2.5 min-w-0 flex-1 rounded-full bg-black/65 sm:w-44 sm:flex-none"
          role="progressbar"
          aria-valuenow={currentEnergy}
          aria-valuemin={0}
          aria-valuemax={maxEnergy}
        >
          <div
            className="h-full rounded-full bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.5)] transition-[width] duration-700 ease-out"
            style={{ width: `${energyPercent}%` }}
          />
        </div>

        <button
          type="button"
          disabled={energyRefillPlusDisabled}
          onClick={() => onEnergyRefillClick?.()}
          title={plusTooltip}
          aria-label={plusTooltip}
          className={
            energyRefillPlusDisabled
              ? 'flex h-11 w-11 shrink-0 cursor-not-allowed items-center justify-center rounded-lg border border-white/10 bg-white/[0.06] text-white/35'
              : 'flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-primary/35 bg-primary/10 text-primary transition hover:border-primary/55 hover:bg-primary/18'
          }
        >
          <Plus className="h-5 w-5" strokeWidth={2.5} aria-hidden />
        </button>
      </div>
    </header>
  );
}
