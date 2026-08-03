import { requestJson } from '@/lib/api/requestJson';
import { normalizePositiveIntForShipApi } from '@/services/endpoints/ship/normalizePositiveIntForShipApi';

type InvitationsPayload = { invitations?: unknown[] };
type MessagePayload = { message?: string; shipId?: string | number };

export async function getMyInvitations() {
  const data = await requestJson<InvitationsPayload>('/ships/my-invitations', {
    method: 'GET',
  });
  return data.invitations || [];
}

export async function acceptInvitation(invitationId: string | number) {
  const id = normalizePositiveIntForShipApi(invitationId);
  if (id == null) {
    throw new Error('Invalid invitation ID');
  }
  return requestJson<MessagePayload>('/ships/accept-invitation', {
    method: 'POST',
    body: { invitationId: id },
  });
}

export async function declineInvitation(invitationId: string | number) {
  const id = normalizePositiveIntForShipApi(invitationId);
  if (id == null) {
    throw new Error('Invalid invitation ID');
  }
  return requestJson<MessagePayload>('/ships/decline-invitation', {
    method: 'POST',
    body: { invitationId: id },
  });
}

export async function getMyJoinRequests() {
  const data = await requestJson<{ joinRequests?: unknown[] }>(
    '/ships/my-join-requests',
    { method: 'GET' }
  );
  return data.joinRequests || [];
}

export async function approveJoinRequest(requestId: string | number) {
  const id = normalizePositiveIntForShipApi(requestId);
  if (id == null) {
    throw new Error('Invalid join request ID');
  }
  return requestJson<MessagePayload>('/ships/approve-join-request', {
    method: 'POST',
    body: { requestId: id },
  });
}

export async function rejectJoinRequest(requestId: string | number) {
  const id = normalizePositiveIntForShipApi(requestId);
  if (id == null) {
    throw new Error('Invalid join request ID');
  }
  return requestJson<MessagePayload>('/ships/reject-join-request', {
    method: 'POST',
    body: { requestId: id },
  });
}
