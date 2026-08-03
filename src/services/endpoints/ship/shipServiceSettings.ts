import { tryRequestJson } from '@/lib/api/tryRequestJson';
import type { ShipSummaryDto, UpdateShipSuccessData } from '@/types/ship';
import { normalizePositiveIntForShipApi } from './normalizePositiveIntForShipApi';

export type CreateShipResult =
  | { success: true; ship: ShipSummaryDto | null }
  | { success: false; message: string };

export async function createShip(
  title,
  description,
  user,
  updateUser,
  setActionLoading
): Promise<CreateShipResult> {
  if (typeof setActionLoading === 'function') setActionLoading(true);
  try {
    const result = await tryRequestJson<{ ship?: ShipSummaryDto | null }>('/ships/create', {
      method: 'POST',
      body: { title, description },
    });
    if (result.ok === false) {
      return { success: false as const, message: result.message };
    }
    if (typeof updateUser === 'function') {
      await updateUser();
    }
    return { success: true as const, ship: result.data.ship ?? null };
  } finally {
    if (typeof setActionLoading === 'function') setActionLoading(false);
  }
}

export async function setInvitationRequired(
  shipId,
  requiresInvitation,
  setActionLoading
) {
  if (typeof setActionLoading === 'function') setActionLoading(true);
  try {
    const numericShipId = normalizePositiveIntForShipApi(shipId);
    if (numericShipId == null) {
      return { success: false as const, message: 'Invalid ship ID' };
    }
    const result = await tryRequestJson<{ requiresInvitation?: boolean }>(
      '/ships/set-invitation-required',
      {
        method: 'POST',
        body: { shipId: numericShipId, requiresInvitation },
      }
    );
    if (result.ok === false) {
      return { success: false as const, message: result.message };
    }
    return {
      success: true as const,
      requiresInvitation: result.data.requiresInvitation,
    };
  } finally {
    if (typeof setActionLoading === 'function') setActionLoading(false);
  }
}

export type UpdateShipResult =
  | { success: true; data: UpdateShipSuccessData }
  | { success: false; message: string };

export async function updateShip(
  title: unknown,
  description: unknown,
  internalNotes: unknown,
  user: unknown,
  updateUser: unknown,
  setActionLoading: unknown
): Promise<UpdateShipResult> {
  if (typeof setActionLoading === 'function') setActionLoading(true);
  try {
    const result = await tryRequestJson<UpdateShipSuccessData>('/ships/update', {
      method: 'POST',
      body: { title, description, internalNotes },
    });
    if (result.ok === false) {
      return { success: false as const, message: result.message };
    }
    return { success: true as const, data: result.data };
  } finally {
    if (typeof setActionLoading === 'function') setActionLoading(false);
  }
}
