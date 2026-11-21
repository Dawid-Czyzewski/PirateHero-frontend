import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { GameIcon, type GameIconSize } from "@/components/game/GameIcon";
import { STAT_ICON_SRC } from "@/modules/character/layerAssets";

function iconImage(size: GameIconSize) {
  const { container } = render(<GameIcon src={STAT_ICON_SRC.charisma} size={size} />);
  const image = container.querySelector("img");
  if (!image) throw new Error("icon image missing");
  return image;
}

describe("GameIcon", () => {
  it("renders a decorative image of the mapped icon", () => {
    const image = iconImage(36);

    expect(image).toHaveAttribute("alt", "");
    expect(image.getAttribute("src")).toContain("ikona-charyzma.png");
  });

  it.each([
    [24, "size-6"],
    [32, "size-8"],
    [48, "size-12"],
  ] as const)("sizes the icon to %ipx", (size, className) => {
    const image = iconImage(size);

    expect(image).toHaveClass(className);
    expect(image).toHaveAttribute("width", String(size));
  });
});
