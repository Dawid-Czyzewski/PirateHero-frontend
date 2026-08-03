import type { TFunction } from 'i18next';
import { EnergyRefillConfirmModal } from '@/features/game/energyRefill/EnergyRefillConfirmModal';
import { EnergyRefillDialogContent } from '@/features/game/energyRefill/EnergyRefillDialogContent';
import { EnergyRefillSuccessModal } from '@/features/game/energyRefill/EnergyRefillSuccessModal';
import type { EnergyRefillInfoData } from '@/types/refill';

type Props = {
  t: TFunction;
  refillInfo: EnergyRefillInfoData | null;
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

export function MissionsEnergyRefillDialogs({
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
        title={t('refillEnergy')}
        dismissLabel={t('cancel')}
        confirmLabel={confirmLabel}
        confirmDisabled={confirmDisabled}
      >
        <EnergyRefillDialogContent refillInfo={refillInfo} error={error} userGold={userGold} t={t} />
      </EnergyRefillConfirmModal>

      <EnergyRefillSuccessModal
        isOpen={successOpen}
        onClose={onCloseSuccess}
        title={t('success')}
        message={t('energyRefilled')}
        closeLabel={t('close')}
      />
    </>
  );
}
