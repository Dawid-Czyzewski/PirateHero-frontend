export const AUTH_ROUTES = {
  login: "/login",
  register: "/register",
} as const;

const GUEST_ROUTES: readonly string[] = [AUTH_ROUTES.login, AUTH_ROUTES.register];

export function isGuestRoute(pathname: string): boolean {
  return GUEST_ROUTES.includes(pathname);
}
