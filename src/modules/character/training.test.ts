import { describe, expect, it } from "vitest";
import {
  applyTraining,
  revertTraining,
  canAffordTraining,
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
    fightPoints: { current: 10, max: 10, nextPointInSeconds: null },
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
