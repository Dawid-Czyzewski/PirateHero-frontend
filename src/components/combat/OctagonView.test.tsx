import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { OctagonView } from "@/components/combat/OctagonView";
import type { CharacterSheet } from "@/modules/character/characterSheet";
import { CharacterSheetProvider } from "@/modules/character/hooks/CharacterSheetContext";
import { fetchMyCharacter } from "@/modules/character/myCharacter";
import { FIGHT_AGAINST_KOSA, KOSA, MLODY_WILK, REKIN } from "@/modules/combat/__fixtures__/combat";
import { fightNpc } from "@/modules/combat/fightNpc";
import { fetchNpcs } from "@/modules/combat/npcs";

const replace = vi.fn();
const router = { replace };

vi.mock("next/navigation", () => ({ useRouter: () => router }));
vi.mock("@/modules/character/myCharacter", () => ({ fetchMyCharacter: vi.fn() }));
vi.mock("@/modules/combat/npcs", () => ({ fetchNpcs: vi.fn() }));
vi.mock("@/modules/combat/fightNpc", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/modules/combat/fightNpc")>()),
  fightNpc: vi.fn(),
}));

const characterMock = vi.mocked(fetchMyCharacter);
const npcsMock = vi.mocked(fetchNpcs);
const fightMock = vi.mocked(fightNpc);

const PLAYER: CharacterSheet = {
  id: "c1",
  nick: "Cebulak",
  level: 2,
  maxHp: 20,
  experience: { current: 10, required: 200 },
  stats: { strength: 1, endurance: 1, technique: 1, charisma: 1 },
  stamina: { current: 100, max: 100, nextPointInSeconds: null },
  wallet: { onions: 100, goldTeeth: 10, reach: 0, medals: 0 },
  appearance: { face: 0, hair: 0, beard: 0, skin: 0, tattoo: 0 },
};

function renderOctagon() {
  characterMock.mockResolvedValue({ kind: "loaded", character: PLAYER });
  return render(
    <CharacterSheetProvider>
      <OctagonView />
    </CharacterSheetProvider>,
  );
}

describe("OctagonView", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("lists opponents in order with level, stats and a fight button", async () => {
    npcsMock.mockResolvedValue({ kind: "loaded", npcs: [KOSA, MLODY_WILK, REKIN] });
    renderOctagon();

    expect(await screen.findByRole("heading", { level: 1, name: "Oktagon" })).toBeInTheDocument();
    const cards = await screen.findAllByRole("article");
    expect(cards.map((card) => within(card).getByRole("heading", { level: 3 }).textContent)).toEqual(["Kosa", "Młody Wilk", "Rekin"]);

    const kosa = within(cards[0]);
    expect(kosa.getByText("Poziom 1")).toBeInTheDocument();
    expect(kosa.getByText("Siła").nextElementSibling).toHaveTextContent("1");
    expect(kosa.getByRole("button", { name: "Walcz: Kosa" })).toBeInTheDocument();
  });

  it("marks only much stronger opponents as hard", async () => {
    npcsMock.mockResolvedValue({ kind: "loaded", npcs: [KOSA, MLODY_WILK, REKIN] });
    renderOctagon();

    const cards = await screen.findAllByRole("article");

    expect(within(cards[0]).queryByText("Trudny")).not.toBeInTheDocument();
    expect(within(cards[1]).queryByText("Trudny")).not.toBeInTheDocument();
    expect(within(cards[2]).getByText("Trudny")).toBeInTheDocument();
  });

  it("fights the chosen opponent, shows the result and refreshes the character", async () => {
    npcsMock.mockResolvedValue({ kind: "loaded", npcs: [KOSA, REKIN] });
    fightMock.mockResolvedValue({ kind: "fought", fight: FIGHT_AGAINST_KOSA });
    renderOctagon();

    await userEvent.click(await screen.findByRole("button", { name: "Walcz: Kosa" }));

    expect(fightMock).toHaveBeenCalledWith("kosa");
    expect(await screen.findByRole("region", { name: "Walka: Cebulak kontra Kosa" })).toBeInTheDocument();
    expect(screen.queryByRole("article")).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Pomiń" }));

    expect(screen.getByRole("heading", { name: "Wygrana" })).toBeInTheDocument();
    await vi.waitFor(() => expect(characterMock).toHaveBeenCalledTimes(2));
  });

  it("starts a rematch against the same opponent and goes back to the list", async () => {
    npcsMock.mockResolvedValue({ kind: "loaded", npcs: [KOSA, REKIN] });
    fightMock.mockResolvedValue({ kind: "fought", fight: FIGHT_AGAINST_KOSA });
    renderOctagon();
    await userEvent.click(await screen.findByRole("button", { name: "Walcz: Kosa" }));
    await userEvent.click(await screen.findByRole("button", { name: "Pomiń" }));

    await userEvent.click(screen.getByRole("button", { name: "Walcz ponownie" }));
    await userEvent.click(await screen.findByRole("button", { name: "Pomiń" }));
    await userEvent.click(screen.getByRole("button", { name: "Wróć do listy" }));

    expect(fightMock.mock.calls).toEqual([["kosa"], ["kosa"]]);
    expect(screen.getAllByRole("article")).toHaveLength(2);
  });

  it("returns to the list with a Polish message when the fight fails", async () => {
    npcsMock.mockResolvedValue({ kind: "loaded", npcs: [KOSA] });
    fightMock.mockResolvedValue({ kind: "failure", reason: "unexpected" });
    renderOctagon();

    await userEvent.click(await screen.findByRole("button", { name: "Walcz: Kosa" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Serwer ma chwilowy problem. Spróbuj ponownie za moment.");
    expect(screen.getByRole("button", { name: "Walcz: Kosa" })).toBeEnabled();
  });

  it("shows a skeleton while opponents load", async () => {
    npcsMock.mockReturnValue(new Promise(() => undefined));
    renderOctagon();

    expect(await screen.findByText("Wczytujemy przeciwników…")).toBeInTheDocument();
  });

  it("lets the player retry after a failed load", async () => {
    npcsMock.mockResolvedValueOnce({ kind: "unavailable" }).mockResolvedValueOnce({ kind: "loaded", npcs: [KOSA] });
    renderOctagon();

    expect(await screen.findByRole("alert")).toHaveTextContent("Nie udało się wczytać przeciwników.");
    await userEvent.click(screen.getByRole("button", { name: "Spróbuj ponownie" }));

    expect(await screen.findByRole("button", { name: "Walcz: Kosa" })).toBeInTheDocument();
    expect(npcsMock).toHaveBeenCalledTimes(2);
  });

  it("explains an empty octagon", async () => {
    npcsMock.mockResolvedValue({ kind: "loaded", npcs: [] });
    renderOctagon();

    expect(await screen.findByText("Oktagon jest dziś pusty. Zajrzyj później.")).toBeInTheDocument();
  });

  it("sends an expired session to the login page", async () => {
    npcsMock.mockResolvedValue({ kind: "unauthenticated" });
    renderOctagon();

    await vi.waitFor(() => expect(replace).toHaveBeenCalledWith("/login"));
  });
});
