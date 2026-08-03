import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useUser } from '@/hooks/useUser';
import { useSessionShopBoostersOptional } from '@/features/game/boosters/SessionShopBoostersContext';
import { applyWorkShopBoosterToGold } from '@/features/game/boosters/sessionShopBoosterEffects';
import { requestStartWork, requestCancelWork, requestCompleteWork } from '@/services/workService';
import {
  availableWorkToFrontendRow,
  calculateWorkGoldAfterShip,
  calculateWorkRawBaseGold,
  workShipModuleGoldDelta,
} from '@/features/game/works/workDisplay';
import type { AvailableWorkDto } from '@/types/gameActivities';
import type { GameUser } from '@/types/gameUser';
import type { FrontendWork } from '@/features/game/works/workTypes';

function workErrorMessage(message: unknown, fallback: string): string {
  return typeof message === 'string' && message.trim() ? message : fallback;
}

export function useWorksPageSession() {
  const { t } = useTranslation();
  const { user, updateUser, fetchUserData } = useUser();
  const { entries: shopBoosterEntries } = useSessionShopBoostersOptional();
  const [pageError, setPageError] = useState<string | null>(null);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [nowMs, setNowMs] = useState(() => Date.now());
  const [isLoadingNewWorks, setIsLoadingNewWorks] = useState(false);
  const claimInFlightRef = useRef(false);
  const userLevel = useMemo(() => Math.max(1, Number(user?.level?.name ?? 1) || 1), [user?.level?.name]);
  const catalog: AvailableWorkDto[] = useMemo(() => user?.works ?? [], [user?.works]);

  const workRows: FrontendWork[] = useMemo(
    () =>
      catalog.map((dto) => {
        const row = availableWorkToFrontendRow(dto, t, userLevel);
        return { ...row, goldPreview: calculateWorkRawBaseGold(dto, userLevel) };
      }),
    [catalog, t, userLevel]
  );

  const activeWorkDto = user?.currentActivity?.work as AvailableWorkDto | undefined;
  const hasActiveWork = Boolean(activeWorkDto && user?.currentActivity?.startTime);

  useEffect(() => {
    if (!hasActiveWork) return;
    const interval = window.setInterval(() => setNowMs(Date.now()), 1000);
    return () => window.clearInterval(interval);
  }, [hasActiveWork]);

  const activeProgress = useMemo(() => {
    if (!hasActiveWork || !user?.currentActivity?.startTime || !activeWorkDto) {
      return { progress: 0, remainingMs: 0 };
    }
    const start = new Date(user.currentActivity.startTime).getTime();
    const hours = Math.max(0.01, Number(activeWorkDto.hoursCount ?? 1));
    const totalMs = hours * 3600 * 1000;
    const elapsed = nowMs - start;
    const remainingMs = Math.max(totalMs - elapsed, 0);
    const progress = Math.min(100, (elapsed / totalMs) * 100);
    return { progress, remainingMs };
  }, [hasActiveWork, user?.currentActivity?.startTime, activeWorkDto, nowMs]);

  const isWorkTimeComplete = useMemo(() => {
    if (!hasActiveWork || !activeWorkDto) return false;
    return activeProgress.remainingMs <= 0;
  }, [hasActiveWork, activeWorkDto, activeProgress.remainingMs]);

  const claimWorkReward = useCallback(async () => {
    const work = user?.currentActivity?.work as AvailableWorkDto | undefined;
    if (!work || !user || claimInFlightRef.current) return;

    const preSnapshot: GameUser = {
      ...user,
      works: user.works ? [...user.works] : undefined,
    };

    const goldAfterShip = calculateWorkGoldAfterShip(work, userLevel);
    const optimisticGold = applyWorkShopBoosterToGold(shopBoosterEntries, Date.now(), goldAfterShip);

    claimInFlightRef.current = true;
    setPageError(null);
    setIsLoadingNewWorks(true);
    try {
      await updateUser({
        currentActivity: null,
        gold: (user.gold ?? 0) + optimisticGold.boostedGold,
        works: [],
      });

      const data = await requestCompleteWork(work.id);
      const earned = Number(data.earnedGold ?? 0);
      await updateUser({
        currentActivity: null,
        gold: (preSnapshot.gold ?? 0) + earned,
        works: data.works,
      });
      void fetchUserData();
    } catch (error) {
      console.error('claimWorkReward:', error);
      await updateUser({
        currentActivity: preSnapshot.currentActivity,
        gold: preSnapshot.gold,
        works: preSnapshot.works,
      });
      setPageError(String(t('apiRequestFailed')));
    } finally {
      claimInFlightRef.current = false;
      setIsLoadingNewWorks(false);
    }
  }, [user, updateUser, fetchUserData, t, userLevel, shopBoosterEntries]);

  const activeWorkTitle = activeWorkDto?.title ? String(t(activeWorkDto.title)) : '';

  const activeWorkGoldPreview = useMemo(() => {
    if (!activeWorkDto) {
      return {
        base: 0,
        boosted: 0,
        extra: undefined as number | undefined,
        shipFlat: 0,
      };
    }
    const base = calculateWorkRawBaseGold(activeWorkDto, userLevel);
    const afterShip = calculateWorkGoldAfterShip(activeWorkDto, userLevel);
    const shipFlat = workShipModuleGoldDelta(activeWorkDto, userLevel);
    const w = applyWorkShopBoosterToGold(shopBoosterEntries, nowMs, afterShip);
    return {
      base,
      boosted: w.boostedGold,
      extra: w.bonusFlat > 0 ? w.bonusFlat : undefined,
      shipFlat,
    };
  }, [activeWorkDto, userLevel, shopBoosterEntries, nowMs]);

  const activeExpectedGold = activeWorkGoldPreview.boosted;
  const activeBaseGold = activeWorkGoldPreview.base;
  const workShipGoldExtra =
    activeWorkGoldPreview.shipFlat > 0 ? activeWorkGoldPreview.shipFlat : undefined;
  const workBoosterGoldExtra = activeWorkGoldPreview.extra;

  const startRow = useCallback(
    async (row: FrontendWork) => {
      setPageError(null);
      if (!user) {
        setPageError(String(t('apiRequestFailed')));
        return;
      }

      const workDto = row.source;
      const workId = workDto.id;
      const rollback: Pick<GameUser, 'currentActivity'> = {
        currentActivity: user.currentActivity,
      };

      await updateUser({
        currentActivity: {
          startTime: new Date().toISOString(),
          work: { ...workDto },
        },
      });

      const response = await requestStartWork(workId);
      if (response.success === false) {
        await updateUser(rollback);
        setPageError(workErrorMessage(response.message, String(t('apiRequestFailed'))));
        return;
      }
      void fetchUserData();
    },
    [user, updateUser, fetchUserData, t]
  );

  const confirmCancelWork = useCallback(async () => {
    const work = user?.currentActivity?.work;
    if (!work || !user) return;

    const workId = work.id;
    const rollback: Pick<GameUser, 'currentActivity'> = {
      currentActivity: user.currentActivity,
    };

    setCancelModalOpen(false);

    await updateUser({ currentActivity: null });

    const response = await requestCancelWork(workId);
    if (response.success === false) {
      await updateUser(rollback);
      setPageError(workErrorMessage(response.message, String(t('apiRequestFailed'))));
      return;
    }
    void fetchUserData();
  }, [user, updateUser, fetchUserData, t]);

  return {
    pageError,
    setPageError,
    workRows,
    hasActiveWork,
    activeWorkTitle,
    activeProgress,
    activeExpectedGold,
    startRow,
    cancelModalOpen,
    setCancelModalOpen,
    confirmCancelWork,
    isWorkTimeComplete,
    claimWorkReward,
    isLoadingNewWorks,
    workBoosterGoldExtra,
    workShipGoldExtra,
    activeBaseGold,
  };
}
