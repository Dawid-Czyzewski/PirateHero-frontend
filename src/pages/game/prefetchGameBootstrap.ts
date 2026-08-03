import type { QueryClient } from '@tanstack/react-query';
import { fetchShipNotificationsBundle } from '@/services/fetchShipNotificationsBundle';
import { fetchDungeonProgress } from '@/services/dungeonService';
import { fetchUserQuests } from '@/services/questTaskService';
import { queryKeys } from '@/lib/query/queryKeys';
import type { GameLoadTaskId } from './gameLoadTasks';
import { prefetchEagerGameRouteChunks } from './prefetchGameActivityChunks';

type BootstrapTaskId = Exclude<GameLoadTaskId, 'user'>;

export async function prefetchGameBootstrap(
  queryClient: QueryClient,
  userId: string,
  onTaskComplete?: (task: BootstrapTaskId) => void
): Promise<void> {
  const complete = (task: BootstrapTaskId) => {
    onTaskComplete?.(task);
  };

  await Promise.all([
    prefetchEagerGameRouteChunks()
      .then(() => complete('chunks'))
      .catch(() => complete('chunks')),
    queryClient
      .prefetchQuery({
        queryKey: queryKeys.dungeonProgress(),
        queryFn: fetchDungeonProgress,
      })
      .then(() => complete('dungeon'))
      .catch(() => complete('dungeon')),
    queryClient
      .prefetchQuery({
        queryKey: queryKeys.userQuests(userId),
        queryFn: fetchUserQuests,
      })
      .then(() => complete('quests'))
      .catch(() => complete('quests')),
    queryClient
      .prefetchQuery({
        queryKey: queryKeys.shipNotifications(),
        queryFn: fetchShipNotificationsBundle,
      })
      .then(() => complete('notifications'))
      .catch(() => complete('notifications')),
  ]);
}
