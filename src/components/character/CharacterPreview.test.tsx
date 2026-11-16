import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CharacterPreview } from "@/components/character/CharacterPreview";
import { DEFAULT_APPEARANCE, withVariant } from "@/modules/character/appearance";

function layer(container: HTMLElement, name: string) {
  return container.querySelector(`[data-layer="${name}"]`);
}

describe("CharacterPreview", () => {
  it("stacks skin, tattoo, beard, face and hair layers with selected variants", () => {
    const appearance = { face: 2, hair: 5, beard: 1, skin: 3, tattoo: 6 };

    const { container } = render(<CharacterPreview appearance={appearance} />);

    const order = [...container.querySelectorAll("[data-layer]")].map((el) => el.getAttribute("data-layer"));
    expect(order).toEqual(["skin", "tattoo", "beard", "face", "hair"]);
    expect(layer(container, "hair")).toHaveAttribute("data-variant", "5");
    expect(layer(container, "skin")).toHaveAttribute("data-variant", "3");
    expect(layer(container, "skin")?.querySelector("img")).toHaveAttribute("src", "/character/cialo-4.webp");
    expect(layer(container, "face")?.querySelector("img")).toHaveAttribute("src", "/character/twarz-3.webp");
  });

  it("describes the shown variants for screen readers", () => {
    render(<CharacterPreview appearance={withVariant(DEFAULT_APPEARANCE, "beard", 4)} />);

    expect(screen.getByRole("img")).toHaveAccessibleName(
      "Podgląd zawodnika: twarz: Zakapior, włosy: Na łyso, broda: Pełna broda, tatuaż: Czysta skóra, skóra: Blada",
    );
  });
});
