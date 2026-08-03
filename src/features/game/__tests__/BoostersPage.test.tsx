import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import BoostersPage from '@/features/game/BoostersPage';
import { SessionShopBoostersProvider } from '@/features/game/boosters/SessionShopBoostersContext';
import type { SessionShopBoosterEntry } from '@/types/gameUser';
import pl from '@/locales/pl/translation.json';

function translatePl(key: string): string | undefined {
  const parts = key.split('.');
  let cur: unknown = pl;
  for (const part of parts) {
    if (cur == null || typeof cur !== 'object' || !(part in cur)) return undefined;
    cur = (cur as Record<string, unknown>)[part];
  }
  return typeof cur === 'string' ? cur : undefined;
}

type BoostersPageTestUser = {
  id: string;
  gold: number;
  diamonds: number;
  sessionShopBoosters?: SessionShopBoosterEntry[];
};

const usePageMetaMock = vi.fn();

const shopBoostersApiMocks = vi.hoisted(() => ({
  fetchShopBoosterCatalog: vi.fn(() => Promise.reject(new Error('use static catalog in tests'))),
  purchaseShopBoosterApi: vi.fn(async (boosterId: string) => ({
    sessionShopBoosters: [{ boosterId: boosterId, expiresAt: Date.now() + 96 * 3600 * 1000 }],
  })),
  pruneExpiredShopBoostersApi: vi.fn(async () => ({ sessionShopBoosters: [] as { boosterId: string; expiresAt: number }[] })),
}));

vi.mock('@/hooks/usePageMeta', () => ({
  usePageMeta: (...args: unknown[]) => usePageMetaMock(...args),
}));

vi.mock('@/services/shopBoostersApi', () => shopBoostersApiMocks);

const boostUserHolder = vi.hoisted((): { user: BoostersPageTestUser } => ({
  user: { id: 'test-user', gold: 1250, diamonds: 4 },
}));

const updateUserMock = vi.fn(async (patch: Record<string, unknown>) => {
  boostUserHolder.user = { ...boostUserHolder.user, ...patch } as BoostersPageTestUser;
});

const fetchUserDataMock = vi.hoisted(() =>
  vi.fn(async () => {
    const u = boostUserHolder.user;
    const afterPrune = shopBoostersApiMocks.pruneExpiredShopBoostersApi.mock.calls.length > 0;
    if (afterPrune) {
      boostUserHolder.user = { ...u, sessionShopBoosters: [] };
      return;
    }
    boostUserHolder.user = {
      ...u,
      sessionShopBoosters: [{ boosterId: 'mis_1', expiresAt: Date.now() + 96 * 3600 * 1000 }],
    };
  })
);

vi.mock('@/hooks/useUser', () => ({
  useUser: () => ({
    user: boostUserHolder.user,
    updateUser: updateUserMock,
    fetchUserData: fetchUserDataMock,
    setUser: vi.fn(),
    isLoading: false,
    isError: false,
  }),
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, opts?: Record<string, unknown>) => {
      if (key === 'boostersPage.durationDays') {
        const c = Number(opts?.count ?? 0);
        if (c === 1) return '1 dzień';
        return `${c} dni`;
      }
      if (key === 'boostersPage.durationHours') {
        const c = Number(opts?.count ?? 0);
        if (c === 1) return '1 godzina';
        if (c >= 2 && c <= 4) return `${c} godziny`;
        return `${c} godzin`;
      }
      if (key === 'boostersPage.activeUntilLine' || key === 'boostersPage.cardActiveUntil') {
        return `do ${String(opts?.until ?? '')} · ${String(opts?.countdown ?? '')}`;
      }
      if (key === 'boostersPage.categoryAria') {
        return `Kategoria ${String(opts?.label ?? '')}`;
      }

      const fromPl = translatePl(key);
      if (fromPl !== undefined) return fromPl;

      const map: Record<string, string> = {
        'boostersPage.title': 'Wspomagacze',
        'boostersPage.seoTitle': 'Wspomagacze | Pirate Hero',
        'boostersPage.seoDescription': 'Aktywuj wspomagacze misji, treningu, pracy i umiejętności, aby szybciej rozwijać postać.',
        'boostersPage.pageAriaLabel': 'Wspomagacze',
        'boostersPage.activeSectionAria': 'Aktywne wspomagacze',
        'boostersPage.activeSectionToggle': 'Aktywne wspomagacze',
        'boostersPage.purchaseBuy': 'Kup',
        'boostersPage.purchaseActive': 'Aktywny',
        'boostersPage.purchaseNoGold': 'Brak wystarczającej ilości złota.',
        'boostersPage.purchaseNoGoldShort': 'Za mało złota',
        'boostersPage.purchaseNoDiamonds': 'Brak wystarczającej liczby diamentów.',
        'boostersPage.purchaseNoDiamondsShort': 'Za mało diamentów',
        'boostersPage.replaceTitle': 'Podmienić aktywny wspomagacz?',
        'boostersPage.replaceBodyBefore': 'W tej kategorii możesz mieć aktywny tylko jeden wspomagacz. Aktywacja ',
        'boostersPage.replaceBodyAfter': ' usunie aktualnie aktywny.',
        'boostersPage.cancel': 'Anuluj',
        'boostersPage.confirm': 'Potwierdź',
      };
      return map[key] ?? key;
    },
    i18n: { language: 'pl' },
  }),
}));

