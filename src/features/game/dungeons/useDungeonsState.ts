import { useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ApiHttpError } from '@/lib/api/ApiHttpError';
import { queryKeys } from '@/lib/query/queryKeys';
import { fetchDungeonProgress, type DungeonProgressPayload } from '@/services/dungeonService';
import type { DungeonProgress } from './dungeonTypes';

export function useDungeonsState(userId: string | null | undefined) {
  const queryClient = useQueryClient();

  const q = useQuery({
    queryKey: queryKeys.dungeonProgress(),
    queryFn: fetchDungeonProgress,
    enabled: Boolean(userId),
    staleTime: 60_000,
  });

  const setProgress = useCallback(
    (progress: DungeonProgress) => {
      queryClient.setQueryData<DungeonProgressPayload>(queryKeys.dungeonProgress(), (old) => {
        if (!old) {
          return old;
        }
        return { ...old, progress };
      });
    },
    [queryClient]
  );

  const reload = useCallback(() => {
    void q.refetch();
  }, [q]);

  const errorMessage =
    q.isError
      ? q.error instanceof ApiHttpError
        ? q.error.message
        : q.error instanceof Error
          ? q.error.message
          : 'dungeonLoadFailed'
      : null;

  return {
    progress: q.data?.progress ?? {},
    setProgress,
    playerStats: q.data?.playerStats ?? null,
    loading: Boolean(userId) && q.isPending,
    error: errorMessage,
    reload,
  };
}
