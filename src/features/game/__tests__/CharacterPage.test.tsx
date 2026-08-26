import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import CharacterPage from '@/features/game/CharacterPage';

function stubMatchMedia() {
  vi.stubGlobal(
    'matchMedia',
    vi.fn().mockImplementation((query: string) => ({
      matches: true,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }))
  );
}

beforeEach(() => {
  stubMatchMedia();
});

vi.mock('@/hooks/usePageMeta', () => ({
  usePageMeta: vi.fn(),
}));

const mockUser = {
  username: 'TestowyGracz',
  avatarName: 'Boatswain',
  storage: {
    id: 1,
    slots: [
      {
        slotNumber: 1,
        item: {
          id: 7,
          type: 'weapon',
          rarity: 'LEGENDARY',
          publicCode: 'admiral-blade',
          price: 355,
          level: 29,
          imageKey: 'sword_03',
          statistics: { strongPoints: 16 },
        },
      },
      {
        slotNumber: 2,
        item: {
          id: 8,
          type: 'amulet',
          rarity: 'EPIC',
          publicCode: 'storm-amulet',
          price: 165,
          level: 23,
          imageKey: 'amulet_03',
          statistics: { criticalChancePoints: 9 },
        },
      },
      {
        slotNumber: 3,
        item: {
          id: 9,
          type: 'ring',
          rarity: 'EPIC',
          publicCode: 'raider-ring',
          price: 172,
          level: 25,
          imageKey: 'ring_04',
          statistics: { agilityPoints: 8 },
        },
      },
      ...Array.from({ length: 9 }, (_, i) => ({ slotNumber: i + 4, item: null })),
    ],
  },
  userEquipment: {
    id: 1,
    userEquipmentSlots: [
      {
        type: 'helmet',
        wearableItem: {
          id: 1,
          type: 'helmet',
          rarity: 'COMMON',
          publicCode: 'pirate-hat',
          price: 45,
          level: 18,
          imageKey: 'helm_01',
          statistics: { agilityPoints: 3 },
        },
      },
      {
        type: 'weapon',
        wearableItem: {
          id: 2,
          type: 'weapon',
          rarity: 'EPIC',
          publicCode: 'captain-cutlass',
          price: 180,
          level: 24,
          imageKey: 'sword_02',
          statistics: { strongPoints: 12 },
        },
      },
      {
        type: 'armor',
        wearableItem: {
          id: 3,
          type: 'armor',
          rarity: 'RARE',
          publicCode: 'leather-jerkin',
          price: 104,
          level: 22,
          imageKey: 'armor_02',
          statistics: { healthPoints: 8 },
        },
      },
      {
        type: 'amulet',
        wearableItem: {
          id: 4,
          type: 'amulet',
          rarity: 'LEGENDARY',
          publicCode: 'kraken-medallion',
          price: 320,
          level: 26,
          imageKey: 'amulet_03',
          statistics: { criticalChancePoints: 15 },
        },
      },
      {
        type: 'ring',
        wearableItem: {
          id: 5,
          type: 'ring',
          rarity: 'RARE',
          publicCode: 'thief-signet',
          price: 88,
          level: 21,
          imageKey: 'ring_04',
          statistics: { agilityPoints: 6 },
        },
      },
      {
        type: 'boots',
        wearableItem: {
          id: 6,
          type: 'boots',
          rarity: 'COMMON',
          publicCode: 'sailor-boots',
          price: 38,
          level: 16,
          imageKey: 'boots_02',
          statistics: { agilityPoints: 4 },
        },
      },
    ],
  },
};

vi.mock('@/hooks/useUser', () => ({
  useUser: () => ({
    user: mockUser,
    fetchUserData: vi.fn(),
    setUser: vi.fn(),
    updateUser: vi.fn(),
  }),
}));

