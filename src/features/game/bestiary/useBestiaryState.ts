import { useQuery } from '@tanstack/react-query';
import { fetchBestiary } from '@/services/bestiaryService';
import { queryKeys } from '@/lib/query/queryKeys';
import { BESTIARY_STATIC_ENTRIES } from './bestiaryData';

export function useBestiaryState(userId: string | undefined) {
  const query = useQuery({
    queryKey: queryKeys.bestiary(userId),
    queryFn: fetchBestiary,
    enabled: Boolean(userId),
    staleTime: 30_000,
  });

  const apiMap = new Map(
    (query.data?.entries ?? []).map((entry) => [entry.enemyId, entry])
  );

  const entries = BESTIARY_STATIC_ENTRIES.map((staticEntry) => {
    const apiEntry = apiMap.get(staticEntry.enemyId);
    return {
      ...staticEntry,
      discovered: apiEntry?.discovered ?? false,
      defeatedAt: apiEntry?.defeatedAt ?? null,
    };
  });

  return {
    entries,
    loading: query.isLoading,
    error: query.error,
    reload: query.refetch,
  };
}

export type BestiaryEntryView = ReturnType<typeof useBestiaryState>['entries'][number];
