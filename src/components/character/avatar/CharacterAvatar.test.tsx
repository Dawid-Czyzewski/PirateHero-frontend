import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { avatarLabel } from "@/components/character/avatar/avatarLabel";
import { CharacterAvatar } from "@/components/character/avatar/CharacterAvatar";

const APPEARANCE = { face: 2, hair: 5, beard: 1, skin: 3, tattoo: 6 };

function layers(container: HTMLElement) {
  return [...container.querySelectorAll<HTMLElement>("[data-layer]")];
}

describe("CharacterAvatar", () => {
  it("stacks body, tattoo, beard, face and hair with the chosen variants", () => {
    const { container } = render(<CharacterAvatar appearance={APPEARANCE} />);

    expect(layers(container).map((layer) => [layer.dataset.layer, layer.dataset.variant])).toEqual([
      ["skin", "3"],
      ["tattoo", "6"],
      ["beard", "1"],
      ["face", "2"],
      ["hair", "5"],
    ]);
    expect(layers(container)[4].querySelector("img")?.getAttribute("src")).toContain("wlosy-6.webp");
  });

  it("is announced with variant names when labelled", () => {
    render(<CharacterAvatar appearance={APPEARANCE} label={avatarLabel(APPEARANCE)} />);

    expect(screen.getByRole("img")).toHaveAccessibleName(
      "Podgląd zawodnika: twarz: Wściekły, włosy: Afro, broda: Wąsy, tatuaż: Drut na szyi, skóra: Śniada",
    );
  });

  it("is hidden from screen readers without a label", () => {
    const { container } = render(<CharacterAvatar appearance={APPEARANCE} />);

    expect(container.firstElementChild).toHaveAttribute("aria-hidden", "true");
  });
});
