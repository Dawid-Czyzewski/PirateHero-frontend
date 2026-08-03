import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useUser } from '@/hooks/useUser';
import { EnergyRefillConfirmModal } from '@/features/game/energyRefill/EnergyRefillConfirmModal';
import { EnergyRefillSuccessModal } from '@/features/game/energyRefill/EnergyRefillSuccessModal';
import { calculateCapacityWithBoosters } from '@/features/game/boosters/boosterUtils';
import { getFightRefillInfo, refillFight } from '@/services/refillService';
import type { FightRefillInfoData } from '@/types/refill';
import { FightRefillDialogContent } from './FightRefillDialogContent';

type Props = {
  open: boolean;
  onRequestClose: () => void;
};

export function FightRefillModals({ open, onRequestClose }: Props) {
  const { t } = useTranslation();
  const { user, updateUser } = useUser();
  const [refillInfo, setRefillInfo] = useState<FightRefillInfoData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successModal, setSuccessModal] = useState(false);

  const loadRefillInfo = useCallback(async () => {
    const result = await getFightRefillInfo();
    if (result.success === true) {
      setRefillInfo(result.data);
    }
  }, []);

  useEffect(() => {
    if (open) {
      void loadRefillInfo();
    }
  }, [open, loadRefillInfo]);

  const handleRefill = async () => {
    if (!refillInfo?.canRefill) {
      setError('You cannot refill fight points right now.');
      return;
    }

    const capacities = calculateCapacityWithBoosters(user?.userCapacities, user?.userBoosters);
    const maxFightPoints = capacities.fightPoints;
    const cost = refillInfo.nextRefillCost;
    const previousUser = { ...user };

    const updatedUser = {
      ...user,
      duelPoints: maxFightPoints,
      gold: (user?.gold || 0) - cost,
    };
    await updateUser(updatedUser);

    onRequestClose();
    setSuccessModal(true);
    setError(null);

    try {
      const result = await refillFight();
      if (result.success === true) {
        const finalUser = {
          ...user,
          duelPoints: Number(result.data.newFightPoints),
          gold: Number(result.data.newGold),
        };
        await updateUser(finalUser);
        await loadRefillInfo();
      } else {
        await updateUser(previousUser);
        setError(result.error || 'Failed to refill fight points.');
        setSuccessModal(false);
      }
    } catch {
      await updateUser(previousUser);
      setError('An error occurred while refilling fight points.');
      setSuccessModal(false);
    }
  };

  const canRefill = refillInfo?.canRefill ?? false;
  const userGold = user?.gold || 0;
  const confirmDisabled =
    !refillInfo || !canRefill || (refillInfo ? userGold < refillInfo.nextRefillCost : true);
  const confirmLabel = refillInfo
    ? `${t('refill')} (${refillInfo.nextRefillCost} ${t('gold')})`
    : t('fightRefillInfoLoading');

  const closeConfirm = () => {
    onRequestClose();
    setError(null);
  };

  return (
    <>
      <EnergyRefillConfirmModal
        isOpen={open}
        onClose={closeConfirm}
        onConfirm={() => void handleRefill()}
        title={t('refillFightPoints')}
        dismissLabel={t('cancel')}
        confirmLabel={confirmLabel}
        confirmDisabled={confirmDisabled}
      >
        <FightRefillDialogContent
          refillInfo={refillInfo}
          error={error}
          userGold={userGold}
          t={(key, opts) => String(t(key, opts))}
        />
      </EnergyRefillConfirmModal>

      <EnergyRefillSuccessModal
        isOpen={successModal}
        onClose={() => setSuccessModal(false)}
        title={t('success')}
        message={t('fightPointsRefilled')}
        closeLabel={t('close')}
      />
    </>
  );
}
