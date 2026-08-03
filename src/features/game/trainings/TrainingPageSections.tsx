import type { TFunction } from 'i18next';
import { ActiveTrainingCard } from '@/features/game/trainings/ActiveTrainingCard';
import { AvailableTrainingsSection } from '@/features/game/trainings/AvailableTrainingsSection';
import { TrainingCompletedCard } from '@/features/game/trainings/TrainingCompletedCard';
import type { FrontendTraining } from '@/features/game/trainings/trainingTypes';
import type { ActiveTrainingDto } from '@/types/currentActivity';

type Props = {
  t: TFunction;
  activeTraining: ActiveTrainingDto | null;
  activeTitle: string;
  statName: string;
  activeProgress: { progress: number; remainingMs: number };
  isTrainingTimeComplete: boolean;
  isLoadingNewTrainings: boolean;
  trainingRows: FrontendTraining[];
  hasActiveTraining: boolean;
  currentTrainingPoints: number;
  onStartRow: (row: FrontendTraining) => void;
  onCancelPress: () => void;
  onClaimTraining: () => void;
};

export function TrainingPageSections({
  t,
  activeTraining,
  activeTitle,
  statName,
  activeProgress,
  isTrainingTimeComplete,
  isLoadingNewTrainings,
  trainingRows,
  hasActiveTraining,
  currentTrainingPoints,
  onStartRow,
  onCancelPress,
  onClaimTraining,
}: Props) {
  return (
    <>
      {activeTraining && !isTrainingTimeComplete ? (
        <ActiveTrainingCard
          title={activeTitle}
          progressPercent={activeProgress.progress}
          remainingMs={activeProgress.remainingMs}
          skillPointsReward={Number(activeTraining.skillPointsReward ?? 0)}
          statName={statName}
          rewardCaption={String(t('trainingsPage.rewardOnCompletion'))}
          onCancelPress={onCancelPress}
          t={t}
        />
      ) : null}

      {activeTraining && isTrainingTimeComplete ? (
        <TrainingCompletedCard
          title={activeTitle}
          skillPointsReward={Number(activeTraining.skillPointsReward ?? 0)}
          statName={statName}
          onClaim={onClaimTraining}
          isClaimInProgress={isLoadingNewTrainings}
          t={t}
        />
      ) : null}

      {trainingRows.length > 0 || isLoadingNewTrainings ? (
        <AvailableTrainingsSection
          trainings={trainingRows}
          hasActiveTraining={hasActiveTraining}
          currentTrainingPoints={currentTrainingPoints}
          onSelect={onStartRow}
          t={t}
          isLoadingNewList={isLoadingNewTrainings}
        />
      ) : null}

      {!activeTraining && !trainingRows.length && !isLoadingNewTrainings ? (
        <p className="text-center text-sm text-white/60">{String(t('trainings.noTrainings'))}</p>
      ) : null}
    </>
  );
}
