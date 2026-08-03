import { Timer, Zap } from 'lucide-react';
import { AvailableListRefreshLoading } from '@/features/game/AvailableListRefreshLoading';
import type { FrontendMission } from '@/features/game/missions/missionTypes';
import { MissionCompassInCircle } from '@/features/game/missions/MissionCompassInCircle';
import { REWARD_GOLD_CLASS, REWARD_XP_CLASS } from '@/features/game/missions/missionRewardClasses';

const AVAILABLE_TILE_BG = 'bg-[hsl(220_20%_14%)]';
const MISSION_ROW_BG = 'bg-[hsl(220_18%_19%)] hover:bg-[hsl(220_18%_22%)]';
const BTN_GOLD =
  'cursor-pointer rounded-md bg-[hsl(45,88%,48%)] px-4 py-2.5 font-heading text-xs font-black uppercase tracking-[0.12em] text-black shadow-sm transition-[filter] hover:brightness-105 active:brightness-95 disabled:cursor-not-allowed disabled:opacity-40';

const TITLE_WHITE = 'font-heading text-sm font-bold uppercase tracking-tight text-white';

type Props = {
  missions: FrontendMission[];
  hasActiveMission: boolean;
  currentEnergy: number;
  onStart: (mission: FrontendMission) => void;
  t: (key: string, options?: Record<string, unknown>) => string;
  isLoadingNewList?: boolean;
};

export function AvailableMissionsSection({
  missions,
  hasActiveMission,
  currentEnergy,
  onStart,
  t,
  isLoadingNewList = false,
}: Props) {
  return (
    <section
      className={`w-full overflow-hidden rounded-xl border border-white/[0.08] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05),0_8px_28px_rgba(0,0,0,0.4)] transition-opacity ${AVAILABLE_TILE_BG} ${
        hasActiveMission ? 'pointer-events-none opacity-40' : ''
      }`}
    >
      <div className="space-y-5 p-3 sm:p-5">
        <h2 className="flex items-center gap-3 font-heading text-sm font-bold uppercase tracking-[0.2em] text-white/90">
          <MissionCompassInCircle size="sm" />
          {t('missionsPage.availableMissions')}
        </h2>
        {isLoadingNewList ? (
          <AvailableListRefreshLoading variant="missions" message={t('missionsPage.loadingNewMissions')} />
        ) : null}
        {!isLoadingNewList ? (
          <div className="space-y-2.5">
            {missions.map((mission) => {
              const canAfford = currentEnergy >= mission.energy;
              const disabled = hasActiveMission || !canAfford;
              return (
                <div
                  key={mission.id}
                  className={`flex flex-col gap-3 rounded-lg border border-white/[0.06] p-3 transition-colors hover:border-[hsl(43,50%,35%)]/35 sm:flex-row sm:items-center sm:gap-3 ${MISSION_ROW_BG}`}
                >
                  <div className="flex min-w-0 flex-1 items-start gap-3 sm:items-center">
                    <MissionCompassInCircle />
                    <div className="min-w-0 flex-1">
                      <p className={`truncate ${TITLE_WHITE}`}>{mission.name}</p>
                      {mission.description ? (
                        <p className="mt-0.5 line-clamp-2 text-xs text-white/45">{mission.description}</p>
                      ) : null}
                      <p className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
                        <span className="inline-flex items-center gap-1 text-white/50">
                          <Timer className="h-3.5 w-3.5 shrink-0 text-white/40" aria-hidden />
                          {mission.durationLabel}
                        </span>
                        <span className="inline-flex items-center gap-1.5 font-bold text-orange-400">
                          <Zap className="h-3.5 w-3.5 shrink-0 text-orange-400" aria-hidden />
                          <span>
                            {mission.energy} {t('missionsPage.energyUnit')}
                          </span>
                        </span>
                      </p>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1 text-right sm:hidden">
                      <p className={`${REWARD_XP_CLASS} whitespace-nowrap`}>
                        +{mission.xp} {t('exp')}
                      </p>
                      <p className={`${REWARD_GOLD_CLASS} whitespace-nowrap`}>
                        +{mission.gold} {t('goldGenitive')}
                      </p>
                    </div>
                  </div>

                  <div className="hidden shrink-0 flex-col items-end gap-1 text-right sm:flex">
                    <p className={`${REWARD_XP_CLASS} whitespace-nowrap`}>
                      +{mission.xp} {t('exp')}
                    </p>
                    <p className={`${REWARD_GOLD_CLASS} whitespace-nowrap`}>
                      +{mission.gold} {t('goldGenitive')}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => onStart(mission)}
                    disabled={disabled}
                    title={!canAfford ? t('missionsPage.notEnoughEnergy') : undefined}
                    className={`${BTN_GOLD} w-full sm:w-auto sm:shrink-0`}
                  >
                    {t('missionsPage.depart')}
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
