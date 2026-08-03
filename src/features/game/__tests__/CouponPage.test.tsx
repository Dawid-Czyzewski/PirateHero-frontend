import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n';
import CouponPage from '@/features/game/CouponPage';
import type { CouponHistoryEntryDto } from '@/types/coupon';
import en from '@/locales/en/translation.json';

const usePageMetaMock = vi.fn();

vi.mock('@/hooks/usePageMeta', () => ({
  usePageMeta: (...args: unknown[]) => usePageMetaMock(...args),
}));

const fetchUserDataMock = vi.fn().mockResolvedValue(undefined);

vi.mock('@/hooks/useUser', () => ({
  useUser: () => ({
    user: { id: 'u1', gold: 0, diamonds: 0 },
    updateUser: vi.fn(),
    fetchUserData: fetchUserDataMock,
    setUser: vi.fn(),
    isLoading: false,
    isError: false,
  }),
}));

const redeemCouponMock = vi.fn();
const getCouponHistoryMock = vi.fn();

vi.mock('@/services/couponService', () => ({
  redeemCoupon: (...args: unknown[]) => redeemCouponMock(...args),
  getCouponHistory: (...args: unknown[]) => getCouponHistoryMock(...args),
}));

function renderCouponPage() {
  return render(
    <I18nextProvider i18n={i18n}>
      <CouponPage />
    </I18nextProvider>
  );
}

describe('CouponPage', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('en');
    vi.clearAllMocks();
    getCouponHistoryMock.mockResolvedValue([] as CouponHistoryEntryDto[]);
  });

  it('sets page meta from translations including Open Graph flag', async () => {
    renderCouponPage();
    await waitFor(() => expect(getCouponHistoryMock).toHaveBeenCalledTimes(1));
    expect(usePageMetaMock).toHaveBeenCalledWith(
      expect.objectContaining({
        title: en.couponPage.seoTitle,
        description: en.couponPage.seoDescription,
        openGraph: true,
      })
    );
  });

  it('shows empty history message when API returns no entries', async () => {
    renderCouponPage();
    expect(await screen.findByText(en.noCouponsUsed)).toBeInTheDocument();
  });

  it('lists history after load', async () => {
    getCouponHistoryMock.mockResolvedValue([
      {
        id: 1,
        code: 'PIRATE',
        rewardType: 'GOLD',
        rewardReceived: { type: 'GOLD', amount: 100 },
        usedAt: '2025-01-15T12:00:00.000Z',
      },
    ]);
    renderCouponPage();
    expect(await screen.findByText('PIRATE')).toBeInTheDocument();
  });

  it('redeeming gold reward shows confirmation strip, idles the button, updates history from response, and refreshes user', async () => {
    redeemCouponMock.mockResolvedValue({
      success: true,
      reward: { type: 'GOLD', amount: 50 },
      coupon: { code: 'X', rewardType: 'GOLD' },
      history: [
        {
          id: 99,
          code: 'X',
          rewardType: 'GOLD',
          rewardReceived: { type: 'GOLD', amount: 50 },
          usedAt: '2026-01-15 12:00:00',
        },
      ],
    });
    renderCouponPage();
    await screen.findByRole('textbox', { name: /enter coupon code/i });

    await act(async () => {
      fireEvent.change(screen.getByRole('textbox', { name: /enter coupon code/i }), {
        target: { value: 'goldcode' },
      });
      fireEvent.click(screen.getByRole('button', { name: /redeem/i }));
    });

    await waitFor(() => expect(redeemCouponMock).toHaveBeenCalledWith('GOLDCODE'));
    await waitFor(() =>
      expect(screen.getByRole('status')).toHaveTextContent(/50 Gold/i)
    );
    expect(fetchUserDataMock).toHaveBeenCalled();
    expect(getCouponHistoryMock).toHaveBeenCalledTimes(1);
    expect(screen.getByText('X')).toBeInTheDocument();
    expect(screen.queryByText(en.redeeming)).not.toBeInTheDocument();
  });

  it('shows validation error under the form when code is empty', async () => {
    renderCouponPage();
    const input = await screen.findByRole('textbox', { name: /enter coupon code/i });
    const form = input.closest('form');
    expect(form).toBeTruthy();
    await act(async () => {
      fireEvent.submit(form!);
    });
    expect(await screen.findByRole('alert')).toHaveTextContent(en.couponCodeRequired);
    expect(redeemCouponMock).not.toHaveBeenCalled();
  });

  it('shows API error under the form instead of a modal', async () => {
    redeemCouponMock.mockRejectedValue(new Error('couponCodeNotFound'));
    renderCouponPage();
    await screen.findByRole('textbox', { name: /enter coupon code/i });
    await act(async () => {
      fireEvent.change(screen.getByRole('textbox', { name: /enter coupon code/i }), {
        target: { value: 'bad' },
      });
      fireEvent.click(screen.getByRole('button', { name: /redeem/i }));
    });
    expect(await screen.findByRole('alert')).toHaveTextContent(en.couponCodeNotFound);
  });
});
