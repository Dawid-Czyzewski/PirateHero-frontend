import { useCallback, useEffect, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { useUser } from '@/hooks/useUser';
import {
  createInitialGameLoadTasks,
  gameLoadProgressPercent,
  isGameLoadComplete,
  type GameLoadTaskId,
} from './gameLoadTasks';
import { prefetchGameBootstrap } from './prefetchGameBootstrap';

export function useGameLoadProgress(userId: string | null | undefined) {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();
  const { user, isFetching, isFetched, isError, fetchUserData } = useUser();
  const [tasks, setTasks] = useState(createInitialGameLoadTasks);
  const [initialLoadDone, setInitialLoadDone] = useState(false);
  const bootstrapStartedRef = useRef(false);

  const canLoadGame = Boolean(isAuthenticated && userId);

  const profileReadyForGame =
    isFetched && (user != null || (!isFetching && isError));

  const markTask = useCallback((taskId: GameLoadTaskId) => {
    setTasks((prev) => (prev[taskId] ? prev : { ...prev, [taskId]: true }));
  }, []);

  useEffect(() => {
    bootstrapStartedRef.current = false;
    setInitialLoadDone(false);
    setTasks(createInitialGameLoadTasks());
  }, [userId]);

  useEffect(() => {
    if (profileReadyForGame) {
      markTask('user');
    }
  }, [profileReadyForGame, markTask]);

  useEffect(() => {
    if (!canLoadGame || bootstrapStartedRef.current) {
      return;
    }

    bootstrapStartedRef.current = true;

    let cancelled = false;

    void prefetchGameBootstrap(queryClient, userId!, (task) => {
      if (!cancelled) {
        markTask(task);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [canLoadGame, userId, queryClient, markTask]);

  useEffect(() => {
    if (initialLoadDone) {
      return;
    }
    if (isGameLoadComplete(tasks) && profileReadyForGame) {
      setInitialLoadDone(true);
    }
  }, [tasks, profileReadyForGame, initialLoadDone]);

  const isReady = initialLoadDone;
  const progress = initialLoadDone ? 100 : gameLoadProgressPercent(tasks);

  return {
    progress,
    isReady,
    user,
    isError,
    fetchUserData,
  };
}
