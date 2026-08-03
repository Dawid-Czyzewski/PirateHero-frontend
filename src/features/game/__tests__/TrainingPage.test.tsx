import { screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import TrainingPage from '@/features/game/TrainingPage';
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

const trainingRefillMocks = vi.hoisted(() => ({
  getTrainingRefillInfo: vi.fn(() =>
    Promise.resolve({
      success: true as const,
      data: {
        canRefill: true,
        refillsRemaining: 2,
        refillsUsed: 0,
        nextRefillCost: 10,
        currentTrainingPoints: 10,
        maxTrainingPoints: 15,
        hasActiveTraining: false,
      },
    })
  ),
  refillTraining: vi.fn(() =>
    Promise.resolve({
      success: true as const,
      data: {
        success: true,
        newTrainingPoints: 15,
        newGold: 80,
        refillsUsed: 0,
        refillsRemaining: 2,
        cost: 10,
      },
    })
  ),
}));

const baseTrainingUser = vi.hoisted(() => ({
  id: 'u1',
  username: 'pirate',
  gold: 100,
  trainingPoints: 12,
  level: { name: '1', expToNextLevel: 400 },
  userCapacities: { trainingPoints: 15 },
  userBoosters: [] as unknown[],
  trainings: [
    {
      id: 1,
      title: 'training.title_test',
      description: 'training.desc_test',
      durationInSeconds: 60,
      trainingPointsCost: 3,
      skillPointsReward: 1,
      statType: 'STRENGTH',
    },
  ],
}));

vi.mock('@/services/refillService', () => ({
  getTrainingRefillInfo: trainingRefillMocks.getTrainingRefillInfo,
  refillTraining: trainingRefillMocks.refillTraining,
}));

vi.mock('@/services/trainingService', () => ({
  startTraining: vi.fn(() => ({ success: true, message: 'ok' })),
  cancelTraining: vi.fn(() => ({ success: true })),
  buildTrainingClaimOptimisticPatch: vi.fn(() => ({
    rollback: {},
    optimisticPatch: {},
  })),
  requestTrainingComplete: vi.fn(async () => []),
}));

vi.mock('@/hooks/useUser', () => ({
  useUser: () => buildUseUserReturn(userTestDouble),
}));

vi.mock('@/hooks/usePageMeta', () => ({
  usePageMeta: vi.fn(),
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, opts?: { defaultValue?: string }) => {
      const map: Record<string, string> = {
        training: 'Treningi',
        trainingsPage: '',
        'trainingsPage.seoDescription': 'SEO treningów',
        'trainingsPage.availableTrainings': 'Dostępne treningi',
        'trainingsPage.trainingPointsStatus': 'Punkty treningowe',
        'trainingsPage.beginTraining': 'Rozpocznij',
        'trainingsPage.trainingPointsUnit': 'pkt treningu',
        trainingPoints: 'pkt treningu',
        reward: 'Nagroda',
        strong: 'Siła',
        refill: 'Uzupełnij',
        gold: 'złoto',
        close: 'Zamknij',
        refillTrainingPoints: 'Uzupełnij punkty treningowe',
        'training.title_test': 'Trening testowy',
        'training.desc_test': 'Krótki opis treningu.',
      };
      if (key === 'trainingsPage.seoDescription') return map[key] ?? opts?.defaultValue ?? '';
      return map[key] ?? key;
    },
  }),
}));

function renderTrainingPage() {
  userTestDouble.user = { ...baseTrainingUser };
  return renderWithProviders(<TrainingPage />, { withRouter: true });
}

describe('TrainingPage', () => {
  it('renders heading, SEO hook, and available training row', () => {
    renderTrainingPage();
    expect(screen.getByRole('heading', { level: 1, name: 'Treningi' })).toBeInTheDocument();
    expect(screen.getByText('Dostępne treningi')).toBeInTheDocument();
    expect(screen.getByText('Trening testowy')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Rozpocznij' })).toBeInTheDocument();
  });
});
