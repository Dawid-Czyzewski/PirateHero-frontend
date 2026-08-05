import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import type { LevelUpInfo } from '@/components/modal/LevelUpModal';
import { calculateCapacityWithBoosters } from '@/features/game/boosters/boosterUtils';
import { useSessionShopBoosters } from '@/features/game/boosters/SessionShopBoostersContext';
import { missionGoldExpAfterShip } from '@/features/game/boosters/sessionShopBoosterEffects';
import { missionRewardsWithShipAndShop } from '@/features/game/ship/shipBonusEffects';
import {
  availableMissionToFrontendRow,
  mergeActiveMissionDtoWithUserMissions,
} from '@/features/game/missions/missionDisplay';
import {
  clearMissionStartBasesSnapshot,
  writeMissionStartBasesSnapshot,
} from '@/features/game/missions/missionStartBasesStorage';
import { SHOW_LEVEL_UP_MODAL_ON_MISSION_CLAIM } from '@/features/game/missions/missionsPageConstants';
import type { ActiveMissionState, FrontendMission } from '@/features/game/missions/missionTypes';
import type { MissionsPageProps } from '@/features/game/gamePageTypes';
import { useEnergyRefill } from '@/features/game/energyRefill/useEnergyRefill';
import { usePageMeta } from '@/hooks/usePageMeta';
import { useUser } from '@/hooks/useUser';
import { queryKeys } from '@/lib/query/queryKeys';
import type { GameUser } from '@/types/gameUser';
import {
  applyMissionCompleteToUser,
  cancelGameMission,
  completeGameMission,
  skipGameMission,
  startGameMission,
} from '@/services/missionService';
import { calculateLevelUp } from '@/services/levelCalculationService';
import { missionSkipDiamondCost } from '@/features/game/missions/missionSkipCost';
import type { AvailableMissionDto } from '@/types/gameActivities';

