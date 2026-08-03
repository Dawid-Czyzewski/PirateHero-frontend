import { tryRequestJson } from '@/lib/api/tryRequestJson';
import type { RemoveMemberSuccessData } from '@/types/ship';

type SetActionLoading = (loading: boolean) => void;
type RefreshUser = () => void | Promise<void>;

function isSetActionLoading(value: unknown): value is SetActionLoading {
  return typeof value === 'function';
}

function isRefreshUser(value: unknown): value is RefreshUser {
  return typeof value === 'function';
}

export async function inviteMember(
  username: string,
  user: unknown,
  updateUser: unknown,
  setActionLoading: unknown
) {
  if (isSetActionLoading(setActionLoading)) setActionLoading(true);
  try {
    const result = await tryRequestJson('/ships/invite-member', {
      method: 'POST',
      body: { username },
    });
    if (result.ok === false) {
      return { success: false as const, message: result.message };
    }
    if (isRefreshUser(updateUser)) {
      await updateUser();
    }
    return { success: true as const };
  } finally {
    if (isSetActionLoading(setActionLoading)) setActionLoading(false);
  }
}

export type RemoveMemberResult =
  | { success: true; data: RemoveMemberSuccessData }
  | { success: false; message: string };

export async function removeMember(
  userId: string | number,
  user: unknown,
  updateUser: unknown,
  setActionLoading: unknown
): Promise<RemoveMemberResult> {
  if (isSetActionLoading(setActionLoading)) setActionLoading(true);
  try {
    const result = await tryRequestJson<RemoveMemberSuccessData>('/ships/remove-member', {
      method: 'POST',
      body: { userId },
    });
    if (result.ok === false) {
      return { success: false as const, message: result.message };
    }
    if (isRefreshUser(updateUser)) {
      await updateUser();
    }
    return { success: true as const, data: result.data };
  } finally {
    if (isSetActionLoading(setActionLoading)) setActionLoading(false);
  }
}

export async function leaveShip(
  user: unknown,
  fetchUserData: unknown,
  setActionLoading: unknown
) {
  if (isSetActionLoading(setActionLoading)) setActionLoading(true);
  try {
    const result = await tryRequestJson('/ships/leave', { method: 'POST' });
    if (result.ok === false) {
      return { success: false as const, message: result.message };
    }
    if (isRefreshUser(fetchUserData)) {
      await fetchUserData();
    }
    return { success: true as const };
  } finally {
    if (isSetActionLoading(setActionLoading)) setActionLoading(false);
  }
}

export async function transferOwnership(
  userId: string | number,
  user: unknown,
  updateUser: unknown,
  setActionLoading: unknown
) {
  if (isSetActionLoading(setActionLoading)) setActionLoading(true);
  try {
    const result = await tryRequestJson('/ships/transfer-ownership', {
      method: 'POST',
      body: { userId },
    });
    if (result.ok === false) {
      return { success: false as const, message: result.message };
    }
    if (isRefreshUser(updateUser)) {
      await updateUser();
    }
    return { success: true as const };
  } finally {
    if (isSetActionLoading(setActionLoading)) setActionLoading(false);
  }
}

export async function changeMemberRole(
  userId: string | number,
  role: string,
  user: unknown,
  updateUser: unknown,
  setActionLoading: unknown
) {
  if (isSetActionLoading(setActionLoading)) setActionLoading(true);
  try {
    const result = await tryRequestJson('/ships/change-member-role', {
      method: 'POST',
      body: { userId, role },
    });
    if (result.ok === false) {
      return { success: false as const, message: result.message };
    }
    if (isRefreshUser(updateUser)) {
      await updateUser();
    }
    return { success: true as const };
  } finally {
    if (isSetActionLoading(setActionLoading)) setActionLoading(false);
  }
}

export async function deleteShip(
  user: unknown,
  updateUser: unknown,
  setActionLoading: unknown
) {
  if (isSetActionLoading(setActionLoading)) setActionLoading(true);
  try {
    const result = await tryRequestJson('/ships/delete', { method: 'POST' });
    if (result.ok === false) {
      return { success: false as const, message: result.message };
    }
    if (isRefreshUser(updateUser)) {
      await updateUser();
    }
    return { success: true as const };
  } finally {
    if (isSetActionLoading(setActionLoading)) setActionLoading(false);
  }
}
