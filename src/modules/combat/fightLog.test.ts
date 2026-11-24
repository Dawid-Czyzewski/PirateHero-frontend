import { describe, expect, it } from "vitest";
import { FIGHT_AGAINST_KOSA } from "@/modules/combat/__fixtures__/combat";
import { describeRound, isKnockoutBlow } from "@/modules/combat/fightLog";

const [first, second] = FIGHT_AGAINST_KOSA.rounds;

describe("fight log", () => {
  it("describes the player's blow without declining nicknames", () => {
    expect(describeRound(first, FIGHT_AGAINST_KOSA)).toBe("Runda 1: Cebulak → Kosa: -3. HP: Cebulak 15, Kosa 12");
  });

  it("describes the opponent's blow", () => {
    expect(describeRound(second, FIGHT_AGAINST_KOSA)).toBe("Runda 2: Kosa → Cebulak: -3. HP: Cebulak 12, Kosa 12");
  });

  it("marks only the last blow of a knockout", () => {
    expect(isKnockoutBlow(second, FIGHT_AGAINST_KOSA)).toBe(true);
    expect(isKnockoutBlow(first, FIGHT_AGAINST_KOSA)).toBe(false);
    expect(isKnockoutBlow(second, { ...FIGHT_AGAINST_KOSA, knockout: false })).toBe(false);
  });
});
