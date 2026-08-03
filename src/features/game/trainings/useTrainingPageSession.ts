import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { calculateCapacityWithBoosters } from '@/features/game/boosters/boosterUtils';
import { useSessionShopBoostersOptional } from '@/features/game/boosters/SessionShopBoostersContext';
import { getTrainingShopBoosterFlatBonus } from '@/features/game/boosters/sessionShopBoosterEffects';
import {
  availableTrainingToFrontendRow,
  statTypeToTranslationKey,
} from '@/features/game/trainings/trainingDisplay';
import type { FrontendTraining } from '@/features/game/trainings/trainingTypes';
import { useUser } from '@/hooks/useUser';
import {
  buildTrainingClaimOptimisticPatch,
  cancelTraining,
  requestTrainingComplete,
  startTraining,
} from '@/services/trainingService';

export function useTrainingPageSession() {
  const { t } = useTranslation();
  const { user, updateUser, fetchUserData } = useUser();
  const { entries: shopBoosterEntries, nowMs: shopBoosterNowMs } = useSessionShopBoostersOptional();
  const trainingShipFlat = 0;
  const [pageError, setPageError] = useState<string | null>(null);
  const [isCancelModalOpen, setCancelModalOpen] = useState(false);
  const [isLoadingNewTrainings, setIsLoadingNewTrainings] = useState(false);
  const [nowMs, setNowMs] = useState(() => Date.now());

  const { maxTrainingPoints, currentTrainingPoints, trainingPointsPercent } = useMemo(() => {
    const cap = calculateCapacityWithBoosters(user?.userCapacities, user?.userBoosters);
    const maxBase = Math.max(1, Number(cap.trainingPoints) || 1);
    const shopFlat = getTrainingShopBoosterFlatBonus(shopBoosterEntries, shopBoosterNowMs);
    const max = maxBase + shopFlat + trainingShipFlat;
    const cur = Math.max(0, Math.min(Number(user?.trainingPoints ?? 0) || 0, max));
    return {
      maxTrainingPoints: max,
      currentTrainingPoints: cur,
      trainingPointsPercent: Math.min(100, (cur / max) * 100),
    };
  }, [
    user?.trainingPoints,
    user?.userCapacities,
    user?.userBoosters,
    shopBoosterEntries,
    shopBoosterNowMs,
    trainingShipFlat,
  ]);

  const trainingRows = useMemo(() => {
    const list = user?.trainings;
    if (!list?.length) return [];
    return list.map((dto) => availableTrainingToFrontendRow(dto, t));
  }, [user?.trainings, t]);

  const activeTraining = user?.currentActivity?.training ?? null;

  useEffect(() => {
    if (!activeTraining) return;
    const timerId = window.setInterval(() => setNowMs(Date.now()), 1000);
    return () => window.clearInterval(timerId);
  }, [activeTraining]);

  const activeProgress = useMemo(() => {
    if (!user?.currentActivity?.training || !user.currentActivity.startTime) {
      return { progress: 0, remainingMs: 0 };
    }
    const { training, startTime } = user.currentActivity;
    const durSec = Number(training?.durationInSeconds ?? 0);
    if (!durSec) return { progress: 0, remainingMs: 0 };
    const durationMs = durSec * 1000;
    const elapsed = nowMs - new Date(startTime).getTime();
    const progress = Math.min(100, (elapsed / durationMs) * 100);
    const remainingMs = Math.max(0, durationMs - elapsed);
    return { progress, remainingMs };
  }, [user?.currentActivity, nowMs]);

  const isTrainingTimeComplete = activeTraining != null && activeProgress.progress >= 100;

  const claimTrainingReward = useCallback(async () => {
    const tr = user?.currentActivity?.training;
    if (!tr || !user || isLoadingNewTrainings) return;

    const tid = tr.id;
    if (tid === undefined || tid === null) return;

    setPageError(null);
    const { rollback, optimisticPatch } = buildTrainingClaimOptimisticPatch(user, tr);

    setIsLoadingNewTrainings(true);
    try {
      await updateUser(optimisticPatch);
      const trainings = await requestTrainingComplete(tid);
      await updateUser({ trainings });
      void fetchUserData();
    } catch (error) {
      console.error('claimTrainingReward:', error);
      await updateUser({
        currentActivity: rollback.currentActivity,
        userBaseStatistics: rollback.userBaseStatistics,
        trainings: rollback.trainings,
      });
      setPageError(String(t('trainingsPage.startFailed')));
    } finally {
      setIsLoadingNewTrainings(false);
    }
  }, [user, updateUser, fetchUserData, t, isLoadingNewTrainings]);

  const handleStartTrainingFromRow = useCallback(
    (row: FrontendTraining) => {
      const dto = user?.trainings?.find((x) => String(x.id) === row.id);
      if (!dto || !user) return;
      setPageError(null);
      const response = startTraining(dto, user, updateUser, { fetchUserData });
      if (!response.success) {
        setPageError(String(t('notEnoughTrainingEnergy')));
      }
    },
    [user, updateUser, fetchUserData, t]
  );

  const handleCancelTraining = useCallback(() => {
    const training = user?.currentActivity?.training;
    if (!training || !user) return;

    setCancelModalOpen(false);
    cancelTraining(training, user, updateUser, { fetchUserData });
  }, [user, updateUser, fetchUserData]);

  const activeTitle = activeTraining?.title ? t(activeTraining.title) : '';
  const statKey = statTypeToTranslationKey(activeTraining?.statType);
  const statName = statKey ? String(t(statKey)) : '';

  return {
    t,
    pageError,
    setPageError,
    isCancelModalOpen,
    setCancelModalOpen,
    activeTraining,
    activeProgress,
    isTrainingTimeComplete,
    isLoadingNewTrainings,
    claimTrainingReward,
    trainingRows,
    maxTrainingPoints,
    currentTrainingPoints,
    trainingPointsPercent,
    handleStartTrainingFromRow,
    handleCancelTraining,
    activeTitle,
    statName,
  };
}
