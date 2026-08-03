const KEYS = ['token', 'refreshToken', 'userId'] as const;

export function clearAuthStorage(): void {
  for (const key of KEYS) {
    localStorage.removeItem(key);
  }
}

export function hasAuthTokens(): boolean {
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');
  return Boolean(token && userId);
}
