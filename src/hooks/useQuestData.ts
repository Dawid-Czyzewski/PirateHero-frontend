import { useEffect, useCallback, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { fetchUserQuests } from '@/services/questTaskService';
import { queryKeys } from '@/lib/query/queryKeys';
import type { UserQuest, UserQuestsResponse } from '@/types/userQuests';
import { ApiHttpError } from '@/lib/api/ApiHttpError';

export const useQuestData = (
  user: { id?: string; level?: { name?: string } } | null | undefined
) => {
  const { t } = useTranslation();
  const userId = user?.id ?? null;
  const queryClient = useQueryClient();
  const lastLevelNameRef = useRef<string | null | undefined>(undefined);

  const q = useQuery({
    queryKey: queryKeys.userQuests(userId),
    queryFn: fetchUserQuests,
    enabled: Boolean(userId),
    staleTime: 60_000,
  });

  const data = q.data;
  const quests: UserQuest[] = data?.quests ?? [];
  const hasUnclaimedRewards = data?.hasUnclaimedRewards ?? false;

  useEffect(() => {
    const currentLevelName = user?.level?.name;
    if (!currentLevelName) return;
    if (
      lastLevelNameRef.current != null &&
      lastLevelNameRef.current !== currentLevelName
    ) {
      lastLevelNameRef.current = currentLevelName;
      void q.refetch();
    } else {
      lastLevelNameRef.current = currentLevelName;
    }
  }, [user?.level?.name, q]);

  const updateQuestStatus = useCallback(
    (questId: string | number, updates: Partial<UserQuest>) => {
      if (!userId) return;
      queryClient.setQueryData<UserQuestsResponse>(
        queryKeys.userQuests(userId),
        (old) => {
          if (!old?.quests) {
            return { quests: [], hasUnclaimedRewards: false, ...old };
          }
          return {
            ...old,
            quests: old.quests.map((q) =>
              q.id === questId ? { ...q, ...updates } : q
            ),
          };
        }
      );
    },
    [queryClient, userId]
  );

  const addOrUpdateQuest = useCallback(
    (quest: UserQuest) => {
      if (!userId) return;
      queryClient.setQueryData<UserQuestsResponse>(
        queryKeys.userQuests(userId),
        (old) => {
          const list = old?.quests ?? [];
          const existingIndex = list.findIndex((q) => q.id === quest.id);
          if (existingIndex >= 0) {
            const existingQuest = list[existingIndex];
            const next = [...list];
            const isRewardClaimed =
              existingQuest.isRewardClaimed === true
                ? true
                : Boolean(quest.isRewardClaimed);
            next[existingIndex] = { ...quest, isRewardClaimed };
            return { ...old, quests: next };
          }
          return { ...old, quests: [...list, quest] };
        }
      );
    },
    [queryClient, userId]
  );

  const loadQuests = useCallback(() => {
    void q.refetch();
  }, [q]);

  const errorMessage =
    q.isError
      ? q.error instanceof ApiHttpError
        ? q.error.message
        : q.error instanceof Error
          ? q.error.message
          : t('errorLoadingQuests')
      : null;

  const loading = Boolean(userId) && q.isPending;

  return {
    quests,
    loading,
    error: errorMessage,
    hasUnclaimedRewards,
    loadQuests,
    updateQuestStatus,
    addOrUpdateQuest,
  };
};
