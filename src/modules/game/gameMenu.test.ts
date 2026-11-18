import { describe, expect, it } from "vitest";
import { GAME_MENU, isCurrentPage, PRIMARY_MENU, SECONDARY_MENU } from "@/modules/game/gameMenu";

const character = GAME_MENU.find((item) => item.id === "character")!;
const training = GAME_MENU.find((item) => item.id === "training")!;

describe("game menu", () => {
  it("lists the screens in Hero Zero order with only the profile available", () => {
    expect(GAME_MENU.map((item) => [item.label, item.available])).toEqual([
      ["Postać", true],
      ["Trening", false],
      ["Zlecenia", false],
      ["Oktagon", false],
      ["Ranking", false],
      ["Sklep", false],
    ]);
  });

  it("splits items into the mobile bar and the more panel", () => {
    expect(PRIMARY_MENU.map((item) => item.id)).toEqual(["character", "training", "jobs", "octagon"]);
    expect(SECONDARY_MENU.map((item) => item.id)).toEqual(["ranking", "shop"]);
  });

  it("marks the current page and its sub pages", () => {
    expect(isCurrentPage(character, "/postac")).toBe(true);
    expect(isCurrentPage(character, "/postac/ekwipunek")).toBe(true);
    expect(isCurrentPage(character, "/postacie")).toBe(false);
  });

  it("never marks a screen that is not available yet", () => {
    expect(isCurrentPage(training, "/postac")).toBe(false);
  });
});
