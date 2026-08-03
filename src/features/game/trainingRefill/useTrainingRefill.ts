import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useUser } from '@/hooks/useUser';
import { calculateCapacityWithBoosters } from '@/features/game/boosters/boosterUtils';
import { useSessionShopBoostersOptional } from '@/features/game/boosters/SessionShopBoostersContext';
import { getTrainingShopBoosterFlatBonus } from '@/features/game/boosters/sessionShopBoosterEffects';
import { getDisplayNextRefillCost } from '@/features/game/energyRefill/energyRefillPricing';
import { getTrainingRefillInfo, refillTraining } from '@/services/refillService';
import type { TrainingRefillInfoData } from '@/types/refill';

export function useTrainingRefill() {
  const { t } = useTranslation();
  const { user, updateUser } = useUser();
  const { entries: shopBoosterEntries, nowMs: shopBoosterNowMs } = useSessionShopBoostersOptional();
  const [refillInfo, setRefillInfo] = useState<TrainingRefillInfoData | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { maxTrainingPoints, currentTrainingPoints } = useMemo(() => {
    const capacities = user
      ? calculateCapacityWithBoosters(user.userCapacities, user.userBoosters)
      : null;
    const maxBase = Math.max(1, Number(capacities?.trainingPoints) || 1);
    const shopFlat = getTrainingShopBoosterFlatBonus(shopBoosterEntries, shopBoosterNowMs);
    const max = maxBase + shopFlat;
    const cur = Math.max(0, Math.min(Number(user?.trainingPoints ?? 0) || 0, max));
    return { maxTrainingPoints: max, currentTrainingPoints: cur };
  }, [user, shopBoosterEntries, shopBoosterNowMs]);
  const userGold = Number(user?.gold ?? 0);
  const trainingFull = currentTrainingPoints >= maxTrainingPoints;
  const hasActiveTraining =
    Boolean(refillInfo?.hasActiveTraining) || Boolean(user?.currentActivity?.training);

  const loadRefillInfo = useCallback(async () => {
    const result = await getTrainingRefillInfo();
    if (result?.success === true) {
      setRefillInfo(result.data);
    }
  }, []);

  useEffect(() => {
    if (user) void loadRefillInfo();
  }, [user, loadRefillInfo]);

  const displayRefillInfo = useMemo((): TrainingRefillInfoData | null => {
    if (!user) return null;
    const hasTr = Boolean(user.currentActivity?.training);

    if (!refillInfo) {
      const nextCost = getDisplayNextRefillCost(0, user.level?.name, 0, 2);
      const canTry =
        !hasTr && currentTrainingPoints < maxTrainingPoints && userGold >= nextCost;
      return {
        canRefill: canTry,
        refillsRemaining: 2,
        refillsUsed: 0,
        nextRefillCost: nextCost,
        currentTrainingPoints,
        maxTrainingPoints,
        hasActiveTraining: hasTr,
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
  }, [refillInfo, user, currentTrainingPoints, maxTrainingPoints, userGold]);

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
      setError(t('trainingRefillCannot'));
      return;
    }

    const cost = displayRefillInfo.nextRefillCost;
    const previousUser = { ...user };

    const optimistic = {
      ...user,
      trainingPoints: maxTrainingPoints,
      gold: Math.max(0, (user.gold ?? 0) - cost),
    };
    await updateUser(optimistic);

    setConfirmOpen(false);
    setSuccessOpen(true);
    setError(null);

    try {
      const result = await refillTraining();
      if (result?.success === true) {
        await updateUser({
          trainingPoints: Number(result.data.newTrainingPoints),
          gold: Number(result.data.newGold),
        });
        await loadRefillInfo();
      } else {
        await updateUser(previousUser);
        setError(
          result && result.success === false ? result.error : t('trainingRefillFailed')
        );
        setSuccessOpen(false);
        setConfirmOpen(true);
      }
    } catch {
      await updateUser(previousUser);
      setError(t('trainingRefillError'));
      setSuccessOpen(false);
      setConfirmOpen(true);
    }
  }, [displayRefillInfo, user, updateUser, loadRefillInfo, t, maxTrainingPoints]);

  const canRefill = displayRefillInfo?.canRefill ?? false;
  const allRefillsUsed = displayRefillInfo != null && displayRefillInfo.refillsRemaining === 0;

  const plusButtonDisabled = allRefillsUsed || trainingFull || hasActiveTraining;

  const plusTooltipLabel = useMemo(() => {
    if (!plusButtonDisabled) return t('refillTrainingPoints');
    if (allRefillsUsed) return t('energyRefillNoRefillsTooltip');
    if (trainingFull) return t('trainingPointsFull');
    return t('finishTrainingFirst');
  }, [plusButtonDisabled, allRefillsUsed, trainingFull, t]);

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
    maxTrainingPoints,
    currentTrainingPoints,
    userGold,
    trainingFull,
    plusButtonDisabled,
    plusTooltipLabel,
    hasActiveTraining,
  };
}
