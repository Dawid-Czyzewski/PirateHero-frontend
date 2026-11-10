import { afterEach, describe, expect, it, vi } from "vitest";
import { logout } from "@/modules/auth/authService";
import { endExpiredSession } from "@/modules/auth/sessionExpiry";

vi.mock("@/modules/auth/authService", () => ({ logout: vi.fn() }));

const logoutMock = vi.mocked(logout);

describe("endExpiredSession", () => {
  afterEach(() => {
    logoutMock.mockReset();
  });

  it("logs out before redirecting to login", async () => {
    const order: string[] = [];
    logoutMock.mockImplementation(async () => {
      order.push("logout");
    });
    const replace = vi.fn(() => {
      order.push("redirect");
    });

    await endExpiredSession({ replace });

    expect(replace).toHaveBeenCalledWith("/login");
    expect(order).toEqual(["logout", "redirect"]);
  });
});
