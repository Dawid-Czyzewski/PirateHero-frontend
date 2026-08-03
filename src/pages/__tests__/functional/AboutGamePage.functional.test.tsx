import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { beforeEach, describe, expect, it } from 'vitest';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n';
import { AuthProvider } from '@/context/AuthProvider';
import AboutGamePage from '@/pages/AboutGamePage';

function renderAboutPage(initialPath = '/o-grze', language: 'pl' | 'en' = 'pl') {
  void i18n.changeLanguage(language);
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={qc}>
      <MemoryRouter initialEntries={[initialPath]}>
        <AuthProvider>
          <I18nextProvider i18n={i18n}>
            <Routes>
              <Route path="/o-grze" element={<AboutGamePage />} />
            </Routes>
          </I18nextProvider>
        </AuthProvider>
      </MemoryRouter>
    </QueryClientProvider>
  );
}

describe('AboutGamePage (functional)', () => {
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

  it('renders hero heading and intro in Polish', () => {
    renderAboutPage('/o-grze', 'pl');
    expect(screen.getByRole('heading', { level: 1, name: /o grze/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /czym jest pirate hero/i })).toBeInTheDocument();
    expect(screen.getByText(/żegluj na misje i zdobywaj sławę/i)).toBeInTheDocument();
  });

  it('renders hero heading in English', () => {
    renderAboutPage('/o-grze', 'en');
    expect(
      screen.getByRole('heading', { level: 1, name: /about the game/i })
    ).toBeInTheDocument();
  });

  it('links play CTA to /zagraj', () => {
    renderAboutPage();
    expect(screen.getByRole('link', { name: /zagraj za darmo/i })).toHaveAttribute(
      'href',
      '/zagraj'
    );
  });

  it('sets document title, meta description and Open Graph for SEO', () => {
    renderAboutPage();
    expect(document.title).toMatch(/o grze|pirate hero|about/i);
    expect(document.title.length).toBeGreaterThan(8);
    const meta = document.querySelector('meta[name="description"]');
    expect(meta?.getAttribute('content')?.length).toBeGreaterThan(40);
    expect(meta?.getAttribute('content')).toMatch(/pirate hero|rpg|przeglądark/i);

    const ogTitle = document.querySelector('meta[property="og:title"]');
    expect(ogTitle?.getAttribute('content')?.length).toBeGreaterThan(8);
    const ogDesc = document.querySelector('meta[property="og:description"]');
    expect(ogDesc?.getAttribute('content')?.length).toBeGreaterThan(30);
  });

  it('renders mechanics section', () => {
    renderAboutPage();
    expect(screen.getByRole('heading', { name: /mechaniki rozgrywki/i })).toBeInTheDocument();
  });
});
