import type { TFunction } from 'i18next';
import { EnergyRefillConfirmModal } from '@/features/game/energyRefill/EnergyRefillConfirmModal';
import { EnergyRefillSuccessModal } from '@/features/game/energyRefill/EnergyRefillSuccessModal';
import { TrainingRefillDialogContent } from '@/features/game/trainingRefill/TrainingRefillDialogContent';
import type { TrainingRefillInfoData } from '@/types/refill';

type Props = {
  t: TFunction;
  refillInfo: TrainingRefillInfoData | null;
  confirmOpen: boolean;
  successOpen: boolean;
  error: string | null;
  onCloseConfirm: () => void;
  onConfirmRefill: () => void;
  onCloseSuccess: () => void;
  confirmLabel: string;
  confirmDisabled: boolean;
  userGold: number;
};

export function TrainingsRefillDialogs({
  t,
  refillInfo,
  confirmOpen,
  successOpen,
  error,
  onCloseConfirm,
  onConfirmRefill,
  onCloseSuccess,
  confirmLabel,
  confirmDisabled,
  userGold,
}: Props) {
  return (
    <>
      <EnergyRefillConfirmModal
        isOpen={confirmOpen}
        onClose={onCloseConfirm}
        onConfirm={onConfirmRefill}
        title={t('refillTrainingPoints')}
        dismissLabel={t('cancel')}
        confirmLabel={confirmLabel}
        confirmDisabled={confirmDisabled}
      >
        <TrainingRefillDialogContent refillInfo={refillInfo} error={error} userGold={userGold} t={t} />
      </EnergyRefillConfirmModal>

      <EnergyRefillSuccessModal
        isOpen={successOpen}
        onClose={onCloseSuccess}
        title={t('success')}
        message={t('trainingPointsRefilled')}
        closeLabel={t('close')}
      />
    </>
  );
}
