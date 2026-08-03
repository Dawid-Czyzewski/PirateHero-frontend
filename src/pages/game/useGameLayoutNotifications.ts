import { useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchUserQuests } from '@/services/questTaskService';
import { getUnreadNotificationsCount } from '@/services/notificationsService';
import { queryKeys } from '@/lib/query/queryKeys';
import type { GameUser } from '@/types/gameUser';
import type { UserQuestsResponse } from '@/types/userQuests';

export function useGameLayoutNotifications(user: GameUser | null | undefined) {
  const userId = user?.id ?? null;
  const queryClient = useQueryClient();

  const questsQuery = useQuery({
    queryKey: queryKeys.userQuests(userId),
    queryFn: fetchUserQuests,
    enabled: Boolean(userId),
    staleTime: 60_000,
  });

  const notificationsQuery = useQuery({
    queryKey: queryKeys.unreadNotificationsCount(),
    queryFn: getUnreadNotificationsCount,
    enabled: Boolean(user),
    staleTime: 30_000,
    refetchInterval: user ? 30_000 : false,
  });

  const unclaimedRewardsCount = Array.isArray(questsQuery.data?.quests)
    ? questsQuery.data.quests.filter((quest) => Boolean(quest.isCompleted) && !quest.isRewardClaimed)
        .length
    : 0;

  const unreadNotificationsCount = user ? (notificationsQuery.data ?? 0) : 0;

  const checkUnclaimedRewards = useCallback(
    async (unclaimedCountFromBackend?: number) => {
      if (!userId) return;

      if (unclaimedCountFromBackend !== undefined) {
        queryClient.setQueryData<UserQuestsResponse>(
          queryKeys.userQuests(userId),
          (old) => {
            const base = old ?? { quests: [], hasUnclaimedRewards: false };
            const quests = base.quests ?? [];
            const fromFlags = quests.filter((q) => Boolean(q.isCompleted) && !q.isRewardClaimed).length;
            const nextCount =
              quests.length > 0 ? fromFlags : Math.max(0, unclaimedCountFromBackend);
            return {
              ...base,
              hasUnclaimedRewards: nextCount > 0,
              unclaimedCount: nextCount,
            };
          }
        );
        return;
      }

      await queryClient.invalidateQueries({ queryKey: queryKeys.userQuests(userId) });
    },
    [queryClient, userId]
  );

  const checkUnreadNotifications = useCallback(async () => {
    if (!user) return;
    await queryClient.invalidateQueries({ queryKey: queryKeys.unreadNotificationsCount() });
  }, [queryClient, user]);

  return {
    unclaimedRewardsCount,
    unreadNotificationsCount,
    checkUnclaimedRewards,
    checkUnreadNotifications,
  };
}
