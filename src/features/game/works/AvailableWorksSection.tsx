import { Timer } from 'lucide-react';
import { AvailableListRefreshLoading } from '@/features/game/AvailableListRefreshLoading';
import type { FrontendWork } from '@/features/game/works/workTypes';
import { WorksCoinsInCircle } from '@/features/game/works/WorksCoinsInCircle';
import { REWARD_GOLD_CLASS } from '@/features/game/missions/missionRewardClasses';

const AVAILABLE_TILE_BG = 'bg-[hsl(220_20%_14%)]';
const ROW_BG = 'bg-[hsl(220_18%_19%)] hover:bg-[hsl(220_18%_22%)]';
const BTN_GOLD =
  'cursor-pointer rounded-md bg-[hsl(45,88%,48%)] px-4 py-2.5 font-heading text-xs font-black uppercase tracking-[0.12em] text-black shadow-sm transition-[filter] hover:brightness-105 active:brightness-95 disabled:cursor-not-allowed disabled:opacity-40';

const TITLE_WHITE = 'font-heading text-sm font-bold uppercase tracking-tight text-white';

type Props = {
  rows: FrontendWork[];
  hasActiveWork: boolean;
  onStart: (row: FrontendWork) => void;
  t: (key: string) => string;
  isLoadingNewList?: boolean;
};

export function AvailableWorksSection({
  rows,
  hasActiveWork,
  onStart,
  t,
  isLoadingNewList = false,
}: Props) {
  return (
    <section
      className={`w-full overflow-hidden rounded-xl border border-white/[0.08] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05),0_8px_28px_rgba(0,0,0,0.4)] transition-opacity ${AVAILABLE_TILE_BG} ${
        hasActiveWork ? 'pointer-events-none opacity-40' : ''
      }`}
    >
      <div className="space-y-5 p-3 sm:p-5">
        <h2 className="flex items-center gap-3 font-heading text-sm font-bold uppercase tracking-[0.2em] text-white/90">
          <WorksCoinsInCircle size="sm" />
          {t('worksPage.availableWorks')}
        </h2>
        {isLoadingNewList ? (
          <AvailableListRefreshLoading variant="works" message={t('worksPage.loadingNewWorks')} />
        ) : null}
        {!isLoadingNewList ? (
          <div className="space-y-2.5">
            {rows.map((row) => {
              const disabled = hasActiveWork;
              const rewardCaption = t('worksPage.expectedRewardCaption');
              return (
                <div
                  key={row.id}
                  className={`flex flex-col gap-3 rounded-lg border border-white/[0.06] p-3 transition-colors hover:border-[hsl(43,50%,35%)]/35 sm:flex-row sm:items-center sm:gap-3 ${ROW_BG}`}
                >
                  <div className="flex min-w-0 flex-1 flex-col gap-2 sm:hidden">
                    <div className="flex min-w-0 items-start gap-3">
                      <WorksCoinsInCircle />
                      <p className={`min-w-0 flex-1 break-words ${TITLE_WHITE}`}>{row.name}</p>
                    </div>
                    <div className="flex items-end justify-between gap-3 pl-[3.25rem]">
                      <p className="text-xs text-white/50">
                        <span className="inline-flex items-center gap-1">
                          <Timer className="h-3.5 w-3.5 shrink-0 text-white/40" aria-hidden />
                          {row.durationLabel}
                        </span>
                      </p>
                      <div className="shrink-0 space-y-0.5 text-right">
                        <p className={`${REWARD_GOLD_CLASS} whitespace-nowrap`}>
                          {row.goldPreview.toLocaleString()} {t('goldGenitive')}
                        </p>
                        <p className="font-heading text-[9px] font-semibold uppercase leading-tight tracking-wide text-white/40">
                          {rewardCaption}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="hidden min-w-0 flex-1 items-center gap-3 sm:flex">
                    <WorksCoinsInCircle />
                    <div className="min-w-0 flex-1">
                      <p className={`truncate ${TITLE_WHITE}`}>{row.name}</p>
                      <p className="mt-1.5 text-xs text-white/50">
                        <span className="inline-flex items-center gap-1">
                          <Timer className="h-3.5 w-3.5 shrink-0 text-white/40" aria-hidden />
                          {row.durationLabel}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="hidden shrink-0 space-y-0.5 text-right sm:block">
                    <p className={`${REWARD_GOLD_CLASS} whitespace-nowrap`}>
                      {row.goldPreview.toLocaleString()} {t('goldGenitive')}
                    </p>
                    <p className="font-heading text-[10px] font-semibold uppercase tracking-wide text-white/40">
                      {rewardCaption}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => onStart(row)}
                    disabled={disabled}
                    className={`${BTN_GOLD} w-full sm:w-auto sm:shrink-0`}
                  >
                    {t('worksPage.startWork')}
                  </button>
                </div>
              );
            })}
          </div>
        ) : null}
      </div>
    </section>
  );
}
