import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n';
import CreateShipForm from '@/features/game/ship/CreateShipForm';
import pl from '@/locales/pl/translation.json';

const createShipMock = vi.fn();

vi.mock('@/services/shipService', () => ({
  createShip: (...args: unknown[]) => createShipMock(...args),
}));

describe('CreateShipForm', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('pl');
    createShipMock.mockReset();
  });

  it('renders Boosters-style page title and ship name field labels from i18n', () => {
    render(
      <I18nextProvider i18n={i18n}>
        <CreateShipForm
          user={{ gold: 600 }}
          fetchUserData={vi.fn()}
          setActionLoading={vi.fn()}
          actionLoading={false}
          errorMessage={null}
          successMessage={null}
          setErrorMessage={vi.fn()}
          setSuccessMessage={vi.fn()}
        />
      </I18nextProvider>
    );

    const h1 = screen.getByRole('heading', { level: 1, name: pl.statek });
    expect(h1).toHaveClass('tracking-[0.18em]');
    expect(h1).toHaveClass('text-[hsl(43,72%,55%)]');
    expect(screen.getByText(`${pl.shipName} *`)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(pl.shipNamePlaceholder)).toBeInTheDocument();
  });

  it('keeps create disabled when ship name is empty so API is not called', () => {
    render(
      <I18nextProvider i18n={i18n}>
        <CreateShipForm
          user={{ gold: 600 }}
          fetchUserData={vi.fn()}
          setActionLoading={vi.fn()}
          actionLoading={false}
          errorMessage={null}
          successMessage={null}
          setErrorMessage={vi.fn()}
          setSuccessMessage={vi.fn()}
        />
      </I18nextProvider>
    );

    expect(screen.getByRole('button', { name: pl.create })).toBeDisabled();
    expect(createShipMock).not.toHaveBeenCalled();
  });

  it('calls createShip when ship name and gold are valid', async () => {
    createShipMock.mockResolvedValue({ success: true, ship: null });
    const fetchUserData = vi.fn();
    render(
      <I18nextProvider i18n={i18n}>
        <CreateShipForm
          user={{ gold: 600 }}
          fetchUserData={fetchUserData}
          setActionLoading={vi.fn()}
          actionLoading={false}
          errorMessage={null}
          successMessage={null}
          setErrorMessage={vi.fn()}
          setSuccessMessage={vi.fn()}
        />
      </I18nextProvider>
    );

    fireEvent.change(screen.getByPlaceholderText(pl.shipNamePlaceholder), {
      target: { value: 'Test Ship' },
    });
    fireEvent.click(screen.getByRole('button', { name: pl.create }));

    await waitFor(() => {
      expect(createShipMock).toHaveBeenCalledWith(
        'Test Ship',
        '',
        expect.objectContaining({ gold: 600 }),
        fetchUserData,
        expect.any(Function)
      );
    });
  });
});
