import { act, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import GameLoadingScreen from '@/pages/game/GameLoadingScreen';

const TIPS = ['Tip alpha', 'Tip beta', 'Tip gamma'];

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, opts?: { returnObjects?: boolean; percent?: number }) => {
      if (key === 'gameLoadingScreen.tips' && opts?.returnObjects) {
        return TIPS;
      }
      if (key === 'gameLoadingScreen.progressPercent' && opts && typeof opts.percent === 'number') {
        return `${opts.percent}%`;
      }
      const strings: Record<string, string> = {
        'gameLoadingScreen.title': 'Pirate Hero',
        'gameLoadingScreen.subtitle': 'Pirackie RPG w przeglądarce',
        'gameLoadingScreen.ariaLabel': 'Loading',
      };
      return strings[key] ?? key;
    },
  }),
}));

describe('GameLoadingScreen', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.spyOn(Math, 'random').mockReturnValue(0);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('renders title, subtitle and one tip from the list', () => {
    render(<GameLoadingScreen />);
    expect(screen.getByText('Pirate Hero')).toBeInTheDocument();
    expect(screen.getByText('Pirackie RPG w przeglądarce')).toBeInTheDocument();
    const tipMatches = TIPS.some((tip) => screen.queryByText(tip));
    expect(tipMatches).toBe(true);
  });

  it('exposes progress bar semantics', () => {
    render(<GameLoadingScreen />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuemin', '0');
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuemax', '100');
  });

  it('shows controlled progress from props', () => {
    render(<GameLoadingScreen progress={65} />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '65');
    expect(screen.getByText('65%')).toBeInTheDocument();
  });

  it('calls onComplete after simulated progress reaches 100%', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const onComplete = vi.fn();
    render(<GameLoadingScreen onComplete={onComplete} />);

    await act(async () => {
      for (let i = 0; i < 60; i++) {
        vi.advanceTimersByTime(120);
      }
    });

    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100');

    expect(onComplete).not.toHaveBeenCalled();

    await act(async () => {
      vi.advanceTimersByTime(400);
    });

    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it('does not call onComplete when callback is omitted', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const onComplete = vi.fn();
    render(<GameLoadingScreen />);

    await act(async () => {
      for (let i = 0; i < 60; i++) {
        vi.advanceTimersByTime(120);
      }
      vi.advanceTimersByTime(400);
    });

    expect(onComplete).not.toHaveBeenCalled();
  });
});
