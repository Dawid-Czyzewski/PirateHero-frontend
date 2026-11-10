import { render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SessionExpiryListener } from "@/components/auth/SessionExpiryListener";
import { notifySessionExpired } from "@/lib/api/sessionEvents";
import { endExpiredSession } from "@/modules/auth/sessionExpiry";

const router = { replace: vi.fn() };

vi.mock("next/navigation", () => ({ useRouter: () => router }));
vi.mock("@/modules/auth/sessionExpiry", () => ({ endExpiredSession: vi.fn() }));

const endMock = vi.mocked(endExpiredSession);

describe("SessionExpiryListener", () => {
  afterEach(() => {
    endMock.mockReset();
  });

  it("ends the session when the API reports it expired", () => {
    render(<SessionExpiryListener />);

    notifySessionExpired();

    expect(endMock).toHaveBeenCalledWith(router);
  });

  it("stops listening after unmount", () => {
    const { unmount } = render(<SessionExpiryListener />);

    unmount();
    notifySessionExpired();

    expect(endMock).not.toHaveBeenCalled();
  });
});
