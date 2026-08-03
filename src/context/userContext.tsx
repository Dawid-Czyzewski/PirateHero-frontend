import { createContext } from 'react';
import type { GameUser } from '@/types/gameUser';

export type UserContextValue = {
  user: GameUser | null | undefined;
  isLoading: boolean;
  isFetching: boolean;
  isFetched: boolean;
  isError: boolean;
  setUser: (
    value: GameUser | null | ((prev: GameUser | null | undefined) => GameUser | null)
  ) => void;
  fetchUserData: () => Promise<unknown>;
  updateUser: (updatedFields: Partial<GameUser>) => Promise<GameUser | undefined>;
};

export const UserContext = createContext<UserContextValue | undefined>(undefined);
