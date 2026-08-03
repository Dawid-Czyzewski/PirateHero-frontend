import { getMyShip } from '@/services/shipService';
import {
  getMyFightNotifications,
  getMyInvitations,
  getMyJoinRequests,
  getMyRemovalNotifications,
} from '@/services/notificationsService';

export type ShipNotificationsBundle = {
  invitations: unknown[];
  joinRequests: unknown[];
  removalNotifications: unknown[];
  fightNotifications: unknown[];
  myShip: Awaited<ReturnType<typeof getMyShip>> | null;
};

export async function fetchShipNotificationsBundle(): Promise<ShipNotificationsBundle> {
  const [invitations, joinRequests, removalNotifications, fightNotifications, myShip] =
    await Promise.all([
      getMyInvitations().catch(() => []),
      getMyJoinRequests().catch(() => []),
      getMyRemovalNotifications().catch(() => []),
      getMyFightNotifications().catch(() => []),
      getMyShip().catch(() => null),
    ]);

  return {
    invitations,
    joinRequests,
    removalNotifications,
    fightNotifications,
    myShip,
  };
}