function boostersPageTree() {
  return (
    <SessionShopBoostersProvider>
      <BoostersPage />
    </SessionShopBoostersProvider>
  );
}

function renderBoostersPage() {
  return render(boostersPageTree());
}

describe('BoostersPage', () => {
  afterEach(() => {
    vi.useRealTimers();
    sessionStorage.clear();
    boostUserHolder.user = { id: 'test-user', gold: 1250, diamonds: 4 };
    updateUserMock.mockClear();
    fetchUserDataMock.mockClear();
    shopBoostersApiMocks.fetchShopBoosterCatalog.mockClear();
    shopBoostersApiMocks.purchaseShopBoosterApi.mockClear();
    shopBoostersApiMocks.pruneExpiredShopBoostersApi.mockClear();
  });

  it('renders main heading and configures SEO metadata', () => {
    renderBoostersPage();
    expect(screen.getByRole('heading', { level: 1, name: 'Wspomagacze' })).toBeInTheDocument();
    expect(usePageMetaMock).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Wspomagacze | Pirate Hero',
      })
    );
  });

  it('activates a gold booster and marks it as active', async () => {
    renderBoostersPage();
    await act(async () => {
      fireEvent.click(screen.getAllByRole('button', { name: 'Kup' })[0]);
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(screen.queryByText('Aktywowano: Pozłacana mapa.')).not.toBeInTheDocument();
    expect(await screen.findByRole('button', { name: /Aktywny/i })).toBeDisabled();
  });

  it('shows insufficient premium text on button immediately', () => {
    renderBoostersPage();
    const premiumErrorButtons = screen.getAllByRole('button', {
      name: /Za mało diamentów|Brak wystarczającej liczby diamentów/,
    });
    expect(premiumErrorButtons.length).toBeGreaterThan(0);
    expect(premiumErrorButtons[0]).toBeDisabled();
  });

  it('shows immediate insufficient gold text on expensive gold booster button', async () => {
    const view = renderBoostersPage();
    await act(async () => {
      fireEvent.click(screen.getAllByRole('button', { name: 'Kup' })[0]);
      await Promise.resolve();
      await Promise.resolve();
    });
    await act(async () => {
      view.rerender(boostersPageTree());
    });

    const goldenCompassCard = screen.getByText('Mapa skarbu').closest('article');
    expect(goldenCompassCard).not.toBeNull();
    const expensiveButton = within(goldenCompassCard as HTMLElement).getByRole('button', {
      name: /Za mało złota|Brak wystarczającej ilości złota/,
    });
    expect(expensiveButton).toBeDisabled();
  });

  it('deactivates booster when active period ends', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-01T12:00:00.000Z'));
    renderBoostersPage();
    await act(async () => {
      fireEvent.click(screen.getAllByRole('button', { name: 'Kup' })[0]);
      await Promise.resolve();
      await Promise.resolve();
    });
    expect(screen.getByRole('button', { name: /Aktywny/i })).toBeInTheDocument();

    await act(async () => {
      vi.setSystemTime(new Date('2026-01-05T12:00:02.000Z'));
      vi.advanceTimersByTime(5000);
    });
    expect(screen.queryByRole('button', { name: /Aktywny/i })).not.toBeInTheDocument();
  });
});
