import { tryRequestJson } from '@/lib/api/tryRequestJson';
import { normalizePositiveIntForShipApi } from './normalizePositiveIntForShipApi';

export async function joinShip(shipId, fetchUserData, setActionLoading) {
  if (typeof setActionLoading === 'function') setActionLoading(true);
  try {
    const numericShipId = normalizePositiveIntForShipApi(shipId);
    if (numericShipId == null) {
      return { success: false, message: 'Invalid ship ID' };
    }
    const result = await tryRequestJson<{ member?: unknown }>('/ships/join', {
      method: 'POST',
      body: { shipId: numericShipId },
    });
    if (result.ok === false) {
      return { success: false, message: result.message };
    }
    if (typeof fetchUserData === 'function') {
      await fetchUserData();
    }
    return { success: true, member: result.data.member || null };
  } finally {
    if (typeof setActionLoading === 'function') setActionLoading(false);
  }
}

export async function requestToJoinShip(shipId, setActionLoading) {
  if (typeof setActionLoading === 'function') setActionLoading(true);
  try {
    const numericShipId = normalizePositiveIntForShipApi(shipId);
    if (numericShipId == null) {
      return { success: false, message: 'Invalid ship ID' };
    }
    const result = await tryRequestJson<{ request?: unknown }>(
      '/ships/request-to-join',
      {
        method: 'POST',
        body: { shipId: numericShipId },
      }
    );
    if (result.ok === false) {
      return { success: false, message: result.message };
    }
    return { success: true, request: result.data.request || null };
  } finally {
    if (typeof setActionLoading === 'function') setActionLoading(false);
  }
}

export async function cancelJoinRequest(shipId, setActionLoading) {
  if (typeof setActionLoading === 'function') setActionLoading(true);
  try {
    const numericShipId = normalizePositiveIntForShipApi(shipId);
    if (numericShipId == null) {
      return { success: false, message: 'Invalid ship ID' };
    }
    const result = await tryRequestJson('/ships/cancel-join-request', {
      method: 'POST',
      body: { shipId: numericShipId },
    });
    if (result.ok === false) {
      return { success: false, message: result.message };
    }
    return { success: true };
  } finally {
    if (typeof setActionLoading === 'function') setActionLoading(false);
  }
}

export async function cancelInvitation(userId, setActionLoading) {
  if (typeof setActionLoading === 'function') setActionLoading(true);
  try {
    const result = await tryRequestJson('/ships/cancel-invitation', {
      method: 'POST',
      body: { userId },
    });
    if (result.ok === false) {
      return { success: false, message: result.message };
    }
    return { success: true };
  } finally {
    if (typeof setActionLoading === 'function') setActionLoading(false);
  }
}
