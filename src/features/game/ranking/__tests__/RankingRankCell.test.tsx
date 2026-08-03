import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { RankingRankCell } from '@/features/game/ranking/RankingRankCell';

describe('RankingRankCell', () => {
  it('renders a medal for top 3', () => {
    const { container } = render(<RankingRankCell position={2} />);
    expect(container.querySelector('svg')).toBeTruthy();
    expect(screen.queryByText('2')).toBeNull();
  });

  it('renders numeric rank from 4 onward', () => {
    render(<RankingRankCell position={4} />);
    expect(screen.getByText('4')).toBeTruthy();
  });
});
