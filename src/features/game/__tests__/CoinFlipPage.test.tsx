import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n';
import CoinFlipPage from '@/features/game/CoinFlipPage';
import en from '@/locales/en/translation.json';

const usePageMetaMock = vi.fn();

vi.mock('@/hooks/usePageMeta', () => ({
  usePageMeta: (...args: unknown[]) => usePageMetaMock(...args),
}));

const fetchUserDataMock = vi.fn().mockResolvedValue(undefined);
const setUserMock = vi.hoisted(() => vi.fn());

vi.mock('@/hooks/useUser', () => ({
  useUser: () => ({
    user: { id: 'u1', gold: 0, diamonds: 100 },
    updateUser: vi.fn(),
    fetchUserData: fetchUserDataMock,
    setUser: setUserMock,
    isLoading: false,
    isError: false,
  }),
}));

const playCoinFlipMock = vi.fn();

vi.mock('@/services/coinFlipService', () => ({
  playCoinFlip: (...args: unknown[]) => playCoinFlipMock(...args),
}));

function renderCoinFlipPage() {
  return render(
    <I18nextProvider i18n={i18n}>
      <CoinFlipPage />
    </I18nextProvider>
  );
}

describe('CoinFlipPage', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('en');
    vi.clearAllMocks();
  });

  it('sets page meta from translations', () => {
    renderCoinFlipPage();
    expect(usePageMetaMock).toHaveBeenCalledWith(
      expect.objectContaining({
        title: en.coinFlipPage.seoTitle,
        description: en.coinFlipPage.seoDescription,
        openGraph: true,
      })
    );
  });

  it('does not call API when flip is clicked without choosing a side', async () => {
    renderCoinFlipPage();
    const flip = screen.getByRole('button', { name: en.coinFlipPage.flip });
    expect(flip).toBeDisabled();
    expect(playCoinFlipMock).not.toHaveBeenCalled();
  });

  it('calls play with stake and choice, then shows win message', async () => {
    playCoinFlipMock.mockResolvedValue({
      won: true,
      outcome: 'heads',
      diamondsAfter: 105,
      payoutDiamonds: 10,
    });
    renderCoinFlipPage();

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: en.coinFlipPage.heads }));
    });

    const flip = screen.getByRole('button', { name: en.coinFlipPage.flip });
    expect(flip).not.toBeDisabled();

    await act(async () => {
      fireEvent.click(flip);
    });

    await waitFor(() =>
      expect(playCoinFlipMock).toHaveBeenCalledWith(1, 'heads')
    );
    expect(setUserMock).toHaveBeenCalled();
    expect(await screen.findByText(/You won 10 diamonds/i)).toBeInTheDocument();
    expect(fetchUserDataMock).toHaveBeenCalled();
  });
});
