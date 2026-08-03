import { useTranslation } from 'react-i18next';
import { MissionErrorAlert } from '@/features/game/missions/MissionErrorAlert';
import { usePageMeta } from '@/hooks/usePageMeta';
import { useTrainingRefill } from '@/features/game/trainingRefill/useTrainingRefill';
import { TrainingPageModals } from '@/features/game/trainings/TrainingPageModals';
import { TrainingPageSections } from '@/features/game/trainings/TrainingPageSections';
import { TrainingsPageHeader } from '@/features/game/trainings/TrainingsPageHeader';
import { useTrainingPageSession } from '@/features/game/trainings/useTrainingPageSession';

export default function TrainingPage() {
  const { t } = useTranslation();
  const session = useTrainingPageSession();

  const {
    refillInfo,
    confirmOpen: trainingRefillConfirmOpen,
    successOpen: trainingRefillSuccessOpen,
    error: trainingRefillError,
    openConfirm: openTrainingRefillConfirm,
    closeConfirm: closeTrainingRefillConfirm,
    closeSuccess: closeTrainingRefillSuccess,
    executeRefill: executeTrainingRefill,
    canRefill: canTrainingRefill,
    userGold,
    plusButtonDisabled: trainingRefillPlusDisabled,
    plusTooltipLabel: trainingRefillPlusTooltip,
  } = useTrainingRefill();

  const trainingRefillConfirmDisabled =
    !refillInfo ||
    !canTrainingRefill ||
    (refillInfo != null && userGold < refillInfo.nextRefillCost) ||
    Boolean(refillInfo?.hasActiveTraining);

  const trainingRefillConfirmLabel =
    refillInfo != null
      ? `${t('refill')} (${refillInfo.nextRefillCost} ${t('gold')})`
      : t('trainingRefillInfoLoading');

  const hasActiveTraining = Boolean(session.activeTraining);

  usePageMeta({
    title: `${t('training')} | Pirate Hero`,
    description: t('trainingsPage.seoDescription', {
      defaultValue:
        'Schedule trainings and grow your pirate stats in Pirate Hero.',
    }),
  });

  return (
    <div className="w-full space-y-5">
      <MissionErrorAlert
        message={session.pageError}
        onDismiss={() => session.setPageError(null)}
        closeLabel={String(t('close'))}
      />

      <TrainingsPageHeader
        currentTrainingPoints={session.currentTrainingPoints}
        maxTrainingPoints={session.maxTrainingPoints}
        trainingPointsPercent={session.trainingPointsPercent}
        t={t}
        onTrainingRefillClick={openTrainingRefillConfirm}
        trainingRefillPlusDisabled={trainingRefillPlusDisabled}
        trainingRefillPlusTooltip={trainingRefillPlusTooltip}
      />

      <TrainingPageSections
        t={t}
        activeTraining={session.activeTraining}
        activeTitle={session.activeTitle}
        statName={session.statName}
        activeProgress={session.activeProgress}
        isTrainingTimeComplete={session.isTrainingTimeComplete}
        isLoadingNewTrainings={session.isLoadingNewTrainings}
        trainingRows={session.trainingRows}
        hasActiveTraining={hasActiveTraining}
        currentTrainingPoints={session.currentTrainingPoints}
        onStartRow={session.handleStartTrainingFromRow}
        onCancelPress={() => session.setCancelModalOpen(true)}
        onClaimTraining={() => void session.claimTrainingReward()}
      />

      <TrainingPageModals
        t={t}
        cancelOpen={session.isCancelModalOpen}
        onCloseCancel={() => session.setCancelModalOpen(false)}
        onConfirmCancel={session.handleCancelTraining}
        refillInfo={refillInfo}
        refillConfirmOpen={trainingRefillConfirmOpen}
        refillSuccessOpen={trainingRefillSuccessOpen}
        refillError={trainingRefillError}
        onCloseRefillConfirm={closeTrainingRefillConfirm}
        onConfirmRefill={() => void executeTrainingRefill()}
        onCloseRefillSuccess={closeTrainingRefillSuccess}
        refillConfirmLabel={trainingRefillConfirmLabel}
        refillConfirmDisabled={trainingRefillConfirmDisabled}
        userGold={userGold}
      />
    </div>
  );
}
