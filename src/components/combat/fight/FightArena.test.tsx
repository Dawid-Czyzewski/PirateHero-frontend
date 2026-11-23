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

    expect(screen.getByText("K.O.!")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Wygrana" })).toBeInTheDocument();
    expect(screen.getByText("+25")).toBeInTheDocument();
    expect(screen.getByText("+15")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Pomiń" })).not.toBeInTheDocument();
    expect(onSettled).toHaveBeenCalledTimes(1);
  });

  it("skips straight to the result", () => {
    const { onSettled } = renderArena(LOST);

    act(() => screen.getByRole("button", { name: "Pomiń" }).click());

    expect(screen.getByRole("heading", { name: "Przegrana" })).toBeInTheDocument();
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
