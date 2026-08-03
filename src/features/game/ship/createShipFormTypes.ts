import type { ShipSummaryDto } from '@/types/ship';

export type CreateShipFormProps = {
  user: { gold?: number } | null;
  fetchUserData: () => Promise<unknown>;
  onShipCreated?: (
    ship: ShipSummaryDto | null | undefined
  ) => void | Promise<void>;
  setActionLoading: (loading: boolean) => void;
  actionLoading: boolean;
  errorMessage: string | null;
  successMessage: string | null;
  setErrorMessage: (msg: string | null) => void;
  setSuccessMessage: (msg: string | null) => void;
  onNavigateToRanking?: () => void;
};
