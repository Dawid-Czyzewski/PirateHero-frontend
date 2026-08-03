import { useState, useEffect, useCallback, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { clearAuthStorage, hasAuthTokens } from '@/lib/session';
import { queryKeys } from '@/lib/query/queryKeys';
import { AuthContext, type AuthContextValue } from '@/context/authContext';

type AuthProviderProps = { children: ReactNode };

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    setIsAuthenticated(hasAuthTokens());
  }, []);

  const logout = useCallback(() => {
    clearAuthStorage();
    queryClient.removeQueries({ queryKey: queryKeys.currentUserRoot() });
    setIsAuthenticated(false);
    navigate('/');
  }, [navigate, queryClient]);

  const login = useCallback(
    (token: string, refreshToken: string, userId: string) => {
      localStorage.setItem('token', token);
      localStorage.setItem('userId', userId);
      localStorage.setItem('refreshToken', refreshToken);
      setIsAuthenticated(true);
      queryClient.invalidateQueries({ queryKey: queryKeys.currentUserRoot() });
      navigate('/game/character');
    },
    [navigate, queryClient]
  );

  const value: AuthContextValue = {
    isAuthenticated,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
