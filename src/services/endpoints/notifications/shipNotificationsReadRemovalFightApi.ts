import { requestJson } from '@/lib/api/requestJson';
import { normalizePositiveIntForShipApi } from '@/services/endpoints/ship/normalizePositiveIntForShipApi';

type CountPayload = { unreadCount?: number };

export async function getUnreadNotificationsCount() {
  try {
    const data = await requestJson<CountPayload>(
      '/ships/unread-notifications-count',
      { method: 'GET' }
    );
    return data.unreadCount || 0;
  } catch (err) {
    console.error('Get unread notifications count error', err);
    return 0;
  }
}

export async function markInvitationAsRead(invitationId: string | number) {
  const id = normalizePositiveIntForShipApi(invitationId);
  if (id == null) {
    throw new Error('Invalid invitation ID');
  }
  return requestJson<unknown>('/ships/mark-invitation-read', {
    method: 'POST',
    body: { invitationId: id },
  });
}

export async function markJoinRequestAsRead(requestId: string | number) {
  const id = normalizePositiveIntForShipApi(requestId);
  if (id == null) {
    throw new Error('Invalid join request ID');
  }
  return requestJson<unknown>('/ships/mark-join-request-read', {
    method: 'POST',
    body: { requestId: id },
  });
}

export async function getMyRemovalNotifications() {
  const data = await requestJson<{ notifications?: unknown[] }>(
    '/ships/my-removal-notifications',
    { method: 'GET' }
  );
  return data.notifications || [];
}

export async function markRemovalNotificationAsRead(
  notificationId: string | number
) {
  const id = normalizePositiveIntForShipApi(notificationId);
  if (id == null) {
    throw new Error('Invalid notification ID');
  }
  return requestJson<unknown>('/ships/mark-removal-notification-read', {
    method: 'POST',
    body: { notificationId: id },
  });
}

export async function getMyFightNotifications() {
  const data = await requestJson<{ notifications?: unknown[] }>(
    '/ships/my-fight-notifications',
    { method: 'GET' }
  );
  return data.notifications || [];
}

export async function markFightNotificationAsRead(
  notificationId: string | number
) {
  const id = normalizePositiveIntForShipApi(notificationId);
  if (id == null) {
    throw new Error('Invalid notification ID');
  }
  return requestJson<unknown>('/ships/mark-fight-notification-read', {
    method: 'POST',
    body: { notificationId: id },
  });
}
