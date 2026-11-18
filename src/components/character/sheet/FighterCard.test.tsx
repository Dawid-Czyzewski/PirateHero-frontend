import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FighterCard } from "@/components/character/sheet/FighterCard";

function renderCard() {
  render(<FighterCard level={3} experience={{ current: 120, required: 300 }} maxHp={45} aside={<p>Portfel</p>} />);
}

describe("FighterCard", () => {
  it("shows the level, experience and what is missing to the next level", () => {
    renderCard();

    expect(screen.getByText("Poziom 3")).toBeInTheDocument();
    expect(screen.getByText("Portfel")).toBeInTheDocument();
    expect(screen.getByText(/do poziomu 4/)).toHaveTextContent("Brakuje 180 XP do poziomu 4");
  });

  it("exposes the experience bar to screen readers", () => {
    renderCard();

    const bar = screen.getByRole("progressbar", { name: "Doświadczenie: 120 z 300 XP" });
    expect(bar).toHaveAttribute("aria-valuemin", "0");
    expect(bar).toHaveAttribute("aria-valuemax", "300");
    expect(bar).toHaveAttribute("aria-valuenow", "120");
    expect(bar.firstElementChild).toHaveStyle({ width: "40%" });
  });

  it("keeps health as a separate bar", () => {
    renderCard();

    const health = screen.getByRole("progressbar", { name: "Zdrowie: 45 z 45 HP" });
    expect(health).toHaveAttribute("aria-valuenow", "45");
    expect(health).toHaveAttribute("aria-valuemax", "45");
    expect(screen.getAllByRole("progressbar")).toHaveLength(2);
  });
});
