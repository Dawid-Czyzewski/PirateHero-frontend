import { render, screen } from '@testing-library/react';
import type { JSX } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { ErrorBoundary } from '@/components/ErrorBoundary';

function Crashy(): JSX.Element {
  throw new Error('Kaboom');
}

describe('ErrorBoundary', () => {
  it('shows default fallback UI on render crash', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    render(
      <ErrorBoundary>
        <Crashy />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('Kaboom')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument();
  });

  it('renders custom fallback when provided', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    render(
      <ErrorBoundary fallback={<div>Custom fallback</div>}>
        <Crashy />
      </ErrorBoundary>
    );
    expect(screen.getByText('Custom fallback')).toBeInTheDocument();
  });
});