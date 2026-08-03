import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import LevelUpModal from '@/components/modal/LevelUpModal';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const map: Record<string, string> = {
        'levelUpModal.title': 'NOWY POZIOM!',
        'levelUpModal.congrats': 'Gratulacje!',
        'levelUpModal.rewardLabel': 'NAGRODA',
        'levelUpModal.rewardDescription': 'Punktów',
        'levelUpModal.distributePoints': 'ROZDZIEL PUNKTY',
      };
      return map[key] ?? key;
    },
  }),
}));

describe('LevelUpModal', () => {
  it('calls onDistributePoints when primary button is clicked', () => {
    const onClose = vi.fn();
    const onDistributePoints = vi.fn();
    render(
      <LevelUpModal
        isOpen
        onClose={onClose}
        onDistributePoints={onDistributePoints}
        newLevel={{ name: '12' }}
        rewardPoints={5}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'ROZDZIEL PUNKTY' }));
    expect(onDistributePoints).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when backdrop is clicked', () => {
    const onClose = vi.fn();
    const onDistributePoints = vi.fn();
    const { container } = render(
      <LevelUpModal
        isOpen
        onClose={onClose}
        onDistributePoints={onDistributePoints}
        newLevel={{ name: '3' }}
      />
    );

    const backdrop = container.querySelector('[role="presentation"]');
    expect(backdrop).toBeTruthy();
    fireEvent.click(backdrop!);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
