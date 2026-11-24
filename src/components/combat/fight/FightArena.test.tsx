import { act, render, screen, within } from "@testing-library/react";
import { StrictMode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { FightArena } from "@/components/combat/fight/FightArena";
import { DEFAULT_APPEARANCE } from "@/modules/character/appearance";
import { FIGHT_AGAINST_KOSA } from "@/modules/combat/__fixtures__/combat";
import type { Fight } from "@/modules/combat/fight";
import { ROUND_MS } from "@/modules/combat/hooks/useFightPlayback";

const LOST: Fight = {
  ...FIGHT_AGAINST_KOSA,
  winner: "npc",
  knockout: false,
  reward: { experience: 6, onions: 0 },
  level: { before: 1, after: 2 },
};

function renderArena(fight: Fight = FIGHT_AGAINST_KOSA) {
  const handlers = { onSettled: vi.fn(), onRematch: vi.fn(), onBack: vi.fn() };
  const view = render(<FightArena fight={fight} playerLook={DEFAULT_APPEARANCE} {...handlers} />);
  return { ...view, ...handlers };
}

function nextRound() {
  act(() => {
    vi.advanceTimersByTime(ROUND_MS);
  });
}

describe("FightArena", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("starts with full health bars for both fighters", () => {
    renderArena();

    expect(screen.getByRole("progressbar", { name: "Cebulak: 15 z 15 HP" })).toBeInTheDocument();
    expect(screen.getByRole("progressbar", { name: "Kosa: 15 z 15 HP" })).toBeInTheDocument();
    expect(screen.getByText("Gong!")).toBeInTheDocument();
  });

  it("plays the rounds with damage on the fighter who was hit", () => {
    renderArena();

    nextRound();

    expect(screen.getByText("Runda 1")).toBeInTheDocument();
    expect(screen.getByRole("progressbar", { name: "Kosa: 12 z 15 HP" })).toBeInTheDocument();
    expect(within(screen.getByTestId("blow")).getByText("-3")).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Wygrana" })).not.toBeInTheDocument();
  });

  it("grows the fight log with each revealed blow, newest first", () => {
    renderArena();
    expect(screen.queryByRole("list")).not.toBeInTheDocument();

    nextRound();
    const log = within(screen.getByRole("region", { name: "Historia walki" }));
    expect(log.getAllByRole("listitem").map((item) => item.textContent)).toEqual(["Runda 1: Cebulak → Kosa: -3. HP: Cebulak 15, Kosa 12"]);

    nextRound();
    expect(log.getAllByRole("listitem").map((item) => item.textContent)).toEqual([
      "Runda 2: Kosa → Cebulak: -3. HP: Cebulak 12, Kosa 12K.O.!",
      "Runda 1: Cebulak → Kosa: -3. HP: Cebulak 15, Kosa 12",
    ]);
  });

  it("shows the whole fight log when skipped and keeps the round banner quiet", () => {
    renderArena();

    act(() => screen.getByRole("button", { name: "Pomiń" }).click());

    const log = within(screen.getByRole("region", { name: "Historia walki" }));
    expect(log.getByRole("list").tagName).toBe("OL");
    expect(log.getAllByRole("listitem")).toHaveLength(2);
    expect(log.getByText("K.O.!")).toBeInTheDocument();
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("keeps exactly one avatar per fighter while rounds play", () => {
    const { container } = renderArena();

    nextRound();
    nextRound();

    expect(container.querySelectorAll('[data-layer="skin"]')).toHaveLength(2);
  });

  it("shows the knockout and the result after the last round", () => {
    const { onSettled } = renderArena();

    nextRound();
    nextRound();

    expect(screen.getByText("K.O.!", { selector: "p" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Wygrana" }).querySelector("img")?.getAttribute("src")).toContain("napis-wygrana");
    expect(screen.getByText("+25")).toBeInTheDocument();
    expect(screen.getByText("+15")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Pomiń" })).not.toBeInTheDocument();
    expect(onSettled).toHaveBeenCalledTimes(1);
  });

  it("skips straight to the result", () => {
    const { onSettled } = renderArena(LOST);

    act(() => screen.getByRole("button", { name: "Pomiń" }).click());

    expect(screen.getByRole("heading", { name: "Przegrana" }).querySelector("img")?.getAttribute("src")).toContain("napis-przegrana");
    expect(screen.getByText("Awans! Poziom 2")).toBeInTheDocument();
    expect(screen.queryByText("K.O.!")).not.toBeInTheDocument();
    expect(onSettled).toHaveBeenCalledTimes(1);
  });

  it("offers a rematch and a way back", () => {
    const { onRematch, onBack } = renderArena();
    act(() => screen.getByRole("button", { name: "Pomiń" }).click());

    act(() => screen.getByRole("button", { name: "Walcz ponownie" }).click());
    act(() => screen.getByRole("button", { name: "Wróć do listy" }).click());

    expect(onRematch).toHaveBeenCalledTimes(1);
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it("refreshes the character when leaving in the middle of the fight", () => {
    const { onSettled, unmount } = renderArena();

    nextRound();
    expect(onSettled).not.toHaveBeenCalled();

    unmount();
    act(() => {
      vi.runOnlyPendingTimers();
    });

    expect(onSettled).toHaveBeenCalledTimes(1);
  });

  it("does not refresh the character early under strict mode", () => {
    const onSettled = vi.fn();
    render(
      <StrictMode>
        <FightArena fight={FIGHT_AGAINST_KOSA} playerLook={DEFAULT_APPEARANCE} onSettled={onSettled} onRematch={vi.fn()} onBack={vi.fn()} />
      </StrictMode>,
    );

    nextRound();

    expect(onSettled).not.toHaveBeenCalled();
  });

  it("does not reveal the reward before the fight ends", () => {
    const { onSettled } = renderArena();

    nextRound();
    act(() => {
      vi.advanceTimersByTime(ROUND_MS / 2);
    });

    expect(onSettled).not.toHaveBeenCalled();
  });
});
