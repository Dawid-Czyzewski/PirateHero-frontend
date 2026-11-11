import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { CharacterCreator } from "@/components/character/CharacterCreator";

function renderCreator() {
  return { user: userEvent.setup(), ...render(<CharacterCreator nick="Cebulak" />) };
}

describe("CharacterCreator", () => {
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

  it("keeps the create button disabled until saving is available", () => {
    renderCreator();

    expect(screen.getByRole("button", { name: /stwórz postać/i })).toBeDisabled();
    expect(screen.getByRole("button", { name: /losuj/i })).toBeEnabled();
  });
});
