import type { TFunction } from 'i18next';
import { CancelMissionModal } from '@/features/game/missions/CancelMissionModal';
import { TrainingsRefillDialogs } from '@/features/game/trainings/TrainingsRefillDialogs';
import type { TrainingRefillInfoData } from '@/types/refill';

type Props = {
  t: TFunction;
  cancelOpen: boolean;
  onCloseCancel: () => void;
  onConfirmCancel: () => void;
  refillInfo: TrainingRefillInfoData | null;
  refillConfirmOpen: boolean;
  refillSuccessOpen: boolean;
  refillError: string | null;
  onCloseRefillConfirm: () => void;
  onConfirmRefill: () => void;
  onCloseRefillSuccess: () => void;
  refillConfirmLabel: string;
  refillConfirmDisabled: boolean;
  userGold: number;
};

export function TrainingPageModals({
  t,
  cancelOpen,
  onCloseCancel,
  onConfirmCancel,
  refillInfo,
  refillConfirmOpen,
  refillSuccessOpen,
  refillError,
  onCloseRefillConfirm,
  onConfirmRefill,
  onCloseRefillSuccess,
  refillConfirmLabel,
  refillConfirmDisabled,
  userGold,
}: Props) {
  return (
    <>
      <CancelMissionModal
        isOpen={cancelOpen}
        onClose={onCloseCancel}
        onConfirm={onConfirmCancel}
        title={t('cancelTrainingModal.title')}
        description={t('cancelTrainingModal.description')}
        confirmLabel={t('cancelTrainingModal.confirm')}
        dismissLabel={t('cancelTrainingModal.cancel')}
      />

      <TrainingsRefillDialogs
        t={t}
        refillInfo={refillInfo}
        confirmOpen={refillConfirmOpen}
        successOpen={refillSuccessOpen}
        error={refillError}
        onCloseConfirm={onCloseRefillConfirm}
        onConfirmRefill={onConfirmRefill}
        onCloseSuccess={onCloseRefillSuccess}
        confirmLabel={refillConfirmLabel}
        confirmDisabled={refillConfirmDisabled}
        userGold={userGold}
      />
    </>
  );
}
