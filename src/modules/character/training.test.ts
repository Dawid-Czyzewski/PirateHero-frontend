import { describe, expect, it } from "vitest";
import {
  applyTraining,
  revertTraining,
  canAffordTraining,
  formatCountdown,
  secondsUntilStamina,
  TRAINING_ACTION_LABEL,
  trainingWaitHint,
} from "@/modules/character/training";

const stamina = (current: number, nextPointInSeconds: number | null) => ({ current, max: 100, nextPointInSeconds });

describe("training rules", () => {
  it("names the cost on the action", () => {
    expect(TRAINING_ACTION_LABEL).toBe("Trenuj (-10 Kondychy)");
  });

  it("allows training from 10 stamina", () => {
    expect(canAffordTraining(stamina(10, 120))).toBe(true);
    expect(canAffordTraining(stamina(9, 120))).toBe(false);
  });

  it.each([
    [stamina(9, 134), 134],
    [stamina(7, 60), 60 + 2 * 180],
    [stamina(10, 50), 0],
    [stamina(100, null), 0],
  ])("counts seconds until enough stamina for %o", (value, expected) => {
    expect(secondsUntilStamina(value, 10)).toBe(expected);
  });

  it("formats countdowns as minutes and seconds", () => {
    expect(formatCountdown(134)).toBe("2:14");
    expect(formatCountdown(5)).toBe("0:05");
    expect(formatCountdown(1260)).toBe("21:00");
    expect(formatCountdown(-3)).toBe("0:00");
  });

  it("hints when training becomes possible", () => {
    expect(trainingWaitHint(stamina(8, 14))).toBe("Wystarczy Kondychy za 3:14");
    expect(trainingWaitHint(stamina(40, 14))).toBeNull();
  });
});

describe("optimistic training", () => {
  const character = {
    id: "c1",
    nick: "Cebulak",
    level: 1,
    maxHp: 20,
    experience: { current: 0, required: 100 },
    stats: { strength: 1, endurance: 1, technique: 1, charisma: 1 },
    stamina: stamina(100, null),
    wallet: { onions: 0, goldTeeth: 0, reach: 0, medals: 0 },
    appearance: { face: 0, hair: 0, beard: 0, skin: 0, tattoo: 0 },
  };

  it("raises the stat, spends stamina and starts regeneration from full", () => {
    const trained = applyTraining(character, "technique");

    expect(trained.stats.technique).toBe(2);
    expect(trained.stamina).toEqual(stamina(90, 180));
  });

  it("keeps the running regeneration timer", () => {
    expect(applyTraining({ ...character, stamina: stamina(50, 42) }, "strength").stamina).toEqual(stamina(40, 42));
  });

  it("undoes exactly one training", () => {
    expect(revertTraining(applyTraining(character, "charisma"), "charisma")).toEqual(character);
  });
});
