import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n';
import { AuthProvider } from '@/context/AuthProvider';
import AuthPage from '@/pages/AuthPage';
import RegistrationSuccessPage from '@/pages/RegistrationSuccessPage';
import { publicRequestUnknown } from '@/lib/api/publicRequestUnknown';

vi.mock('@/lib/api/publicRequestUnknown', () => ({
  publicRequestUnknown: vi.fn().mockResolvedValue(undefined),
}));

const publicRequestUnknownMock = vi.mocked(publicRequestUnknown);

function renderAuthPage(initialPath = '/auth') {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={qc}>
      <MemoryRouter initialEntries={[initialPath]}>
        <AuthProvider>
          <I18nextProvider i18n={i18n}>
            <Routes>
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/auth/registration-success" element={<RegistrationSuccessPage />} />
            </Routes>
          </I18nextProvider>
        </AuthProvider>
      </MemoryRouter>
    </QueryClientProvider>
  );
}

describe('AuthPage (functional)', () => {
  beforeEach(() => {
    publicRequestUnknownMock.mockReset();
    publicRequestUnknownMock.mockResolvedValue(undefined);
    document.title = 'Pirate Hero';
    let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'description');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', 'default');
  });

  it('opens register tab when URL has mode=register', () => {
    renderAuthPage('/auth?mode=register');
    expect(screen.getByLabelText(/repeat password|powtórz hasło/i)).toBeInTheDocument();
  });

  it('shows login submit then toggles to register with extra password field', () => {
    const { container } = renderAuthPage();
    const loginSubmit = container.querySelector('form button[type="submit"]');
    expect(loginSubmit).toBeTruthy();
    expect(loginSubmit).toHaveTextContent(/log in|login|zaloguj/i);

    fireEvent.click(
      screen.getByRole('tab', {
        name: /zarejestruj|sign up|register|rejestracja|registration/i,
      })
    );

    expect(screen.getByLabelText(/repeat password|powtórz hasło/i)).toBeInTheDocument();
  });

  it('register flow goes from step 1 to step 2 and does not submit on step 1', () => {
    renderAuthPage('/auth?mode=register');

    fireEvent.change(screen.getByLabelText(/username|nazwa użytkownika/i), {
      target: { value: 'captain_test' },
    });
    fireEvent.change(screen.getByLabelText(/^email$/i), {
      target: { value: 'captain@test.com' },
    });
    fireEvent.change(screen.getByLabelText(/^password$|^hasło$/i), {
      target: { value: 'secret123' },
    });
    fireEvent.change(screen.getByLabelText(/repeat password|powtórz hasło/i), {
      target: { value: 'secret123' },
    });
    fireEvent.click(screen.getByLabelText(/accept|akceptuję/i));

    fireEvent.click(screen.getByRole('button', { name: /dalej|continue/i }));

    expect(publicRequestUnknownMock).not.toHaveBeenCalled();
    expect(
      screen.getByRole('heading', { name: /wybierz awatar|choose avatar/i })
    ).toBeInTheDocument();
  });

  it('requires avatar selection on step 2 before final submit', async () => {
    renderAuthPage('/auth?mode=register');

    fireEvent.change(screen.getByLabelText(/username|nazwa użytkownika/i), {
      target: { value: 'captain_test' },
    });
    fireEvent.change(screen.getByLabelText(/^email$/i), {
      target: { value: 'captain@test.com' },
    });
    fireEvent.change(screen.getByLabelText(/^password$|^hasło$/i), {
      target: { value: 'secret123' },
    });
    fireEvent.change(screen.getByLabelText(/repeat password|powtórz hasło/i), {
      target: { value: 'secret123' },
    });
    fireEvent.click(screen.getByLabelText(/accept|akceptuję/i));
    fireEvent.click(screen.getByRole('button', { name: /dalej|continue/i }));

    fireEvent.click(screen.getByRole('button', { name: /rozpocznij grę|start game/i }));

    expect(publicRequestUnknownMock).not.toHaveBeenCalled();
    expect(
      await screen.findByText(/wybierz awatar|choose an avatar/i)
    ).toBeInTheDocument();
  });

  it('submits register on step 2, sends avatarName, and redirects to success page', async () => {
    renderAuthPage('/auth?mode=register');

    fireEvent.change(screen.getByLabelText(/username|nazwa użytkownika/i), {
      target: { value: 'captain_test' },
    });
    fireEvent.change(screen.getByLabelText(/^email$/i), {
      target: { value: 'captain@test.com' },
    });
    fireEvent.change(screen.getByLabelText(/^password$|^hasło$/i), {
      target: { value: 'secret123' },
    });
    fireEvent.change(screen.getByLabelText(/repeat password|powtórz hasło/i), {
      target: { value: 'secret123' },
    });
    fireEvent.click(screen.getByLabelText(/accept|akceptuję/i));
    fireEvent.click(screen.getByRole('button', { name: /dalej|continue/i }));

    fireEvent.click(screen.getByRole('button', { name: /^(kapitan|captain)$/i }));
    fireEvent.click(screen.getByRole('button', { name: /rozpocznij grę|start game/i }));

    await waitFor(() => {
      expect(publicRequestUnknownMock).toHaveBeenCalledTimes(1);
      expect(publicRequestUnknownMock).toHaveBeenCalledWith(
        '/register',
        expect.objectContaining({
          method: 'POST',
          body: expect.objectContaining({
            username: 'captain_test',
            email: 'captain@test.com',
            avatarName: 'captain',
          }),
        }),
      );
    });

    expect(
      await screen.findByRole('heading', { name: /sprawdź swoją skrzynkę|check your inbox/i })
    ).toBeInTheDocument();
  });

  it('sets document title and meta description for SEO', () => {
    renderAuthPage();
    expect(document.title).toMatch(/Pirate Hero/i);
    expect(document.title).toMatch(/sign in|logowanie|sign up|rejestracja/i);
    const meta = document.querySelector('meta[name="description"]');
    expect(meta?.getAttribute('content')?.length).toBeGreaterThan(20);
    expect(meta?.getAttribute('content')).toMatch(/Pirate Hero/i);
  });
});
