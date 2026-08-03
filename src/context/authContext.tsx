import { createContext } from 'react';

export type AuthContextValue = {
  isAuthenticated: boolean;
  login: (token: string, refreshToken: string, userId: string) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);
