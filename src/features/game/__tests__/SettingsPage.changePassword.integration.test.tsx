import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import i18n from '@/i18n';
import config from '@/config/env';
import SettingsPage from '@/features/game/SettingsPage';
import en from '@/locales/en/translation.json';

const toastSuccess = vi.fn();
const toastError = vi.fn();

vi.mock('sonner', () => ({
  toast: {
    success: (msg: string) => toastSuccess(msg),
    error: (msg: string) => toastError(msg),
  },
}));

vi.mock('@/hooks/usePageMeta', () => ({
  usePageMeta: () => {},
}));

const changePasswordUrl = `${config.backendUrl}/account/change-password`;

const server = setupServer(
  http.post(changePasswordUrl, () =>
    HttpResponse.json({ data: { changed: true }, meta: {} }, { status: 200 })
  )
);

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' });
});
afterEach(() => {
  server.resetHandlers();
  vi.clearAllMocks();
});
afterAll(() => {
  server.close();
});

describe('SettingsPage password change (integration)', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('en');
    localStorage.setItem('token', 'test-jwt-token');
  });

  it('calls API and shows success toast when change succeeds', async () => {
    render(
      <I18nextProvider i18n={i18n}>
        <SettingsPage />
      </I18nextProvider>
    );

    fireEvent.change(screen.getByLabelText(en.settingsPage.password.current), {
      target: { value: 'old-secret-9' },
    });
    fireEvent.change(screen.getByLabelText(en.settingsPage.password.new), {
      target: { value: 'new-secret-9' },
    });
    fireEvent.change(screen.getByLabelText(en.settingsPage.password.confirm), {
      target: { value: 'new-secret-9' },
    });

    fireEvent.click(screen.getByRole('button', { name: en.settingsPage.password.submit }));

    await waitFor(() => {
      expect(toastSuccess).toHaveBeenCalledWith(en.settingsPage.password.changedSuccess);
    });
    expect(toastError).not.toHaveBeenCalled();
  });

  it('shows translated error when API returns known detail key', async () => {
    server.use(
      http.post(changePasswordUrl, () =>
        HttpResponse.json(
          {
            type: 'about:blank',
            title: 'Bad Request',
            status: 400,
            detail: 'changePasswordCurrentWrong',
          },
          { status: 400, headers: { 'Content-Type': 'application/problem+json; charset=utf-8' } }
        )
      )
    );

    render(
      <I18nextProvider i18n={i18n}>
        <SettingsPage />
      </I18nextProvider>
    );

    fireEvent.change(screen.getByLabelText(en.settingsPage.password.current), {
      target: { value: 'wrong' },
    });
    fireEvent.change(screen.getByLabelText(en.settingsPage.password.new), {
      target: { value: 'new-secret-9' },
    });
    fireEvent.change(screen.getByLabelText(en.settingsPage.password.confirm), {
      target: { value: 'new-secret-9' },
    });

    fireEvent.click(screen.getByRole('button', { name: en.settingsPage.password.submit }));

    await waitFor(() => {
      expect(toastError).toHaveBeenCalledWith(en.changePasswordCurrentWrong);
    });
  });
});
