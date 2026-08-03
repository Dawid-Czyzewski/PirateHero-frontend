import { screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n';
import StorePage from '@/features/game/StorePage';
import { renderWithProviders } from '@/test/renderWithProviders';
import { buildUseUserReturn, type UserTestDouble } from '@/test/useUserTestDouble';

const userTestDouble = vi.hoisted(
  (): UserTestDouble => ({
    user: null,
    setUser: vi.fn(),
    fetchUserData: vi.fn(async () => undefined),
    updateUser: vi.fn(async () => undefined),
  })
);

vi.mock('@/hooks/usePageMeta', () => ({
  usePageMeta: vi.fn(),
}));

vi.mock('@/lib/api/requestJson', () => ({
  requestJson: vi.fn(),
}));

import { requestJson } from '@/lib/api/requestJson';

const requestJsonMock = vi.mocked(requestJson);

vi.mock('@/hooks/useUser', () => ({
  useUser: () => buildUseUserReturn(userTestDouble),
}));

const helmetOffer = {
  id: 101,
  nameKey: 'items.captainTricorn',
  imageKey: 'helm_01',
  slotId: 'helmet',
  price: 400,
  rarity: 'uncommon',
  stats: [{ statId: 'defense', value: 8 }],
  storeSlotId: 99,
};

function gameShopState(helmet: typeof helmetOffer | null) {
  return {
    gold: 2000,
    shop: [helmet, null, null, null, null, null, null, null, null],
    inventory: Array.from({ length: 12 }, () => null),
    equipped: {},
    refresh: { isFreeRefreshAvailable: true, refreshCost: 1 },
  };
}

const mockUser = {
  id: 'test-user-1',
  gold: 2000,
  diamonds: 0,
  username: 'test',
  gameShop: gameShopState(helmetOffer),
};

function mockDataTransfer(itemId: number, source: 'shop' | 'inventory' | 'equipped', slot: string) {
  const data: Record<string, string> = {
    itemId: String(itemId),
    source,
    slot,
  };
  return {
    getData: (k: string) => data[k] ?? '',
    setData: vi.fn(),
    effectAllowed: 'all',
    dropEffect: 'move',
  } as unknown as DataTransfer;
}

function renderStore() {
  return renderWithProviders(
    <I18nextProvider i18n={i18n}>
      <StorePage />
    </I18nextProvider>
  );
}

describe('StorePage', () => {
  let helmetOnShelf: typeof helmetOffer | null = helmetOffer;

  beforeEach(async () => {
    await i18n.changeLanguage('en');
    vi.clearAllMocks();
    helmetOnShelf = helmetOffer;
    userTestDouble.user = mockUser as never;
    userTestDouble.fetchUserData.mockResolvedValue(undefined);
    requestJsonMock.mockImplementation(async (path: string) => {
      if (path === '/game-shop/state') {
        return gameShopState(helmetOnShelf);
      }
      if (path === '/game-shop/purchase') {
        helmetOnShelf = null;
        const s = gameShopState(null);
        return {
          ...s,
          gold: 1600,
          inventory: [
            {
              ...helmetOffer,
              storageSlotId: 1,
            },
            ...Array.from({ length: 11 }, () => null),
          ],
        };
      }
      if (path === '/game-shop/equip') {
        return {
          ...gameShopState(null),
          gold: 1600,
          equipped: { helmet: helmetOffer },
          inventory: Array.from({ length: 12 }, () => null),
        };
      }
      if (path === '/game-shop/refresh') {
        helmetOnShelf = helmetOffer;
        return gameShopState(helmetOffer);
      }
      return undefined as never;
    });
    let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'description');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', 'default');
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders store heading', async () => {
    renderStore();
    expect(await screen.findByRole('heading', { level: 1, name: /store|sklep/i })).toBeInTheDocument();
  });

  it('lists a catalog item in the shop grid', async () => {
    renderStore();
    expect(await screen.findByText("Captain's Tricorn")).toBeInTheDocument();
  });

  it('buys a shop item by dropping on the matching equip slot (helmet becomes sold out)', async () => {
    renderStore();
    await screen.findByText("Captain's Tricorn");
    const helmetEquip = await screen.findByTestId('equip-slot-helmet');
    fireEvent.drop(helmetEquip, { dataTransfer: mockDataTransfer(101, 'shop', 'helmet') });
    await waitFor(() => {
      expect(requestJsonMock).toHaveBeenCalledWith(
        '/game-shop/purchase',
        expect.objectContaining({ method: 'POST' })
      );
    });
    expect(requestJsonMock).toHaveBeenCalledWith(
      '/game-shop/equip',
      expect.objectContaining({ method: 'POST', body: { itemId: 101 } })
    );
  });

  it('runs refresh flow and restores grid', async () => {
    renderStore();
    await screen.findByText("Captain's Tricorn");
    fireEvent.click(screen.getByRole('button', { name: /refresh|odśwież/i }));
    await waitFor(() => {
      expect(requestJsonMock).toHaveBeenCalledWith('/game-shop/refresh', expect.objectContaining({ method: 'POST' }));
    });
    expect(await screen.findByText("Captain's Tricorn")).toBeInTheDocument();
  });
});
