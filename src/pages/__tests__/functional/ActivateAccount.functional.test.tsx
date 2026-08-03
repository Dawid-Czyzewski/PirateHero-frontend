import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n';
import ActivateAccount from '@/pages/ActivateAccount';
import { publicRequestUnknown } from '@/lib/api/publicRequestUnknown';
import { ApiHttpError } from '@/lib/api/ApiHttpError';

vi.mock('@/lib/api/publicRequestUnknown', () => ({
  publicRequestUnknown: vi.fn(),
}));

const publicRequestUnknownMock = vi.mocked(publicRequestUnknown);

function renderActivatePage(initialPath = '/activateAccount/test-token') {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={qc}>
      <MemoryRouter initialEntries={[initialPath]}>
        <I18nextProvider i18n={i18n}>
          <Routes>
            <Route path="/activateAccount/:activateToken" element={<ActivateAccount />} />
          </Routes>
        </I18nextProvider>
      </MemoryRouter>
    </QueryClientProvider>
  );
}

describe('ActivateAccount (functional)', () => {
  beforeEach(() => {
    publicRequestUnknownMock.mockReset();
    document.title = 'Pirate Hero';
    let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'description');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', 'default');
  });

  it('shows loading then success state and link to auth', async () => {
    publicRequestUnknownMock.mockResolvedValue(undefined);

    renderActivatePage('/activateAccount/ok-token');

    expect(
      screen.getByRole('heading', { name: /aktywujemy twoje konto|activating your account/i })
    ).toBeInTheDocument();

    expect(
      await screen.findByRole('heading', { name: /konto aktywowane|account activated/i })
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /przejdź do logowania|go to login/i })).toHaveAttribute(
      'href',
      '/auth'
    );
    expect(publicRequestUnknownMock).toHaveBeenCalledWith(
      '/activate-account/ok-token',
      expect.objectContaining({ method: 'GET' })
    );
    expect(publicRequestUnknownMock).toHaveBeenCalledTimes(1);
  });

  it('shows error state and back-to-home link on failed activation', async () => {
    publicRequestUnknownMock.mockRejectedValue(
      new ApiHttpError('invalid', {
        status: 400,
        url: '/activate-account/bad-token',
      })
    );

    renderActivatePage('/activateAccount/bad-token');

    expect(
      await screen.findByRole('heading', {
        name: /nie udało się aktywować konta|couldn't activate your account/i,
      })
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /wróć na stronę główną|back to home/i })).toHaveAttribute(
      'href',
      '/'
    );
    expect(publicRequestUnknownMock).toHaveBeenCalledTimes(1);
  });

  it('sets SEO title and description after successful activation', async () => {
    publicRequestUnknownMock.mockResolvedValue(undefined);

    renderActivatePage('/activateAccount/seo-token');

    await waitFor(() => {
      expect(document.title).toMatch(/konto aktywowane|account activated/i);
    });
    const meta = document.querySelector('meta[name="description"]');
    expect(meta?.getAttribute('content')?.length).toBeGreaterThan(20);
    expect(meta?.getAttribute('content')).toMatch(/Pirate Hero/i);
  });
});
