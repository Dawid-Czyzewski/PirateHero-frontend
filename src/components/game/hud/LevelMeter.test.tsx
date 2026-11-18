import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LevelMeter } from "@/components/game/hud/LevelMeter";

function renderMeter() {
  render(<LevelMeter level={3} experience={{ current: 120, required: 300 }} />);
}

describe("LevelMeter", () => {
  it("shows the level and the experience in one line", () => {
    renderMeter();

    expect(screen.getByText("Poziom 3")).toBeInTheDocument();
    expect(screen.getByText("120 / 300 XP")).toBeInTheDocument();
  });

  it("exposes experience and what is missing to screen readers", () => {
    renderMeter();

    const bar = screen.getByRole("progressbar", {
      name: "Doświadczenie: 120 z 300 XP. Brakuje 180 XP do poziomu 4.",
    });
    expect(bar).toHaveAttribute("aria-valuemin", "0");
    expect(bar).toHaveAttribute("aria-valuemax", "300");
    expect(bar).toHaveAttribute("aria-valuenow", "120");
    expect(bar.firstElementChild).toHaveStyle({ width: "40%" });
  });
});
