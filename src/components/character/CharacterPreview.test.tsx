import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CharacterPreview } from "@/components/character/CharacterPreview";
import { SKIN_TONES } from "@/components/character/preview/palette";
import { DEFAULT_APPEARANCE, withVariant } from "@/modules/character/appearance";

function layer(container: HTMLElement, name: string) {
  return container.querySelector(`[data-layer="${name}"]`);
}

describe("CharacterPreview", () => {
  it("stacks skin, tattoo, face, beard and hair layers with selected variants", () => {
    const appearance = { face: 2, hair: 5, beard: 1, skin: 3, tattoo: 6 };

    const { container } = render(<CharacterPreview appearance={appearance} />);

    const order = [...container.querySelectorAll("[data-layer]")].map((el) => el.getAttribute("data-layer"));
    expect(order).toEqual(["skin", "tattoo", "face", "beard", "hair"]);
    expect(layer(container, "hair")).toHaveAttribute("data-variant", "5");
    expect(layer(container, "skin")?.querySelector(`[fill="${SKIN_TONES[3].base}"]`)).not.toBeNull();
  });

  it("describes the shown variants for screen readers", () => {
    render(<CharacterPreview appearance={withVariant(DEFAULT_APPEARANCE, "beard", 4)} />);

    expect(screen.getByRole("img")).toHaveAccessibleName(
      "Podgląd zawodnika: twarz 1/8, włosy 1/8, zarost 5/8, skóra 1/5, tatuaż 1/8",
    );
  });

  it("draws nothing for empty variants", () => {
    const { container } = render(<CharacterPreview appearance={DEFAULT_APPEARANCE} />);

    expect(layer(container, "hair")?.childElementCount).toBe(0);
    expect(layer(container, "beard")?.childElementCount).toBe(0);
    expect(layer(container, "tattoo")?.childElementCount).toBe(0);
  });
});
