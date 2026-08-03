import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useUser } from '@/hooks/useUser';
import { calculateCapacityWithBoosters } from '@/features/game/boosters/boosterUtils';
import { getDisplayNextRefillCost } from '@/features/game/energyRefill/energyRefillPricing';
import { getEnergyRefillInfo, refillEnergy } from '@/services/refillService';
import type { EnergyRefillInfoData } from '@/types/refill';

export function useEnergyRefill() {
  const { t } = useTranslation();
  const { user, updateUser } = useUser();
  const [refillInfo, setRefillInfo] = useState<EnergyRefillInfoData | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const capacities = user
    ? calculateCapacityWithBoosters(user.userCapacities, user.userBoosters)
    : null;
  const maxEnergy = Math.max(1, Number(capacities?.energyPoints) || 1);
  const currentEnergy = Math.max(0, Math.min(Number(user?.energyPoints ?? 0) || 0, maxEnergy));
  const userGold = Number(user?.gold ?? 0);
  const energyFull = currentEnergy >= maxEnergy;
  const hasActiveMission =
    Boolean(refillInfo?.hasActiveMission) || Boolean(user?.currentActivity?.mission);

  const loadRefillInfo = useCallback(async () => {
    const result = await getEnergyRefillInfo();
    if (result?.success === true) {
      setRefillInfo(result.data);
    }
  }, []);

  useEffect(() => {
    if (user) void loadRefillInfo();
  }, [user, loadRefillInfo]);

  
  const displayRefillInfo = useMemo((): EnergyRefillInfoData | null => {
    if (!user) return null;
    const hasMission = Boolean(user.currentActivity?.mission);

    if (!refillInfo) {
      const nextCost = getDisplayNextRefillCost(0, user.level?.name, 0, 2);
      const canTry =
        !hasMission &&
        currentEnergy < maxEnergy &&
        userGold >= nextCost;
      return {
        canRefill: canTry,
        refillsRemaining: 2,
        refillsUsed: 0,
        nextRefillCost: nextCost,
        currentEnergy,
        maxEnergy,
        hasActiveMission: hasMission,
      };
    }

    const displayCost = getDisplayNextRefillCost(
      refillInfo.nextRefillCost,
      user.level?.name,
      refillInfo.refillsUsed,
      refillInfo.refillsRemaining
    );
    const canRefillEffective = refillInfo.canRefill && userGold >= displayCost;

    return {
      ...refillInfo,
      nextRefillCost: displayCost,
      canRefill: canRefillEffective,
    };
  }, [refillInfo, user, currentEnergy, maxEnergy, userGold]);

  const openConfirm = useCallback(() => {
    setError(null);
    setConfirmOpen(true);
    void loadRefillInfo();
  }, [loadRefillInfo]);

  const closeConfirm = useCallback(() => {
    setConfirmOpen(false);
    setError(null);
  }, []);

  const closeSuccess = useCallback(() => {
    setSuccessOpen(false);
  }, []);

  const executeRefill = useCallback(async () => {
    if (!displayRefillInfo?.canRefill || !user) {
      setError(t('energyRefillCannot'));
      return;
    }

    const cost = displayRefillInfo.nextRefillCost;
    const previousUser = { ...user };

    const optimistic = {
      ...user,
      energyPoints: maxEnergy,
      gold: Math.max(0, (user.gold ?? 0) - cost),
    };
    await updateUser(optimistic);

    setConfirmOpen(false);
    setSuccessOpen(true);
    setError(null);

    try {
      const result = await refillEnergy();
      if (result?.success === true) {
        await updateUser({
          energyPoints: Number(result.data.newEnergy),
          gold: Number(result.data.newGold),
        });
        await loadRefillInfo();
      } else {
        await updateUser(previousUser);
        setError(
          result && result.success === false ? result.error : t('energyRefillFailed')
        );
        setSuccessOpen(false);
        setConfirmOpen(true);
      }
    } catch {
      await updateUser(previousUser);
      setError(t('energyRefillError'));
      setSuccessOpen(false);
      setConfirmOpen(true);
    }
  }, [displayRefillInfo, user, updateUser, loadRefillInfo, t, maxEnergy]);

  const canRefill = displayRefillInfo?.canRefill ?? false;
  const allRefillsUsed = displayRefillInfo != null && displayRefillInfo.refillsRemaining === 0;

  
  const plusButtonDisabled =
    allRefillsUsed || energyFull || hasActiveMission;

  const plusTooltipLabel = useMemo(() => {
    if (!plusButtonDisabled) return t('refillEnergy');
    if (allRefillsUsed) return t('energyRefillNoRefillsTooltip');
    if (energyFull) return t('energyFull');
    return t('finishMissionFirst');
  }, [plusButtonDisabled, allRefillsUsed, energyFull, t]);

  return {
    refillInfo: displayRefillInfo,
    rawRefillInfo: refillInfo,
    confirmOpen,
    successOpen,
    error,
    openConfirm,
    closeConfirm,
    closeSuccess,
    executeRefill,
    loadRefillInfo,
    canRefill,
    allRefillsUsed,
    maxEnergy,
    currentEnergy,
    userGold,
    energyFull,
    plusButtonDisabled,
    plusTooltipLabel,
    hasActiveMission,
  };
}
