import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { CharacterCreator } from "@/components/character/CharacterCreator";
import { createCharacter, type CreateCharacterResult } from "@/modules/character/createCharacter";

const push = vi.fn();

vi.mock("next/navigation", () => ({ useRouter: () => ({ push }) }));
vi.mock("@/modules/character/createCharacter", () => ({ createCharacter: vi.fn() }));

const createMock = vi.mocked(createCharacter);

function renderCreator() {
  return { user: userEvent.setup(), ...render(<CharacterCreator nick="Cebulak" />) };
}

describe("CharacterCreator", () => {
  afterEach(() => {
    createMock.mockReset();
    push.mockReset();
  });

  it("shows the player nick and a counter for every part", () => {
    renderCreator();

    expect(screen.getByText("Cebulak")).toBeInTheDocument();
    expect(screen.getByLabelText("Twarz: wariant 1/8")).toBeInTheDocument();
    expect(screen.getByLabelText("Skóra: wariant 1/5")).toBeInTheDocument();
  });

  it("changes variants with the arrows", async () => {
    const { user } = renderCreator();

    await user.click(screen.getByRole("button", { name: "Włosy: następny wariant" }));
    await user.click(screen.getByRole("button", { name: "Włosy: następny wariant" }));
    await user.click(screen.getByRole("button", { name: "Tatuaż: poprzedni wariant" }));

    expect(screen.getByLabelText("Włosy: wariant 3/8")).toBeInTheDocument();
    expect(screen.getByLabelText("Tatuaż: wariant 8/8")).toBeInTheDocument();
  });

  it("switches tabs and picks a variant from tiles", async () => {
    const { user } = renderCreator();

    await user.click(screen.getByRole("tab", { name: "Skóra" }));
    const tiles = screen.getByRole("radiogroup", { name: "Skóra: wybierz wariant" });
    await user.click(within(tiles).getByRole("radio", { name: "Skóra 4" }));

    expect(screen.getByRole("tab", { name: "Skóra" })).toHaveAttribute("aria-selected", "true");
    expect(within(tiles).getAllByRole("radio")).toHaveLength(5);
    expect(within(tiles).getByRole("radio", { name: "Skóra 4" })).toHaveAttribute("aria-checked", "true");
    expect(screen.getByLabelText("Skóra: wariant 4/5")).toBeInTheDocument();
  });

  it("creates the character with the chosen appearance and opens the profile", async () => {
    createMock.mockResolvedValue({ kind: "created" });
    const { user } = renderCreator();

    await user.click(screen.getByRole("button", { name: "Twarz: następny wariant" }));
    await user.click(screen.getByRole("button", { name: /stwórz postać/i }));

    expect(createMock).toHaveBeenCalledWith({ face: 1, hair: 0, beard: 0, skin: 0, tattoo: 0 });
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

  it("sends a player who already has a character to the profile", async () => {
    createMock.mockResolvedValue({ kind: "exists" });
    const { user } = renderCreator();

    await user.click(screen.getByRole("button", { name: /stwórz postać/i }));

    expect(await screen.findByText(/masz już zawodnika/i)).toBeInTheDocument();
    expect(push).toHaveBeenCalledWith("/postac");
  });

  it("shows validation errors next to the parts", async () => {
    createMock.mockResolvedValue({ kind: "invalid", errors: { skin: "Skóra: wybierz poprawny wariant." } });
    const { user } = renderCreator();

    await user.click(screen.getByRole("button", { name: /stwórz postać/i }));

    expect(await screen.findAllByText("Skóra: wybierz poprawny wariant.")).not.toHaveLength(0);
    expect(screen.getByRole("group", { name: "Skóra" })).toHaveAccessibleDescription("Skóra: wybierz poprawny wariant.");
    expect(screen.getByText(/popraw zaznaczone/i)).toBeInTheDocument();
    expect(push).not.toHaveBeenCalled();
  });

  it("shows a general message for other errors", async () => {
    createMock.mockResolvedValue({ kind: "failure", reason: "network" });
    const { user } = renderCreator();

    await user.click(screen.getByRole("button", { name: /stwórz postać/i }));

    expect(await screen.findByText(/brak połączenia z serwerem gry/i)).toBeInTheDocument();
    expect(push).not.toHaveBeenCalled();
  });

  it("refreshes the preview right after a change", async () => {
    const { user } = renderCreator();

    await user.click(screen.getByRole("button", { name: "Zarost: następny wariant" }));
    await user.click(screen.getByRole("tab", { name: "Włosy" }));
    await user.click(screen.getByRole("radio", { name: "Włosy 3" }));

    expect(screen.getByRole("img", { name: /zarost 2\/8/ })).toHaveAccessibleName(/włosy 3\/8/);
  });
});