function renderCharacterPage() {
  return render(
    <MemoryRouter>
      <CharacterPage onPreviewProfile={vi.fn()} />
    </MemoryRouter>
  );
}

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) =>
      ({
        'characterPage.seoTitle': 'Postać | Pirate Hero',
        'characterPage.seoDescription': 'Opis',
        'characterPage.heroTitle': 'Kapitan Hak',
        'characterPage.heroImageAlt': 'Postać gracza',
        'characterPage.className': 'Korsarz',
        'characterPage.dragHint': 'Kliknij 2x, aby założyć lub zdjąć • Przeciągnij przedmiot na slot',
        'characterPage.attributesTitle': 'Atrybuty',
        'characterPage.goldLabel': 'Złoto',
        'characterPage.fameLabel': 'Sława',
        'characterPage.diamondsLabel': 'Diamenty',
        'characterPage.backpackTitle': 'Plecak',
        'characterPage.chestTitle': 'Skrzynia',
        'characterPage.slotsLabel': 'slotów',
        'characterPage.emptySlot': 'Pusty',
        'characterPage.itemsCount': 'przedmiotów',
        'characterPage.emptyBackpack': 'Plecak jest pusty',
        'characterPage.sellFor': 'Sprzedaj za',
        'characterPage.bonusFromGear': 'z ekwipunku',
        'characterPage.stats.strength': 'Siła',
        'characterPage.stats.agility': 'Zręczność',
        'characterPage.stats.endurance': 'Wytrzymałość',
        'characterPage.stats.intelligence': 'Inteligencja',
        'characterPage.stats.luck': 'Szczęście',
        'characterPage.slots.weapon': 'Broń',
        'characterPage.slots.armor': 'Zbroja',
        'characterPage.slots.helmet': 'Hełm',
        'characterPage.slots.amulet': 'Amulet',
        'characterPage.slots.ring': 'Pierścień',
        'characterPage.slots.boots': 'Buty',
        'characterPage.rarity.common': 'Pospolity',
        'characterPage.rarity.rare': 'Rzadki',
        'characterPage.rarity.epic': 'Epicki',
        'characterPage.rarity.legendary': 'Legendarny',
        'characterPage.workshop.upgrade': 'Ulepsz',
        'characterPage.workshop.upgrading': 'Ulepszanie…',
        'characterPage.workshop.maxLevel': 'Max',
        'characterPage.workshop.levelLine': 'Ulepszenie +{{level}} / {{max}}',
        'characterPage.workshop.cost': '{{gold}} złota',
        'characterPage.workshop.specialize.title': 'Specjalizacja',
        'characterPage.workshop.specialize.hint': 'Wybierz',
        'characterPage.workshop.specialize.cost': '{{gold}} złota',
        'characterPage.workshop.specialize.applying': '…',
        'characterPage.workshop.specialize.failed': 'Błąd',
        'characterPage.workshop.specialize.active': '{{name}}',
        'characterPage.workshop.specialize.health': '+{{n}} HP',
        'characterPage.workshop.specialize.crit': '+{{n}} kryt',
        'characterPage.workshop.specialize.mission_gold': '+{{n}}% złota',
        'characterPage.workshop.specialize.labels.health': 'HP',
        'characterPage.workshop.specialize.labels.crit': 'Kryt',
        'characterPage.workshop.specialize.labels.mission_gold': 'Misje',
        'titlesPage.title': 'Tytuły',
        'character': 'Postać',
        'items.pirate-hat': 'Piracki Kapelusz',
        'items.captain-cutlass': 'Kordelas Kapitana',
        'items.leather-jerkin': 'Skórzany Kaftan',
        'items.kraken-medallion': 'Medalion Krakena',
        'items.thief-signet': 'Sygnet Złodzieja',
        'items.sailor-boots': 'Buciki Żeglarza',
        'items.admiral-blade': 'Ostrze Admirała',
        'items.storm-amulet': 'Amulet Sztormu',
        'items.raider-ring': 'Pierścień Hultaja',
        'avatars.boatswain': 'Bosman',
      })[key] ?? key,
  }),
}));

describe('CharacterPage', () => {
  it('renders translated paper-doll character screen', () => {
    renderCharacterPage();

    expect(screen.getByRole('heading', { level: 1, name: 'TestowyGracz' })).toBeInTheDocument();
    expect(screen.getByText('Bosman')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'Atrybuty' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: /Skrzynia/ })).toBeInTheDocument();
    expect(screen.getAllByText('Kordelas Kapitana').length).toBeGreaterThan(0);
    expect(screen.getByText('Kliknij 2x, aby założyć lub zdjąć • Przeciągnij przedmiot na slot')).toBeInTheDocument();
    expect(screen.getByText('Siła')).toBeInTheDocument();
    expect(screen.getByText('Złoto')).toBeInTheDocument();
    expect(screen.getByText('Sława')).toBeInTheDocument();
    expect(screen.getByText('Diamenty')).toBeInTheDocument();
  });

  it('shows inventory counter', () => {
    renderCharacterPage();

    expect(screen.getByText(/3\/12 slotów/)).toBeInTheDocument();
  });
});
