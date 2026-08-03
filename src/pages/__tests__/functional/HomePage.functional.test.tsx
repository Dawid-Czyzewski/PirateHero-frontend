import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { beforeEach, describe, expect, it } from 'vitest';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n';
import { AuthProvider } from '@/context/AuthProvider';
import HomePage from '@/pages/HomePage';

function renderHomePage(initialPath = '/') {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={qc}>
      <MemoryRouter initialEntries={[initialPath]}>
        <AuthProvider>
          <I18nextProvider i18n={i18n}>
            <Routes>
              <Route path="/" element={<HomePage />} />
            </Routes>
          </I18nextProvider>
        </AuthProvider>
      </MemoryRouter>
    </QueryClientProvider>
  );
}

describe('HomePage (functional)', () => {
  beforeEach(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userId');
    document.title = 'Pirate Hero';
    let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'description');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', 'default');
  });

  it('renders hero title, play and learn-more links for guests', () => {
    renderHomePage();
    expect(screen.getByRole('heading', { level: 1, name: /pirate hero/i })).toBeInTheDocument();

    expect(
      screen.getByRole('link', { name: /zagraj teraz|play now/i })
    ).toHaveAttribute('href', '/zagraj');

    expect(
      screen.getByRole('link', { name: /dowiedz się więcej|learn more/i })
    ).toHaveAttribute('href', '/o-grze');
  });

  it('sets document title, meta description and Open Graph tags for SEO', () => {
    renderHomePage();
    expect(document.title).toMatch(/Pirate Hero/i);
    expect(document.title.length).toBeGreaterThan(12);
    const meta = document.querySelector('meta[name="description"]');
    expect(meta?.getAttribute('content')?.length).toBeGreaterThan(40);
    expect(meta?.getAttribute('content')).toMatch(/Pirate Hero|browser|przeglądark/i);

    const ogTitle = document.querySelector('meta[property="og:title"]');
    expect(ogTitle?.getAttribute('content')).toMatch(/Pirate Hero/i);
    const ogDesc = document.querySelector('meta[property="og:description"]');
    expect(ogDesc?.getAttribute('content')?.length).toBeGreaterThan(30);
  });

  it('shows go-to-game label on primary CTA when authenticated', async () => {
    localStorage.setItem('token', 'test-token');
    localStorage.setItem('userId', '1');
    localStorage.setItem('refreshToken', 'r');
    renderHomePage();

    await waitFor(() => {
      expect(
        screen.getByRole('link', { name: /go to game|idź do gry/i })
      ).toHaveAttribute('href', '/zagraj');
    });
  });
});
