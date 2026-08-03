import { tryRequestJson } from '@/lib/api/tryRequestJson';
import type {
  DepositShipSuccessData,
  UpgradeShipSuccessData,
} from '@/types/ship';

export type UpgradeShipResult =
  | { success: true; data: UpgradeShipSuccessData }
  | { success: false; message: string };

export type DepositShipResult =
  | { success: true; data: DepositShipSuccessData }
  | { success: false; message: string };

export async function depositToShip(
  gold,
  diamonds,
  user,
  updateUser,
  setActionLoading
): Promise<DepositShipResult> {
  if (typeof setActionLoading === 'function') setActionLoading(true);
  try {
    const result = await tryRequestJson<DepositShipSuccessData>('/ships/deposit', {
      method: 'POST',
      body: { gold: gold || null, diamonds: diamonds || null },
    });
    if (result.ok === false) {
      return { success: false as const, message: result.message };
    }
    if (typeof updateUser === 'function') {
      await updateUser();
    }
    return { success: true as const, data: result.data };
  } finally {
    if (typeof setActionLoading === 'function') setActionLoading(false);
  }
}

export async function upgradeShip(
  upgradeType: string,
  setActionLoading: unknown,
  fetchUserData: unknown
): Promise<UpgradeShipResult> {
  if (typeof setActionLoading === 'function') setActionLoading(true);
  try {
    const result = await tryRequestJson<UpgradeShipSuccessData>('/ships/upgrade', {
      method: 'POST',
      body: { upgradeType },
    });
    if (result.ok === false) {
      return { success: false as const, message: result.message };
    }
    if (typeof fetchUserData === 'function') {
      await fetchUserData();
    }
    return { success: true as const, data: result.data };
  } finally {
    if (typeof setActionLoading === 'function') setActionLoading(false);
  }
}
