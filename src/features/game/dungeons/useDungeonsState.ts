import { useCallback, useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ApiHttpError } from '@/lib/api/ApiHttpError';
import { queryKeys } from '@/lib/query/queryKeys';
import { fetchDungeonProgress, type DungeonProgressPayload } from '@/services/dungeonService';
import { EMPTY_DUNGEON_PROGRESS, type DungeonProgressByDifficulty } from './dungeonTypes';

function secondsFromCooldownFields(
  secondsRemaining: number | undefined,
  until: string | null | undefined
): number {
  const fromSeconds = Math.max(0, Math.floor(Number(secondsRemaining ?? 0)));
  if (until) {
    const untilMs = Date.parse(until);
    if (Number.isFinite(untilMs)) {
      return Math.max(0, Math.ceil((untilMs - Date.now()) / 1000));
    }
  }
  return fromSeconds;
}

export function useDungeonsState(userId: string | null | undefined) {
  const queryClient = useQueryClient();

  const q = useQuery({
    queryKey: queryKeys.dungeonProgress(),
    queryFn: fetchDungeonProgress,
    enabled: Boolean(userId),
    staleTime: 60_000,
  });

  const [cooldownSecondsRemaining, setCooldownSecondsRemaining] = useState(0);
  const [cooldownUntil, setCooldownUntil] = useState<string | null>(null);

  useEffect(() => {
    const until = q.data?.cooldownUntil ?? null;
    const next = secondsFromCooldownFields(q.data?.cooldownSecondsRemaining, until);
    setCooldownUntil(until);
    setCooldownSecondsRemaining(next);
  }, [q.data?.cooldownSecondsRemaining, q.data?.cooldownUntil]);

  useEffect(() => {
    if (!cooldownUntil && cooldownSecondsRemaining <= 0) {
      return;
    }
    const id = window.setInterval(() => {
      setCooldownSecondsRemaining((prev) => {
        if (cooldownUntil) {
          const untilMs = Date.parse(cooldownUntil);
          if (Number.isFinite(untilMs)) {
            return Math.max(0, Math.ceil((untilMs - Date.now()) / 1000));
          }
        }
        return Math.max(0, prev - 1);
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [cooldownUntil, cooldownSecondsRemaining > 0]);

  const setProgress = useCallback(
    (progress: DungeonProgressByDifficulty) => {
      queryClient.setQueryData<DungeonProgressPayload>(queryKeys.dungeonProgress(), (old) => {
        if (!old) {
          return old;
        }
        return { ...old, progress };
      });
    },
    [queryClient]
  );

  const applyCooldownFromFight = useCallback(
    (secondsRemaining: number, until: string | null | undefined) => {
      const nextUntil = until ?? null;
      const next = secondsFromCooldownFields(secondsRemaining, nextUntil);
      setCooldownUntil(nextUntil);
      setCooldownSecondsRemaining(next);
      queryClient.setQueryData<DungeonProgressPayload>(queryKeys.dungeonProgress(), (old) => {
        if (!old) {
          return old;
        }
        return {
          ...old,
          cooldownSecondsRemaining: next,
          cooldownUntil: nextUntil,
        };
      });
    },
    [queryClient]
  );

  const clearCooldown = useCallback(() => {
    setCooldownUntil(null);
    setCooldownSecondsRemaining(0);
    queryClient.setQueryData<DungeonProgressPayload>(queryKeys.dungeonProgress(), (old) => {
      if (!old) {
        return old;
      }
      return {
        ...old,
        cooldownSecondsRemaining: 0,
        cooldownUntil: null,
      };
    });
  }, [queryClient]);

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
    progress: q.data?.progress ?? EMPTY_DUNGEON_PROGRESS,
    setProgress,
    playerStats: q.data?.playerStats ?? null,
    cooldownSecondsRemaining,
    applyCooldownFromFight,
    clearCooldown,
    loading: Boolean(userId) && q.isPending,
    error: errorMessage,
    reload,
  };
}
