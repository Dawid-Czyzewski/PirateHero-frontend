import { requestJson } from '@/lib/api/requestJson';

export type ChangePasswordPayload = {
  currentPassword: string;
  newPassword: string;
  newPasswordRepeat: string;
};

export async function changePassword(payload: ChangePasswordPayload): Promise<void> {
  await requestJson<{ changed: boolean }>('/account/change-password', {
    method: 'POST',
    body: {
      currentPassword: payload.currentPassword,
      newPassword: payload.newPassword,
      newPasswordRepeat: payload.newPasswordRepeat,
    },
  });
}
