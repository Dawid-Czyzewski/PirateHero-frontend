import { AUTH_ROUTES } from "@/modules/auth/authRoutes";
import { logout } from "@/modules/auth/authService";

export type Navigator = { replace: (href: string) => void };

export async function endExpiredSession(navigator: Navigator): Promise<void> {
  await logout();
  navigator.replace(AUTH_ROUTES.login);
}
