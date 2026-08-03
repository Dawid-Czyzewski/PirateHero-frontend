import { ActiveMissionIconBadge } from '@/features/game/missions/ActiveMissionIconBadge';
import { ActiveMissionRewardsFooter } from '@/features/game/missions/ActiveMissionRewardsFooter';
import { formatMissionTimeShort } from '@/features/game/missions/formatMissionTime';
import type { FrontendMission } from '@/features/game/missions/missionTypes';
import { MissionCancelButton } from '@/features/game/missions/MissionCancelButton';

type Props = {
  mission: FrontendMission;
  progressPercent: number;
  remainingMs: number;
  onCancelPress: () => void;
  t: (key: string) => string;
  missionShipGoldExtra?: number;
  missionShipExpExtra?: number;
  missionBoosterGoldExtra?: number;
  missionBoosterExpExtra?: number;
  missionBoosterPercent?: number;
};

const CARD =
  'w-full overflow-hidden rounded-xl border border-[hsl(43,40%,26%)]/55 bg-[#0a0b0e] shadow-[0_12px_40px_rgba(0,0,0,0.45)]';

export function ActiveMissionCard({
  mission,
  progressPercent,
  remainingMs,
  onCancelPress,
  t,
  missionShipGoldExtra,
  missionShipExpExtra,
  missionBoosterGoldExtra,
  missionBoosterExpExtra,
  missionBoosterPercent,
}: Props) {
  return (
    <div className={CARD}>
      <div className="p-4 sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 gap-4">
            <ActiveMissionIconBadge />
            <div className="min-w-0 pt-0.5">
              <p className="font-heading text-[10px] font-semibold uppercase tracking-[0.28em] text-white/45">
                {t('missionsPage.missionInProgress')}
              </p>
              <h3 className="mt-1 font-serif text-lg font-bold uppercase leading-tight tracking-tight text-white sm:text-xl">
                {mission.name}
              </h3>
            </div>
          </div>
          <MissionCancelButton
            onCancel={onCancelPress}
            label={t('missionsPage.cancelMission')}
            ariaLabel={t('missionsPage.cancelMissionAria')}
          />
        </div>

        <div className="mt-5">
          <div className="mb-1.5 flex items-center justify-between gap-3">
            <span className="text-xs text-white/45">{t('missionsPage.missionProgressLabel')}</span>
            <span className="font-heading text-sm font-bold tabular-nums text-white/90">
              {formatMissionTimeShort(remainingMs)}
            </span>
          </div>
          <div
            className="h-2 w-full overflow-hidden rounded-full bg-black/55 ring-1 ring-inset ring-white/10"
            role="progressbar"
            aria-valuenow={Math.round(progressPercent)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuetext={formatMissionTimeShort(remainingMs)}
          >
            <div
              className="h-full rounded-full bg-gradient-to-r from-[hsl(43,55%,38%)] via-[hsl(43,72%,48%)] to-[hsl(45,85%,55%)] transition-all duration-1000 ease-linear"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <ActiveMissionRewardsFooter
          xp={mission.xp}
          gold={mission.gold}
          goldGenitiveLabel={t('goldGenitive')}
          expLabel={t('exp')}
          missionShipGoldExtra={missionShipGoldExtra}
          missionShipExpExtra={missionShipExpExtra}
          missionBoosterGoldExtra={missionBoosterGoldExtra}
          missionBoosterExpExtra={missionBoosterExpExtra}
          missionBoosterPercent={missionBoosterPercent}
        />
      </div>
    </div>
  );
}
