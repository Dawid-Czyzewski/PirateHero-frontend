import type { TFunction } from 'i18next';
import { ActiveMissionCard } from '@/features/game/missions/ActiveMissionCard';
import { MissionCompletedCard } from '@/features/game/missions/MissionCompletedCard';
import type { ActiveMissionState } from '@/features/game/missions/missionTypes';

type Props = {
  activeMission: ActiveMissionState | null;
  isCompleted: boolean;
  progress: number;
  remainingMs: number;
  onCancelPress: () => void;
  onClaim: () => void;
  isClaimInProgress?: boolean;
  t: TFunction;
  missionDisplay: ActiveMissionState['mission'] | null;
  missionShipGoldExtra?: number;
  missionShipExpExtra?: number;
  missionBoosterGoldExtra?: number;
  missionBoosterExpExtra?: number;
  missionBoosterPercent?: number;
};

export function MissionsActiveMissionSection({
  activeMission,
  isCompleted,
  progress,
  remainingMs,
  onCancelPress,
  onClaim,
  isClaimInProgress = false,
  t,
  missionDisplay,
  missionShipGoldExtra,
  missionShipExpExtra,
  missionBoosterGoldExtra,
  missionBoosterExpExtra,
  missionBoosterPercent,
}: Props) {
  if (!activeMission) return null;
  const mission = missionDisplay ?? activeMission.mission;
  if (!isCompleted) {
    return (
      <ActiveMissionCard
        mission={mission}
        progressPercent={progress}
        remainingMs={remainingMs}
        onCancelPress={onCancelPress}
        t={t}
        missionShipGoldExtra={missionShipGoldExtra}
        missionShipExpExtra={missionShipExpExtra}
        missionBoosterGoldExtra={missionBoosterGoldExtra}
        missionBoosterExpExtra={missionBoosterExpExtra}
        missionBoosterPercent={missionBoosterPercent}
      />
    );
  }
  const missionForClaim = missionDisplay ?? activeMission.mission;
  return (
    <MissionCompletedCard
      mission={missionForClaim}
      onClaim={onClaim}
      isClaimInProgress={isClaimInProgress}
      t={t}
      missionShipGoldExtra={missionShipGoldExtra}
      missionShipExpExtra={missionShipExpExtra}
      missionBoosterGoldExtra={missionBoosterGoldExtra}
      missionBoosterExpExtra={missionBoosterExpExtra}
      missionBoosterPercent={missionBoosterPercent}
    />
  );
}
