import { render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { GuestOnly } from "@/components/auth/GuestOnly";
import { fetchCurrentUser } from "@/modules/auth/currentUser";
import { resolvePlayerHome } from "@/modules/character/playerHome";

const router = { replace: vi.fn() };

vi.mock("next/navigation", () => ({ useRouter: () => router }));
vi.mock("@/modules/auth/currentUser", () => ({ fetchCurrentUser: vi.fn() }));
vi.mock("@/modules/character/playerHome", () => ({ resolvePlayerHome: vi.fn() }));

const userMock = vi.mocked(fetchCurrentUser);
const homeMock = vi.mocked(resolvePlayerHome);

function renderGate() {
  render(
    <GuestOnly>
      <form aria-label="Logowanie" />
    </GuestOnly>,
  );
}

describe("GuestOnly", () => {
  afterEach(() => {
    userMock.mockReset();
    homeMock.mockReset();
    router.replace.mockReset();
  });

  it("shows the form to a guest", async () => {
    userMock.mockResolvedValue({ kind: "unauthenticated" });

    renderGate();

    expect(await screen.findByRole("form", { name: "Logowanie" })).toBeInTheDocument();
    expect(router.replace).not.toHaveBeenCalled();
  });

  it("shows the form when the server cannot confirm a session", async () => {
    userMock.mockResolvedValue({ kind: "unavailable" });

    renderGate();

    expect(await screen.findByRole("form", { name: "Logowanie" })).toBeInTheDocument();
  });

  it.each(["/create-character", "/postac"])("sends a logged-in player to %s", async (home) => {
    userMock.mockResolvedValue({ kind: "authenticated", user: { id: "u1", email: "a@b.pl", nick: "Cebulak" } });
    homeMock.mockResolvedValue(home);

    renderGate();

    await waitFor(() => expect(router.replace).toHaveBeenCalledWith(home));
    expect(screen.queryByRole("form")).not.toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent(/jesteś już zalogowany/i);
  });
});
