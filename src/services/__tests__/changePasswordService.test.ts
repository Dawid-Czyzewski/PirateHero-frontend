import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import config from '@/config/env';
import { changePassword } from '@/services/changePasswordService';
const url = `${config.backendUrl}/account/change-password`;

const server = setupServer(
  http.post(url, async ({ request }) => {
    const body = (await request.json()) as {
      currentPassword?: string;
      newPassword?: string;
      newPasswordRepeat?: string;
    };
    if (body.currentPassword === 'bad') {
      return HttpResponse.json(
        { type: 'about:blank', title: 'Bad Request', status: 400, detail: 'changePasswordCurrentWrong' },
        { status: 400, headers: { 'Content-Type': 'application/problem+json; charset=utf-8' } }
      );
    }
    return HttpResponse.json(
      { data: { changed: true }, meta: { message: 'passwordChangedSuccessfully' } },
      { status: 200 }
    );
  })
);

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' });
});
afterEach(() => {
  server.resetHandlers();
  localStorage.clear();
});
afterAll(() => {
  server.close();
});

describe('changePasswordService', () => {
  it('posts payload and resolves on success envelope', async () => {
    localStorage.setItem('token', 'test-jwt');
    await expect(
      changePassword({
        currentPassword: 'ok',
        newPassword: 'newpass9',
        newPasswordRepeat: 'newpass9',
      })
    ).resolves.toBeUndefined();
  });

  it('throws ApiHttpError with detail message on problem+json', async () => {
    localStorage.setItem('token', 'test-jwt');
    await expect(
      changePassword({
        currentPassword: 'bad',
        newPassword: 'newpass9',
        newPasswordRepeat: 'newpass9',
      })
    ).rejects.toMatchObject({
      name: 'ApiHttpError',
      message: 'changePasswordCurrentWrong',
      status: 400,
    });
  });
});
