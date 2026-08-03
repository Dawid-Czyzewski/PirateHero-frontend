import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n';
import ArenaPage from '../ArenaPage';

vi.mock('@/hooks/usePageMeta', () => ({
  usePageMeta: vi.fn(),
}));

vi.mock('@/hooks/useUser', () => ({
  useUser: vi.fn(),
}));

vi.mock('@/services/refillService', () => ({
  getFightRefillInfo: vi.fn().mockResolvedValue({
    success: true,
    data: {
      canRefill: false,
      refillsRemaining: 0,
      refillsUsed: 2,
      maxDailyRefills: 2,
      nextRefillCost: 100,
      currentFightPoints: 10,
      maxFightPoints: 10,
      hasActiveFight: false,
    },
  }),
}));

import { useUser } from '@/hooks/useUser';

const useUserMock = vi.mocked(useUser);

function renderArena() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={client}>
      <I18nextProvider i18n={i18n}>
        <ArenaPage />
      </I18nextProvider>
    </QueryClientProvider>
  );
}

describe('ArenaPage', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('en');
    vi.clearAllMocks();
    useUserMock.mockReturnValue({
      user: {
        id: '1',
        username: 'test',
        experiencePoints: 0,
        diamonds: 0,
        gold: 1000,
        duelPoints: 10,
        level: { name: '12', expToNextLevel: 100 },
      },
      isLoading: false,
      isFetching: false,
      isError: false,
      setUser: vi.fn(),
      fetchUserData: vi.fn(),
      updateUser: vi.fn().mockResolvedValue(undefined),
    } as never);
  });

  it('shows arena title after initial load', async () => {
    renderArena();
    expect(await screen.findByRole('heading', { name: /^Arena$/i }, { timeout: 4000 })).toBeInTheDocument();
  });
});
