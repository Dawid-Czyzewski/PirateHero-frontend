import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n';
import SettingsPage from '@/features/game/SettingsPage';
import en from '@/locales/en/translation.json';

const usePageMetaMock = vi.fn();

vi.mock('@/hooks/usePageMeta', () => ({
  usePageMeta: (...args: unknown[]) => usePageMetaMock(...args),
}));

function renderSettings() {
  return render(
    <I18nextProvider i18n={i18n}>
      <SettingsPage />
    </I18nextProvider>
  );
}

describe('SettingsPage', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('en');
    vi.clearAllMocks();
  });

  it('renders title and server section', () => {
    renderSettings();
    expect(screen.getByRole('heading', { level: 1, name: en.settingsPage.title })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: en.settingsPage.server.title })).toBeInTheDocument();
  });

  it('sets page meta from translations', () => {
    renderSettings();
    expect(usePageMetaMock).toHaveBeenCalledWith(
      expect.objectContaining({
        title: en.settingsPage.seoTitle,
        description: en.settingsPage.seoDescription,
        openGraph: true,
      })
    );
  });
});
