import type { TFunction } from 'i18next';
import {
  formatFightNotification,
  formatInvitationNotification,
  formatJoinRequestNotification,
  formatRemovalNotification,
} from '@/utils/notificationFormatters';
import type { ShipNotificationsBundle } from '@/services/fetchShipNotificationsBundle';

type NotificationHandlers = {
  onAcceptInvitation: (invitationId: string | number, shipId?: string | number) => void | Promise<void>;
  onDeclineInvitation: (invitationId: string | number) => void | Promise<void>;
  onApproveJoinRequest: (requestId: string | number) => void | Promise<void>;
  onRejectJoinRequest: (requestId: string | number) => void | Promise<void>;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object';
}

function getCreatedAtTime(value: unknown): number {
  if (!isRecord(value)) {
    return 0;
  }
  const createdAt = value.createdAt;
  if (typeof createdAt !== 'string' || createdAt.trim() === '') {
    return 0;
  }
  const time = new Date(createdAt).getTime();
  return Number.isNaN(time) ? 0 : time;
}

export function buildShipNotificationsList(
  bundle: ShipNotificationsBundle,
  t: TFunction,
  handlers: NotificationHandlers
): unknown[] {
  const myShipId = bundle.myShip?.ship?.id || null;
  const myShipMembers = bundle.myShip?.members || [];
  const myShipMemberIds = new Set(myShipMembers.map((m) => m.user.id));
  const formattedNotifications: unknown[] = [];

  for (const inv of bundle.invitations) {
    formattedNotifications.push(
      formatInvitationNotification(
        inv,
        myShipId,
        t,
        handlers.onAcceptInvitation,
        handlers.onDeclineInvitation
      )
    );
  }

  for (const req of bundle.joinRequests) {
    formattedNotifications.push(
      formatJoinRequestNotification(
        req,
        myShipId,
        myShipMemberIds,
        t,
        handlers.onApproveJoinRequest,
        handlers.onRejectJoinRequest
      )
    );
  }

  for (const notif of bundle.removalNotifications) {
    formattedNotifications.push(formatRemovalNotification(notif, t));
  }

  for (const notif of bundle.fightNotifications) {
    formattedNotifications.push(formatFightNotification(notif, t));
  }

  formattedNotifications.sort((a, b) => getCreatedAtTime(b) - getCreatedAtTime(a));

  return formattedNotifications;
}
