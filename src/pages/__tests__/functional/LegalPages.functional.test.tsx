import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n';
import TermsPage from '@/pages/TermsPage';
import PrivacyPage from '@/pages/PrivacyPage';

function ensureMetaDescription() {
  let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('name', 'description');
    document.head.appendChild(meta);
  }
  meta.setAttribute('content', 'default');
}

function renderLegalPage(path: '/terms' | '/privacy') {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <I18nextProvider i18n={i18n}>
        <Routes>
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
        </Routes>
      </I18nextProvider>
    </MemoryRouter>
  );
}

describe('TermsPage', () => {
  beforeEach(() => {
    document.title = 'Pirate Hero';
    ensureMetaDescription();
  });

  it('renders main heading and cross-link to privacy', () => {
    renderLegalPage('/terms');
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /privacy|polityka/i })).toHaveAttribute('href', '/privacy');
  });

  it('sets SEO title and meta description', () => {
    renderLegalPage('/terms');
    expect(document.title).toMatch(/Pirate Hero/i);
    expect(document.title).toMatch(/terms|regulamin/i);
    const content = document.querySelector('meta[name="description"]')?.getAttribute('content');
    expect(content?.length).toBeGreaterThan(30);
    expect(content).toMatch(/Pirate Hero/i);
  });
});

describe('PrivacyPage', () => {
  beforeEach(() => {
    document.title = 'Pirate Hero';
    ensureMetaDescription();
  });

  it('renders main heading and cross-link to terms', () => {
    renderLegalPage('/privacy');
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /terms|regulamin/i })).toHaveAttribute('href', '/terms');
  });

  it('sets SEO title and meta description', () => {
    renderLegalPage('/privacy');
    expect(document.title).toMatch(/Pirate Hero/i);
    expect(document.title).toMatch(/privacy|prywatno/i);
    const content = document.querySelector('meta[name="description"]')?.getAttribute('content');
    expect(content?.length).toBeGreaterThan(30);
    expect(content).toMatch(/Pirate Hero|dane|data/i);
  });
});
