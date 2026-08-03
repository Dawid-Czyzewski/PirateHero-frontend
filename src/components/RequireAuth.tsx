import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { hasAuthTokens } from '@/lib/session';

type RequireAuthProps = {
  children: ReactNode;
  redirectTo: string;
};

export default function RequireAuth({ children, redirectTo }: RequireAuthProps) {
  if (!hasAuthTokens()) {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
}
