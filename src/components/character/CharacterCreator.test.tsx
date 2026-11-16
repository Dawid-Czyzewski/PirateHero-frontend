import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { CharacterCreator } from "@/components/character/CharacterCreator";
import { createCharacter, type CreateCharacterResult } from "@/modules/character/createCharacter";

const push = vi.fn();
const replace = vi.fn();
const router = { push, replace };

vi.mock("next/navigation", () => ({ useRouter: () => router }));
vi.mock("@/modules/character/createCharacter", () => ({ createCharacter: vi.fn() }));

const createMock = vi.mocked(createCharacter);

function renderCreator() {
  return { user: userEvent.setup(), ...render(<CharacterCreator nick="Cebulak" />) };
}

function tiles(part: string) {
  return within(screen.getByRole("radiogroup", { name: `${part}: wybierz wariant` }));
}

function preview() {
  return screen.getByRole("img", { name: /podgląd zawodnika/i });
}

describe("CharacterCreator", () => {
  afterEach(() => {
    createMock.mockReset();
    push.mockReset();
    replace.mockReset();
    vi.restoreAllMocks();
  });

  it("shows the player nick on the stage and named face variants", () => {
    renderCreator();

    expect(screen.getByText("Cebulak")).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Twarz" })).toHaveAttribute("aria-selected", "true");
    expect(tiles("Twarz").getAllByRole("radio").map((tile) => tile.textContent)).toEqual([
      "Zakapior",
      "Luzak",
      "Wściekły",
      "Cwaniak",
      "Zimny drań",
      "Wesołek",
      "Bandzior",
      "Po przejściach",
    ]);
    expect(tiles("Twarz").getByRole("radio", { name: "Zakapior" })).toHaveAttribute("aria-checked", "true");
  });

  it("switches tabs and picks a variant from the tiles", async () => {
    const { user } = renderCreator();

    await user.click(screen.getByRole("tab", { name: "Włosy" }));
    await user.click(tiles("Włosy").getByRole("radio", { name: "Irokez" }));

    expect(tiles("Włosy").getByRole("radio", { name: "Irokez" })).toHaveAttribute("aria-checked", "true");
    expect(tiles("Włosy").getByRole("radio", { name: "Na łyso" })).toHaveAttribute("aria-checked", "false");
    expect(preview()).toHaveAccessibleName(/włosy: Irokez/);
  });

  it("offers five skin tones", async () => {
    const { user } = renderCreator();

    await user.click(screen.getByRole("tab", { name: "Skóra" }));

    expect(tiles("Skóra").getAllByRole("radio")).toHaveLength(5);
  });

  it("moves the selection with arrow keys and wraps around", async () => {
    const { user } = renderCreator();

    await user.click(screen.getByRole("tab", { name: "Broda" }));
    await user.click(tiles("Broda").getByRole("radio", { name: "Gładko" }));
    await user.keyboard("{ArrowLeft}");

    expect(tiles("Broda").getByRole("radio", { name: "Podkowa" })).toHaveAttribute("aria-checked", "true");
    expect(tiles("Broda").getByRole("radio", { name: "Podkowa" })).toHaveFocus();
    expect(preview()).toHaveAccessibleName(/broda: Podkowa/);
  });

  it("moves between tabs with arrow keys", async () => {
    const { user } = renderCreator();

    await user.click(screen.getByRole("tab", { name: "Twarz" }));
    await user.keyboard("{ArrowLeft}");

    expect(screen.getByRole("tab", { name: "Skóra" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tab", { name: "Skóra" })).toHaveFocus();
    expect(screen.getByRole("radiogroup", { name: "Skóra: wybierz wariant" })).toBeInTheDocument();
  });

  it("randomizes every part with the dice button", async () => {
    vi.spyOn(Math, "random").mockReturnValue(0.99);
    const { user } = renderCreator();

    await user.click(screen.getByRole("button", { name: "Losuj wygląd" }));

    expect(preview()).toHaveAccessibleName(
      "Podgląd zawodnika: twarz: Po przejściach, włosy: Zaczes do tyłu, broda: Podkowa, tatuaż: Dwa iksy, skóra: Ciemna",
    );
  });

  it("shows the starting stats", () => {
    renderCreator();

    const stats = within(screen.getByRole("region", { name: "Statystyki na start" }));
    expect(stats.getAllByRole("listitem").map((item) => item.textContent)).toEqual([
      "Siła 1",
      "Kondycja 1",
      "Technika 1",
      "Charyzma 1",
      "HP 15",
    ]);
  });

  it("creates the character with the chosen indexes and opens the profile", async () => {
    createMock.mockResolvedValue({ kind: "created" });
    const { user } = renderCreator();

    await user.click(tiles("Twarz").getByRole("radio", { name: "Luzak" }));
    await user.click(screen.getByRole("tab", { name: "Tatuaż" }));
    await user.click(tiles("Tatuaż").getByRole("radio", { name: "Dwa iksy" }));
    await user.click(screen.getByRole("button", { name: /stwórz postać/i }));

    expect(createMock).toHaveBeenCalledWith({ face: 1, hair: 0, beard: 0, skin: 0, tattoo: 7 });
    await waitFor(() => expect(push).toHaveBeenCalledWith("/postac"));
    expect(screen.getByText(/zawodnik gotowy/i)).toBeInTheDocument();
  });

  it("locks the buttons while saving and ignores double clicks", async () => {
    let finish: (result: CreateCharacterResult) => void = () => undefined;
    createMock.mockReturnValue(new Promise((resolve) => (finish = resolve)));
    const { user } = renderCreator();

    await user.dblClick(screen.getByRole("button", { name: /stwórz postać/i }));

    expect(createMock).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("button", { name: /tworzenie/i })).toBeDisabled();
    expect(screen.getByRole("button", { name: /losuj/i })).toBeDisabled();
    finish({ kind: "failure", reason: "unexpected" });
    expect(await screen.findByRole("button", { name: /stwórz postać/i })).toBeEnabled();
  });

  it("links to the profile when the player already has a character", async () => {
    createMock.mockResolvedValue({ kind: "exists" });
    const { user } = renderCreator();

    await user.click(screen.getByRole("button", { name: /stwórz postać/i }));

    expect(await screen.findByText(/masz już zawodnika/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Przejdź do postaci" })).toHaveAttribute("href", "/postac");
    expect(push).not.toHaveBeenCalled();
  });

  it("sends a player with an expired session to the login page", async () => {
    createMock.mockResolvedValue({ kind: "unauthenticated" });
    const { user } = renderCreator();

    await user.click(screen.getByRole("button", { name: /stwórz postać/i }));

    await waitFor(() => expect(replace).toHaveBeenCalledWith("/login"));
    expect(screen.getByText(/sesja wygasła/i)).toBeInTheDocument();
  });

  it("marks the invalid part and shows its error under the tiles", async () => {
    createMock.mockResolvedValue({ kind: "invalid", errors: { skin: "Skóra: wybierz poprawny wariant." } });
    const { user } = renderCreator();

    await user.click(screen.getByRole("button", { name: /stwórz postać/i }));

    expect(await screen.findByText(/popraw zaznaczone/i)).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Skóra" })).toHaveAttribute("data-invalid", "true");
    await user.click(screen.getByRole("tab", { name: "Skóra" }));
    expect(screen.getByRole("tabpanel")).toHaveAccessibleDescription("Skóra: wybierz poprawny wariant.");
    expect(push).not.toHaveBeenCalled();
  });

  it("offers a retry after a network error", async () => {
    createMock.mockResolvedValueOnce({ kind: "failure", reason: "network" });
    createMock.mockResolvedValueOnce({ kind: "created" });
    const { user } = renderCreator();

    await user.click(screen.getByRole("button", { name: /stwórz postać/i }));
    expect(await screen.findByText(/brak połączenia z serwerem gry/i)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Spróbuj ponownie" }));

    expect(createMock).toHaveBeenCalledTimes(2);
    await waitFor(() => expect(push).toHaveBeenCalledWith("/postac"));
  });
});
