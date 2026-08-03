import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

export function PlayRedirect() {
  const { isAuthenticated } = useAuth();
  return <Navigate to={isAuthenticated ? '/game/character' : '/auth'} replace />;
}
