import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { CharacterSheetView } from "@/components/character/sheet/CharacterSheetView";
import { GameHud } from "@/components/game/hud/GameHud";
import { CharacterSheetProvider } from "@/modules/character/hooks/CharacterSheetContext";
import type { CharacterSheet } from "@/modules/character/characterSheet";
import { fetchMyCharacter } from "@/modules/character/myCharacter";

const replace = vi.fn();
const router = { replace };

vi.mock("next/navigation", () => ({ useRouter: () => router }));
vi.mock("@/modules/character/myCharacter", () => ({ fetchMyCharacter: vi.fn() }));

const fetchMock = vi.mocked(fetchMyCharacter);

const CHARACTER: CharacterSheet = {
  id: "c1",
  nick: "Cebulak",
  level: 3,
  maxHp: 45,
  experience: { current: 120, required: 300 },
  stats: { strength: 4, endurance: 2, technique: 1, charisma: 5 },
  stamina: { current: 90, max: 100, nextPointInSeconds: 120 },
  wallet: { onions: 12500, goldTeeth: 10, reach: 0, medals: 2 },
  appearance: { face: 3, hair: 1, beard: 7, skin: 4, tattoo: 0 },
};

function renderScreen() {
  return render(
    <CharacterSheetProvider>
      <GameHud />
      <CharacterSheetView />
    </CharacterSheetProvider>,
  );
}

function termValue(list: HTMLElement, term: string) {
  return within(list).getByText(term).nextElementSibling?.textContent;
}

describe("CharacterSheetView", () => {
  afterEach(() => {
    fetchMock.mockReset();
    replace.mockReset();
  });

  it("keeps level, experience and wallet in the header bar", async () => {
    fetchMock.mockResolvedValue({ kind: "loaded", character: CHARACTER });
    renderScreen();

    const hud = within(await screen.findByRole("region", { name: "Twój zawodnik" }));
    expect(hud.getByText("Poziom 3")).toBeInTheDocument();
    expect(hud.getByRole("progressbar", { name: /Doświadczenie: 120 z 300 XP/ })).toBeInTheDocument();
    const wallet = hud.getByRole("region", { name: "Portfel" });
    expect(termValue(wallet, "Cebuliony")).toMatch(/^12\s500$/);
    expect(termValue(wallet, "Złote Zęby")).toBe("10");
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("shows health, stats and resources on the profile", async () => {
    fetchMock.mockResolvedValue({ kind: "loaded", character: CHARACTER });
    renderScreen();

    expect(await screen.findByText("Cebulak")).toBeInTheDocument();
    expect(screen.getByRole("region", { name: "Zdrowie" })).toHaveTextContent("45 HP");

    const stats = screen.getByRole("region", { name: "Statystyki" });
    expect(termValue(stats, "Siła")).toBe("4");
    expect(termValue(stats, "Charyzma")).toBe("5");

    const resources = screen.getByRole("region", { name: "Zasoby" });
    expect(termValue(resources, "Kondycha")).toBe("90/100");
    expect(termValue(resources, "Zasięgi")).toBe("0");
    expect(termValue(resources, "Medale")).toBe("2");
  });

  it("draws the saved appearance with the creator preview", async () => {
    fetchMock.mockResolvedValue({ kind: "loaded", character: CHARACTER });
    renderScreen();

    expect(await screen.findByRole("img", { name: /podgląd zawodnika/i })).toHaveAccessibleName(
      "Podgląd zawodnika: twarz: Cwaniak, włosy: Na jeża, broda: Podkowa, tatuaż: Czysta skóra, skóra: Ciemna",
    );
  });

  it("shows four empty worn equipment slots next to the fighter and in a row", async () => {
    fetchMock.mockResolvedValue({ kind: "loaded", character: CHARACTER });
    renderScreen();

    const [onStage, row] = await screen.findAllByRole("region", { name: "Założony ekwipunek" });
    for (const worn of [onStage, row]) {
      expect(within(worn).getAllByRole("listitem").map((slot) => slot.textContent)).toEqual([
        "RękawiceRękawice: pusty slot",
        "SpodenkiSpodenki: pusty slot",
        "ButyButy: pusty slot",
        "DodatekDodatek: pusty slot",
      ]);
    }
    expect(within(onStage).getAllByRole("list")).toHaveLength(2);
  });

  it("shows an empty backpack with six places and a counter", async () => {
    fetchMock.mockResolvedValue({ kind: "loaded", character: CHARACTER });
    renderScreen();

    const backpack = await screen.findByRole("region", { name: "Plecak" });
    expect(backpack).toHaveTextContent("Zajęte miejsca: 0 z 6");
    expect(within(backpack).getAllByRole("listitem")).toHaveLength(6);
    expect(within(backpack).getAllByRole("listitem")[0]).toHaveTextContent("Plecak, miejsce 1: puste");
  });

  it("shows a skeleton while loading", () => {
    fetchMock.mockReturnValue(new Promise(() => undefined));
    renderScreen();

    expect(screen.getByRole("status")).toHaveAttribute("aria-busy", "true");
    expect(screen.getByRole("status")).toHaveTextContent("Wczytujemy zawodnika…");
  });

  it.each([
    ["missing", "/create-character"],
    ["unauthenticated", "/login"],
  ] as const)("redirects a player whose result is %s to %s", async (kind, route) => {
    fetchMock.mockResolvedValue({ kind });
    renderScreen();

    await vi.waitFor(() => expect(replace).toHaveBeenCalledWith(route));
    expect(screen.getByRole("status")).toHaveTextContent("Wczytujemy zawodnika…");
  });

  it("shows an error and loads again on retry", async () => {
    fetchMock.mockResolvedValueOnce({ kind: "unavailable" });
    fetchMock.mockResolvedValueOnce({ kind: "loaded", character: CHARACTER });
    const user = userEvent.setup();
    renderScreen();

    expect(await screen.findByRole("alert")).toHaveTextContent("Nie udało się wczytać zawodnika.");
    await user.click(screen.getByRole("button", { name: "Spróbuj ponownie" }));

    expect(await screen.findByText("Cebulak")).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
