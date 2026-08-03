import { useCallback, useMemo, type ReactNode } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query/queryKeys';
import { loadUserProfile } from '@/services/loadUserProfile';
import type { GameUser } from '@/types/gameUser';
import { useAuth } from '@/hooks/useAuth';
import { UserContext, type UserContextValue } from '@/context/userContext';

type UserProviderProps = { children: ReactNode };

export function UserProvider({ children }: UserProviderProps) {
  const { isAuthenticated, logout } = useAuth();
  const queryClient = useQueryClient();
  const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;

  const {
    data: user,
    isFetching,
    isFetched,
    isError,
    isLoading: isQueryLoading,
    refetch,
  } = useQuery({
    queryKey: queryKeys.currentUser(userId),
    queryFn: async () => {
      if (!userId) return null;
      return loadUserProfile(userId, logout);
    },
    enabled: Boolean(isAuthenticated && userId),
    staleTime: 30_000,
  });

  const setUser = useCallback(
    (value: GameUser | null | ((prev: GameUser | null | undefined) => GameUser | null)) => {
      const id = localStorage.getItem('userId');
      if (!id) return;
      queryClient.setQueryData<GameUser | null | undefined>(
        queryKeys.currentUser(id),
        (old) => {
          if (typeof value === 'function') {
            return value(old ?? null);
          }
          return value;
        }
      );
    },
    [queryClient]
  );

  const updateUser = useCallback(
    async (updatedFields: Partial<GameUser>) => {
      const id = localStorage.getItem('userId');
      if (!id) return undefined;
      let next: GameUser | undefined;
      queryClient.setQueryData<GameUser | null | undefined>(
        queryKeys.currentUser(id),
        (old) => {
          if (!old) return old;
          next = { ...old, ...updatedFields } as GameUser;
          return next;
        }
      );
      return next;
    },
    [queryClient]
  );

  const fetchUserData = useCallback(() => refetch(), [refetch]);

  const value = useMemo<UserContextValue>(
    () => ({
      user,
      isLoading: isQueryLoading,
      isFetching,
      isFetched,
      isError,
      setUser,
      fetchUserData,
      updateUser,
    }),
    [user, isQueryLoading, isFetching, isFetched, isError, setUser, fetchUserData, updateUser]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}
