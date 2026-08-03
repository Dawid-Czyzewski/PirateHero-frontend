import LevelUpModal from '@/components/modal/LevelUpModal';
import { AvailableMissionsSection } from '@/features/game/missions/AvailableMissionsSection';
import { CancelMissionModal } from '@/features/game/missions/CancelMissionModal';
import { MissionErrorAlert } from '@/features/game/missions/MissionErrorAlert';
import { MissionsActiveMissionSection } from '@/features/game/missions/MissionsActiveMissionSection';
import { MissionsEnergyRefillDialogs } from '@/features/game/missions/MissionsEnergyRefillDialogs';
import { MissionsPageHeader } from '@/features/game/missions/MissionsPageHeader';
import { useMissionsPage } from '@/features/game/missions/useMissionsPage';
import type { MissionsPageProps } from '@/features/game/gamePageTypes';

export default function MissionsPage({ goBack: _goBack, onQuestsUpdated }: MissionsPageProps) {
  const {
    t,
    missionError,
    setMissionError,
    cancelModalOpen,
    setCancelModalOpen,
    levelUpModalOpen,
    levelUpInfo,
    isLoadingNewMissions,
    maxEnergy,
    currentEnergy,
    energyPercent,
    missionRows,
    activeMission,
    missionDisplayRow,
    missionShipGoldExtra,
    missionShipExpExtra,
    missionBoosterGoldExtra,
    missionBoosterExpExtra,
    missionBoosterPercent,
    progress,
    remainingMs,
    isCompleted,
    startMission,
    confirmCancelMission,
    claimMissionReward,
    closeLevelUpModal,
    handleLevelUpDistributePoints,
    openCancelModal,
    refillInfo,
    energyRefillConfirmOpen,
    energyRefillSuccessOpen,
    energyRefillError,
    closeEnergyRefillConfirm,
    closeEnergyRefillSuccess,
    executeEnergyRefill,
    openEnergyRefillConfirm,
    energyRefillConfirmLabel,
    energyRefillConfirmDisabled,
    userGold,
    energyRefillPlusDisabled,
    energyRefillPlusTooltip,
  } = useMissionsPage({ onQuestsUpdated });

  return (
    <div className="w-full space-y-5">
      <MissionErrorAlert
        message={missionError}
        onDismiss={() => setMissionError(null)}
        closeLabel={String(t('close'))}
      />

      <MissionsPageHeader
        currentEnergy={currentEnergy}
        maxEnergy={maxEnergy}
        energyPercent={energyPercent}
        t={t}
        onEnergyRefillClick={openEnergyRefillConfirm}
        energyRefillPlusDisabled={energyRefillPlusDisabled}
        energyRefillPlusTooltip={energyRefillPlusTooltip}
      />

      <MissionsActiveMissionSection
        activeMission={activeMission}
        isCompleted={isCompleted}
        progress={progress}
        remainingMs={remainingMs}
        onCancelPress={openCancelModal}
        onClaim={() => void claimMissionReward()}
        isClaimInProgress={isLoadingNewMissions}
        t={t}
        missionDisplay={missionDisplayRow}
        missionShipGoldExtra={missionShipGoldExtra}
        missionShipExpExtra={missionShipExpExtra}
        missionBoosterGoldExtra={missionBoosterGoldExtra}
        missionBoosterExpExtra={missionBoosterExpExtra}
        missionBoosterPercent={missionBoosterPercent}
      />

      {missionRows.length > 0 || isLoadingNewMissions ? (
        <AvailableMissionsSection
          missions={missionRows}
          hasActiveMission={Boolean(activeMission)}
          currentEnergy={currentEnergy}
          onStart={(m) => void startMission(m)}
          t={t}
          isLoadingNewList={isLoadingNewMissions}
        />
      ) : null}

      {!missionRows.length && !activeMission && !isLoadingNewMissions ? (
        <p className="text-center text-sm text-white/60">{t('noMissions')}</p>
      ) : null}

      <CancelMissionModal
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        onConfirm={() => void confirmCancelMission()}
        title={t('missionsPage.cancelMissionTitle')}
        description={t('missionsPage.cancelMissionBody')}
        confirmLabel={t('missionsPage.cancelMissionConfirm')}
        dismissLabel={t('missionsPage.cancelMissionDismiss')}
      />

      <LevelUpModal
        isOpen={levelUpModalOpen}
        onClose={closeLevelUpModal}
        onDistributePoints={handleLevelUpDistributePoints}
        newLevel={levelUpInfo}
      />

      <MissionsEnergyRefillDialogs
        t={t}
        refillInfo={refillInfo}
        confirmOpen={energyRefillConfirmOpen}
        successOpen={energyRefillSuccessOpen}
        error={energyRefillError}
        onCloseConfirm={closeEnergyRefillConfirm}
        onConfirmRefill={() => void executeEnergyRefill()}
        onCloseSuccess={closeEnergyRefillSuccess}
        confirmLabel={energyRefillConfirmLabel}
        confirmDisabled={energyRefillConfirmDisabled}
        userGold={userGold}
      />
    </div>
  );
}
