import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { hasAuthTokens } from '@/lib/session';

type RedirectIfAuthenticatedProps = {
  children: ReactNode;
  redirectTo: string;
};

export default function RedirectIfAuthenticated({
  children,
  redirectTo,
}: RedirectIfAuthenticatedProps) {
  if (hasAuthTokens()) {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
}
