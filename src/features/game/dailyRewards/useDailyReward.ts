import { useCallback, useEffect, useRef, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { claimDailyReward, fetchDailyRewardStatus } from '@/services/dailyRewardService';
import { useUser } from '@/hooks/useUser';
import type { GameUser, GameUserLevel } from '@/types/gameUser';
import { ApiHttpError } from '@/lib/api/ApiHttpError';
import { resolveNewLevelForModal } from '@/features/game/questTasks/resolveQuestClaimLevelUp';
import { patchUserFromRewardResponse } from '@/lib/game/patchUserFromRewardResponse';
import { queryKeys } from '@/lib/query/queryKeys';
import {
  applyDailyRewardEntryOptimistic,
  buildOptimisticDailyRewardStatus,
  levelUpFromOptimisticExp,
} from './applyDailyRewardOptimistic';

export function useDailyReward(enabled: boolean) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { user, updateUser, fetchUserData } = useUser();
  const [isModalOpen, setModalOpen] = useState(false);
  const [claimError, setClaimError] = useState<string | null>(null);
  const [isClaiming, setIsClaiming] = useState(false);
  const [levelUpLevel, setLevelUpLevel] = useState<GameUserLevel | null>(null);
  const [isLevelUpOpen, setLevelUpOpen] = useState(false);
  const levelUpShownRef = useRef(false);
  const claimInFlightRef = useRef(false);

  const { data: status } = useQuery({
    queryKey: queryKeys.dailyReward(),
    queryFn: fetchDailyRewardStatus,
    enabled,
    staleTime: 60_000,
  });

  useEffect(() => {
    if (status?.canClaim) {
      setModalOpen(true);
      return;
    }
    setModalOpen(false);
  }, [status?.canClaim]);

  const closeModal = useCallback(() => setModalOpen(false), []);

  const handleClaim = useCallback(async () => {
    if (!status?.canClaim || !user || claimInFlightRef.current || isClaiming) {
      return;
    }

    claimInFlightRef.current = true;
    setIsClaiming(true);

    const reward = status.todayReward.rewards[0];
    if (!reward) {
      return;
    }

    const snapshotUser = user;
    const snapshotStatus = status;
    const levelBefore = user.level;

    setClaimError(null);
    levelUpShownRef.current = false;

    const optimisticStatus = buildOptimisticDailyRewardStatus(status);
    queryClient.setQueryData(queryKeys.dailyReward(), optimisticStatus);
    setModalOpen(false);

    const { updatedUser, levelUpResult } = applyDailyRewardEntryOptimistic(user, reward);
    let optimisticLevelUp = null;
    if (reward.type !== 'item') {
      await updateUser(patchUserFromRewardResponse(updatedUser));
      optimisticLevelUp = levelUpFromOptimisticExp(levelUpResult);
      if (optimisticLevelUp) {
        levelUpShownRef.current = true;
        setLevelUpLevel(optimisticLevelUp);
        setLevelUpOpen(true);
      }
    }

    void claimDailyReward()
      .then(async (result) => {
        await updateUser(patchUserFromRewardResponse(result.updatedUser));
        queryClient.setQueryData(queryKeys.dailyReward(), result.status);

        const serverLevelUp = resolveNewLevelForModal(
          { newLevel: result.newLevel },
          optimisticLevelUp,
          levelBefore,
          result.updatedUser
        );

        if (serverLevelUp && !levelUpShownRef.current) {
          levelUpShownRef.current = true;
          setLevelUpLevel(serverLevelUp);
          setLevelUpOpen(true);
        }

        if (optimisticLevelUp || serverLevelUp || result.newLevel) {
          await fetchUserData();
        }
      })
      .catch((error: unknown) => {
        queryClient.setQueryData(queryKeys.dailyReward(), snapshotStatus);
        void updateUser(snapshotUser);
        setClaimError(
          error instanceof ApiHttpError ? t('dailyReward.claimError') : t('dailyReward.claimError')
        );
        setModalOpen(true);
      })
      .finally(() => {
        claimInFlightRef.current = false;
        setIsClaiming(false);
      });
  }, [fetchUserData, isClaiming, queryClient, status, t, updateUser, user]);

  return {
    status,
    isModalOpen,
    closeModal,
    claimError,
    handleClaim,
    isClaiming,
    levelUpLevel,
    isLevelUpOpen,
    closeLevelUp: () => {
      setLevelUpOpen(false);
      levelUpShownRef.current = false;
    },
  };
}
