import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import RequireAuth from '@/components/RequireAuth';

describe('RequireAuth', () => {
  it('redirects to target route when token missing', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');

    render(
      <MemoryRouter initialEntries={['/private']}>
        <Routes>
          <Route
            path="/private"
            element={
              <RequireAuth redirectTo="/login">
                <div>Private Zone</div>
              </RequireAuth>
            }
          />
          <Route path="/login" element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });

  it('renders children when token exists', () => {
    localStorage.setItem('token', 'token-1');
    localStorage.setItem('userId', '1');

    render(
      <MemoryRouter initialEntries={['/private']}>
        <Routes>
          <Route
            path="/private"
            element={
              <RequireAuth redirectTo="/login">
                <div>Private Zone</div>
              </RequireAuth>
            }
          />
          <Route path="/login" element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Private Zone')).toBeInTheDocument();
  });
});