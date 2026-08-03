import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import RedirectIfAuthenticated from '@/components/RedirectIfAuthenticated';

describe('RedirectIfAuthenticated', () => {
  it('renders children for anonymous user', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');

    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route
            path="/"
            element={
              <RedirectIfAuthenticated redirectTo="/game">
                <div>Public Landing</div>
              </RedirectIfAuthenticated>
            }
          />
          <Route path="/game" element={<div>Game Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Public Landing')).toBeInTheDocument();
  });

  it('redirects authenticated user', () => {
    localStorage.setItem('token', 'token-2');
    localStorage.setItem('userId', '2');

    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route
            path="/"
            element={
              <RedirectIfAuthenticated redirectTo="/game">
                <div>Public Landing</div>
              </RedirectIfAuthenticated>
            }
          />
          <Route path="/game" element={<div>Game Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Game Page')).toBeInTheDocument();
  });
});