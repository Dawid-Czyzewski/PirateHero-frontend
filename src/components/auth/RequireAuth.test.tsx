import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { fetchCurrentUser } from "@/modules/auth/currentUser";

const router = { replace: vi.fn() };

vi.mock("next/navigation", () => ({ useRouter: () => router }));
vi.mock("@/modules/auth/currentUser", () => ({ fetchCurrentUser: vi.fn() }));

const fetchMock = vi.mocked(fetchCurrentUser);

function renderGuarded() {
  return render(<RequireAuth>{(user) => <p>Witaj {user.nick}</p>}</RequireAuth>);
}

describe("RequireAuth", () => {
  afterEach(() => {
    fetchMock.mockReset();
    router.replace.mockReset();
  });

  it("shows a loader, then the protected content", async () => {
    fetchMock.mockResolvedValue({ kind: "authenticated", user: { id: "u1", email: "a@b.pl", nick: "Cebulak" } });

    renderGuarded();

    expect(screen.getByRole("status")).toHaveTextContent(/sprawdzamy/i);
    expect(await screen.findByText("Witaj Cebulak")).toBeInTheDocument();
    expect(router.replace).not.toHaveBeenCalled();
  });

  it("redirects a guest to login without showing content", async () => {
    fetchMock.mockResolvedValue({ kind: "unauthenticated" });

    renderGuarded();

    await waitFor(() => expect(router.replace).toHaveBeenCalledWith("/login"));
    expect(screen.queryByText(/witaj/i)).not.toBeInTheDocument();
  });

  it("lets the player retry when the server is unavailable", async () => {
    fetchMock
      .mockResolvedValueOnce({ kind: "unavailable" })
      .mockResolvedValueOnce({ kind: "authenticated", user: { id: "u1", email: "a@b.pl", nick: "Cebulak" } });
    const user = userEvent.setup();

    renderGuarded();
    await user.click(await screen.findByRole("button", { name: /spróbuj ponownie/i }));

    expect(await screen.findByText("Witaj Cebulak")).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
