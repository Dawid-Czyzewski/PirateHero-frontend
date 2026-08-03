import { vi } from 'vitest';

export type UserTestDouble = {
  user: Record<string, unknown> | null;
  setUser: ReturnType<typeof vi.fn>;
  fetchUserData: ReturnType<typeof vi.fn>;
  updateUser: ReturnType<typeof vi.fn>;
};

export function createUserTestDouble(): UserTestDouble {
  return {
    user: null,
    setUser: vi.fn(),
    fetchUserData: vi.fn(async () => undefined),
    updateUser: vi.fn(async () => undefined),
  };
}

export function buildUseUserReturn(
  state: UserTestDouble,
  overrides: Record<string, unknown> = {}
) {
  return {
    user: state.user,
    isLoading: false,
    isFetching: false,
    isError: false,
    setUser: state.setUser,
    fetchUserData: state.fetchUserData,
    updateUser: state.updateUser,
    ...overrides,
  };
}
