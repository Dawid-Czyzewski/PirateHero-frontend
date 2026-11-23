import { describe, expect, it } from "vitest";
import { GAME_MENU, isCurrentPage, PRIMARY_MENU, SECONDARY_MENU } from "@/modules/game/gameMenu";

const character = GAME_MENU.find((item) => item.id === "character")!;
const training = GAME_MENU.find((item) => item.id === "training")!;
const jobs = GAME_MENU.find((item) => item.id === "jobs")!;

describe("game menu", () => {
  it("lists the screens in Hero Zero order with the profile, training and octagon available", () => {
    expect(GAME_MENU.map((item) => [item.label, item.available])).toEqual([
      ["Postać", true],
      ["Trening", true],
      ["Zlecenia", false],
      ["Oktagon", true],
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
    expect(isCurrentPage(training, "/trening")).toBe(true);
  });

  it("never marks a screen that is not available yet", () => {
    expect(isCurrentPage(jobs, "/postac")).toBe(false);
  });
});
