import { Navigate, Outlet, useLocation } from 'react-router-dom';
import type { CurrentActivityDto } from '@/types/currentActivity';
import type { GameOutletContext } from './GameOutletContext';
import { getActivityBlockRedirect } from '@/features/game/navigation/gameNavActivityPolicy';

type Props = {
  context: GameOutletContext;
  currentActivity: CurrentActivityDto | undefined;
};

export function GameActivityOutlet({ context, currentActivity }: Props) {
  const location = useLocation();
  const redirect = getActivityBlockRedirect(location.pathname, currentActivity);

  if (redirect) {
    return <Navigate to={redirect} replace state={{ blockedFrom: location.pathname }} />;
  }

  return <Outlet context={context} />;
}
