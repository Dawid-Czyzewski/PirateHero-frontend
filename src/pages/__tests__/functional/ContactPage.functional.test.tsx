import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n';
import ContactPage from '@/pages/ContactPage';

function renderContactPage() {
  return render(
    <MemoryRouter initialEntries={['/contact']}>
      <I18nextProvider i18n={i18n}>
        <Routes>
          <Route path="/contact" element={<ContactPage />} />
        </Routes>
      </I18nextProvider>
    </MemoryRouter>
  );
}

describe('ContactPage (functional)', () => {
  beforeEach(() => {
    document.title = 'Pirate Hero';
    let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'description');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', 'default');
  });

  it('renders heading, contact form and support email', () => {
    renderContactPage();
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    expect(screen.getByRole('form', { name: /contact form|formularz kontaktowy/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /support@piratehero\.com/i })).toBeInTheDocument();
  });

  it('sets document title and meta description for SEO', () => {
    renderContactPage();
    expect(document.title).toMatch(/Pirate Hero/i);
    expect(document.title).toMatch(/contact|kontakt/i);
    const meta = document.querySelector('meta[name="description"]');
    expect(meta?.getAttribute('content')?.length).toBeGreaterThan(20);
    expect(meta?.getAttribute('content')).toMatch(/Pirate Hero/i);
  });
});