export function useMissionsPage({ onQuestsUpdated }: Pick<MissionsPageProps, 'onQuestsUpdated'>) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, fetchUserData, updateUser } = useUser();
  const { entries: shopBoosterEntries } = useSessionShopBoosters();
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [nowMs, setNowMs] = useState(() => Date.now());
  const [levelUpModalOpen, setLevelUpModalOpen] = useState(false);
  const [levelUpInfo, setLevelUpInfo] = useState<LevelUpInfo | null>(null);
  const [missionError, setMissionError] = useState<string | null>(null);
  const [isLoadingNewMissions, setIsLoadingNewMissions] = useState(false);

  const { maxEnergy, currentEnergy, energyPercent } = useMemo(() => {
    const cap = calculateCapacityWithBoosters(user?.userCapacities, user?.userBoosters);
    const max = Math.max(1, Number(cap.energyPoints) || 1);
    const cur = Math.max(0, Math.min(Number(user?.energyPoints ?? 0) || 0, max));
    return {
      maxEnergy: max,
      currentEnergy: cur,
      energyPercent: Math.min(100, (cur / max) * 100),
    };
  }, [user?.energyPoints, user?.userCapacities, user?.userBoosters]);

  const resolvedActiveMissionDto = useMemo(
    () =>
      mergeActiveMissionDtoWithUserMissions(
        user?.currentActivity?.mission as AvailableMissionDto | undefined,
        user?.missions as AvailableMissionDto[] | undefined
      ),
    [user?.currentActivity?.mission, user?.missions]
  );

  const missionRows: FrontendMission[] = useMemo(() => {
    const list = user?.missions;
    if (!list?.length) return [];
    return list.map((m) => {
      const dto = m as AvailableMissionDto;
      const row = availableMissionToFrontendRow(dto, t);
      const hasExplicitBase = dto.baseGoldReward != null && dto.baseExpReward != null;
      if (!hasExplicitBase) return row;
      return {
        ...row,
        gold: Math.round(Number(dto.baseGoldReward ?? 0)),
        xp: Math.round(Number(dto.baseExpReward ?? 0)),
      };
    });
  }, [user?.missions, t]);

  const activeMission: ActiveMissionState | null = useMemo(() => {
    const ca = user?.currentActivity;
    if (!ca?.mission || !ca.startTime) return null;
    const row = availableMissionToFrontendRow(ca.mission as AvailableMissionDto, t);
    return {
      mission: row,
      startedAtMs: new Date(ca.startTime).getTime(),
    };
  }, [user?.currentActivity, t]);

  const missionRewardsWithBooster = useMemo(() => {
    if (!activeMission || !resolvedActiveMissionDto) return null;
    return missionRewardsWithShipAndShop(shopBoosterEntries, nowMs, resolvedActiveMissionDto);
  }, [activeMission, resolvedActiveMissionDto, shopBoosterEntries, nowMs]);

  const missionDisplayRow = useMemo(() => {
    if (!activeMission || !resolvedActiveMissionDto) return null;
    const dto = resolvedActiveMissionDto;
    const row = activeMission.mission;
    const hasExplicitBase = dto.baseGoldReward != null && dto.baseExpReward != null;
    if (!hasExplicitBase) return row;
    return {
      ...row,
      gold: Math.round(Number(dto.baseGoldReward ?? 0)),
      xp: Math.round(Number(dto.baseExpReward ?? 0)),
    };
  }, [activeMission, resolvedActiveMissionDto]);

  const missionShipGoldExtra = useMemo(() => {
    if (!activeMission || !resolvedActiveMissionDto) return undefined;
    const dto = resolvedActiveMissionDto;
    if (dto.baseGoldReward == null || dto.baseExpReward == null) return undefined;
    const { goldAfterShip } = missionGoldExpAfterShip(dto);
    const baseG = Math.round(Number(dto.baseGoldReward ?? 0));
    const d = Math.max(0, goldAfterShip - baseG);
    return d > 0 ? d : undefined;
  }, [activeMission, resolvedActiveMissionDto]);

  const missionShipExpExtra = useMemo(() => {
    if (!activeMission || !resolvedActiveMissionDto) return undefined;
    const dto = resolvedActiveMissionDto;
    if (dto.baseGoldReward == null || dto.baseExpReward == null) return undefined;
    const { expAfterShip } = missionGoldExpAfterShip(dto);
    const baseE = Math.round(Number(dto.baseExpReward ?? 0));
    const d = Math.max(0, expAfterShip - baseE);
    return d > 0 ? d : undefined;
  }, [activeMission, resolvedActiveMissionDto]);

  const missionBoosterGoldExtra =
    missionRewardsWithBooster != null && missionRewardsWithBooster.goldBonusFlat > 0
      ? missionRewardsWithBooster.goldBonusFlat
      : undefined;

  const missionBoosterExpExtra =
    missionRewardsWithBooster != null && missionRewardsWithBooster.expBonusFlat > 0
      ? missionRewardsWithBooster.expBonusFlat
      : undefined;

  const missionBoosterPercent =
    missionRewardsWithBooster != null ? Math.round(missionRewardsWithBooster.percent) : undefined;

  usePageMeta({
    title: `${t('missions')} | Pirate Hero`,
    description: t('missionsPage.seoDescription', {
      defaultValue:
        'Wybieraj misje, śledź postęp i rozwijaj swojego pirata w Pirate Hero.',
    }),
  });

  useEffect(() => {
    if (!activeMission) return;
    const timerId = window.setInterval(() => setNowMs(Date.now()), 1000);
    return () => window.clearInterval(timerId);
  }, [activeMission]);

  const elapsedMs = activeMission ? nowMs - activeMission.startedAtMs : 0;
  const totalDurationMs = activeMission?.mission.durationMs ?? 1;
  const progress = activeMission ? Math.min((elapsedMs / totalDurationMs) * 100, 100) : 0;
  const remainingMs = Math.max(totalDurationMs - elapsedMs, 0);
  const isCompleted = progress >= 100;

  const startMission = useCallback(
    async (mission: FrontendMission) => {
      setMissionError(null);
      const id = Number(mission.id);
      if (!Number.isFinite(id) || !user) {
        setMissionError(t('apiRequestFailed'));
        return;
      }

      const dto = user.missions?.find((m) => Number(m.id) === id);
      if (!dto) {
        setMissionError(t('apiRequestFailed'));
        return;
      }

      const cost = Number(dto.energyCost ?? 0);
      const rollback: Pick<GameUser, 'energyPoints' | 'currentActivity'> = {
        energyPoints: user.energyPoints,
        currentActivity: user.currentActivity,
      };

      await updateUser({
        energyPoints: Math.max(0, (user.energyPoints ?? 0) - cost),
        currentActivity: {
          startTime: new Date().toISOString(),
          mission: dto,
        },
      });

      if (dto.baseGoldReward != null && dto.baseExpReward != null) {
        writeMissionStartBasesSnapshot({
          id: String(dto.id ?? ''),
          baseGoldReward: Math.round(Number(dto.baseGoldReward)),
          baseExpReward: Math.round(Number(dto.baseExpReward)),
        });
      }

      const result = await startGameMission(id);
      if (result.ok === false) {
        await updateUser(rollback);
        clearMissionStartBasesSnapshot();
        setMissionError(result.message);
        return;
      }
      void fetchUserData();
    },
    [fetchUserData, t, updateUser, user]
  );

  const confirmCancelMission = useCallback(async () => {
    if (!activeMission || !user) return;
    setMissionError(null);
    const id = Number(activeMission.mission.id);

    const rollback: Pick<GameUser, 'energyPoints' | 'currentActivity'> = {
      energyPoints: user.energyPoints,
      currentActivity: user.currentActivity,
    };

    const cap = calculateCapacityWithBoosters(user.userCapacities, user.userBoosters);
    const max = Math.max(1, Number(cap.energyPoints) || 1);
    const refund = Number(
      (user.currentActivity?.mission as AvailableMissionDto | undefined)?.energyCost ??
        activeMission.mission.energy
    );

    await updateUser({
      energyPoints: Math.max(0, Math.min((user.energyPoints ?? 0) + refund, max)),
      currentActivity: undefined,
    });
    setCancelModalOpen(false);

    const result = await cancelGameMission(id);
    if (result.ok === false) {
      await updateUser(rollback);
      setMissionError(result.message);
      return;
    }
    clearMissionStartBasesSnapshot();
    void fetchUserData();
  }, [activeMission, fetchUserData, updateUser, user]);

  const claimMissionReward = useCallback(async () => {
    if (!activeMission || !user || isLoadingNewMissions) return;
    setMissionError(null);
    const id = Number(activeMission.mission.id);

    const preSnapshot: GameUser = {
      ...user,
      missions: user.missions ? [...user.missions] : undefined,
    };

    const merged = mergeActiveMissionDtoWithUserMissions(
      user.currentActivity?.mission as AvailableMissionDto | undefined,
      user.missions as AvailableMissionDto[] | undefined
    );
    if (!merged) return;
    const missionBoosterRewards = missionRewardsWithShipAndShop(shopBoosterEntries, Date.now(), merged);

    setIsLoadingNewMissions(true);
    try {
      await updateUser({
        currentActivity: undefined,
        gold: (user.gold ?? 0) + missionBoosterRewards.boostedGold,
        experiencePoints: (user.experiencePoints ?? 0) + missionBoosterRewards.boostedExp,
        missions: [],
      });

      const result = await completeGameMission(id);
      if (result.ok === false) {
        await updateUser({
          currentActivity: preSnapshot.currentActivity,
          missions: preSnapshot.missions,
          gold: preSnapshot.gold,
          experiencePoints: preSnapshot.experiencePoints,
          level: preSnapshot.level,
          freeSkillPointsAvailable: preSnapshot.freeSkillPointsAvailable,
          diamonds: preSnapshot.diamonds,
        });
        setMissionError(result.message);
        return;
      }

      clearMissionStartBasesSnapshot();

      const apiGold = Number(result.data.earnedGold ?? 0);
      const apiExp = Number(result.data.earnedExp ?? 0);
      await updateUser(
        applyMissionCompleteToUser(preSnapshot, {
          ...result.data,
          earnedGold: apiGold,
          earnedExp: apiExp,
        })
      );

      const apiLevel = result.data.newLevel;
      const optimisticLevelUp = calculateLevelUp(
        preSnapshot.level,
        preSnapshot.experiencePoints || 0,
        apiExp > 0 ? apiExp : missionBoosterRewards.boostedExp
      );
      const leveledUp =
        (apiLevel != null && apiLevel.name != null) || Boolean(optimisticLevelUp);

      if (SHOW_LEVEL_UP_MODAL_ON_MISSION_CLAIM && leveledUp) {
        const name = String(apiLevel?.name ?? optimisticLevelUp?.name ?? '');
        const expToNext = Number(
          apiLevel?.expToNextLevel ??
            optimisticLevelUp?.expToNextLevel ??
            preSnapshot.level?.expToNextLevel ??
            100
        );
        if (name) {
          setLevelUpInfo({ name, expToNextLevel: expToNext });
          setLevelUpModalOpen(true);
        }
      }

      const uid = preSnapshot.id;
      void queryClient.invalidateQueries({ queryKey: queryKeys.userQuests(uid) });
      void fetchUserData();

      const unclaimed = result.data.unclaimedCount;
      if (onQuestsUpdated && typeof unclaimed === 'number') {
        void onQuestsUpdated(unclaimed);
      }
    } finally {
      setIsLoadingNewMissions(false);
    }
  }, [
    activeMission,
    fetchUserData,
    isLoadingNewMissions,
    onQuestsUpdated,
    queryClient,
    shopBoosterEntries,
    updateUser,
    user,
  ]);

  const skipMissionWithDiamonds = useCallback(async () => {
    if (!activeMission || !user || isLoadingNewMissions || isCompleted) return;
    const cost = missionSkipDiamondCost(remainingMs);
    if (cost <= 0 || (user.diamonds ?? 0) < cost) {
      setMissionError(t('notEnoughDiamonds'));
      return;
    }

    setMissionError(null);
    const id = Number(activeMission.mission.id);
    const preDiamonds = user.diamonds ?? 0;
    const preActivity = user.currentActivity;

    setIsLoadingNewMissions(true);
    try {
      const completedStartIso = new Date(
        Date.now() - (activeMission.mission.durationMs || 0)
      ).toISOString();

      await updateUser({
        diamonds: Math.max(0, preDiamonds - cost),
        currentActivity: preActivity
          ? { ...preActivity, startTime: completedStartIso }
          : preActivity,
      });

      const result = await skipGameMission(id);
      if (result.ok === false) {
        await updateUser({
          diamonds: preDiamonds,
          currentActivity: preActivity,
        });
        setMissionError(result.message);
        return;
      }

      await updateUser({
        diamonds: Number(result.data.diamonds ?? Math.max(0, preDiamonds - cost)),
        currentActivity: preActivity
          ? {
              ...preActivity,
              startTime: result.data.startTime || completedStartIso,
            }
          : preActivity,
      });
      setNowMs(Date.now());
      void fetchUserData();
    } finally {
      setIsLoadingNewMissions(false);
    }
  }, [
    activeMission,
    fetchUserData,
    isCompleted,
    isLoadingNewMissions,
    remainingMs,
    t,
    updateUser,
    user,
  ]);

  const skipDiamondCost = missionSkipDiamondCost(remainingMs);
  const canAffordSkip = (user?.diamonds ?? 0) >= skipDiamondCost && skipDiamondCost > 0;

  const closeLevelUpModal = useCallback(() => {
    setLevelUpModalOpen(false);
    setLevelUpInfo(null);
  }, []);

  const handleLevelUpDistributePoints = useCallback(() => {
    navigate('/game/character');
    closeLevelUpModal();
  }, [navigate, closeLevelUpModal]);

  const openCancelModal = useCallback(() => setCancelModalOpen(true), []);

  const {
    refillInfo,
    confirmOpen: energyRefillConfirmOpen,
    successOpen: energyRefillSuccessOpen,
    error: energyRefillError,
    openConfirm: openEnergyRefillConfirm,
    closeConfirm: closeEnergyRefillConfirm,
    closeSuccess: closeEnergyRefillSuccess,
    executeRefill: executeEnergyRefill,
    canRefill: canEnergyRefill,
    allRefillsUsed: allEnergyRefillsUsed,
    userGold,
    plusButtonDisabled: energyRefillPlusDisabled,
    plusTooltipLabel: energyRefillPlusTooltip,
  } = useEnergyRefill();

  const energyRefillConfirmDisabled =
    !refillInfo ||
    !canEnergyRefill ||
    (refillInfo != null && userGold < refillInfo.nextRefillCost) ||
    Boolean(refillInfo?.hasActiveMission);

  const energyRefillConfirmLabel =
    refillInfo != null
      ? `${t('refill')} (${refillInfo.nextRefillCost} ${t('gold')})`
      : t('energyRefillInfoLoading');

  return {
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
    skipMissionWithDiamonds,
    skipDiamondCost,
    canAffordSkip,
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
  };
}
