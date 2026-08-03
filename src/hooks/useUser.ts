import { useContext } from 'react';
import { UserContext } from '@/context/userContext';
import type { UserContextValue } from '@/context/userContext';

export function useUser(): UserContextValue {
  const ctx = useContext(UserContext);
  if (!ctx) {
    throw new Error('useUser must be used within UserProvider');
  }
  return ctx;
}
