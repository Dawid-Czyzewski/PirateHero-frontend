import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { BottomBar } from "@/components/game/nav/BottomBar";
import { SideMenu } from "@/components/game/nav/SideMenu";
import { logout } from "@/modules/auth/authService";

const replace = vi.fn();
const router = { replace };

vi.mock("next/navigation", () => ({ useRouter: () => router }));
vi.mock("@/modules/auth/authService", () => ({ logout: vi.fn() }));

const logoutMock = vi.mocked(logout);

function nav() {
  return within(screen.getByRole("navigation", { name: "Menu gry" }));
}

describe("SideMenu", () => {
  afterEach(() => {
    logoutMock.mockReset();
    replace.mockReset();
  });

  it("highlights the current screen", () => {
    render(<SideMenu pathname="/postac" />);

    const current = nav().getByRole("link", { name: "Postać" });
    expect(current).toHaveAttribute("href", "/postac");
    expect(current).toHaveAttribute("aria-current", "page");
  });

  it("does not highlight anything on other screens", () => {
    render(<SideMenu pathname="/create-character" />);

    expect(nav().getByRole("link", { name: "Postać" })).not.toHaveAttribute("aria-current");
  });

  it("shows screens that do not exist yet as inactive with a coming soon label", () => {
    render(<SideMenu pathname="/postac" />);

    expect(nav().getAllByRole("link").map((link) => link.getAttribute("href"))).toEqual(["/postac", "/trening"]);
    for (const label of ["Zlecenia", "Oktagon", "Ranking", "Sklep"]) {
      const entry = nav().getByText(label).parentElement;
      expect(entry).toHaveTextContent(`${label}Wkrótce`);
      expect(entry?.closest("a")).toBeNull();
    }
  });

  it("logs out and goes to the login page", async () => {
    logoutMock.mockResolvedValue(true);
    const user = userEvent.setup();
    render(<SideMenu pathname="/postac" />);

    await user.click(nav().getByRole("button", { name: "Wyloguj" }));

    expect(logoutMock).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(replace).toHaveBeenCalledWith("/login"));
  });

  it("stays on the screen and explains a failed logout", async () => {
    logoutMock.mockResolvedValue(false);
    const user = userEvent.setup();
    render(<SideMenu pathname="/postac" />);

    await user.click(nav().getByRole("button", { name: "Wyloguj" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Nie udało się wylogować");
    expect(replace).not.toHaveBeenCalled();
    expect(nav().getByRole("button", { name: "Wyloguj" })).toBeEnabled();
  });
});

describe("BottomBar", () => {
  it("shows the main screens and hides the rest behind the more button", async () => {
    const user = userEvent.setup();
    render(<BottomBar pathname="/postac" />);

    expect(nav().getByRole("link", { name: "Postać" })).toHaveAttribute("aria-current", "page");
    expect(nav().queryByText("Ranking")).toBeNull();

    const more = nav().getByRole("button", { name: "Więcej" });
    await user.click(more);

    expect(more).toHaveAttribute("aria-expanded", "true");
    expect(nav().getByText("Ranking")).toBeInTheDocument();
    expect(nav().getByText("Sklep")).toBeInTheDocument();
    expect(nav().getByRole("button", { name: "Wyloguj" })).toBeInTheDocument();
  });

  it("closes the more panel with Escape", async () => {
    const user = userEvent.setup();
    render(<BottomBar pathname="/postac" />);

    await user.click(nav().getByRole("button", { name: "Więcej" }));
    await user.keyboard("{Escape}");

    expect(nav().getByRole("button", { name: "Więcej" })).toHaveAttribute("aria-expanded", "false");
    expect(nav().queryByText("Ranking")).toBeNull();
  });
});
