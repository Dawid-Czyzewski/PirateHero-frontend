import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { CharacterSheetView } from "@/components/character/sheet/CharacterSheetView";
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
  stats: { strength: 4, endurance: 2, technique: 1, charisma: 5 },
  wallet: { cebuliony: 12500, zloteZeby: 10, kondycha: 100, zasiegi: 0, medale: 2 },
  appearance: { face: 3, hair: 1, beard: 7, skin: 4, tattoo: 0 },
};

function termValue(list: HTMLElement, term: string) {
  return within(list).getByText(term).nextElementSibling?.textContent;
}

describe("CharacterSheetView", () => {
  afterEach(() => {
    fetchMock.mockReset();
    replace.mockReset();
  });

  it("shows the fighter with level, health, stats and wallet", async () => {
    fetchMock.mockResolvedValue({ kind: "loaded", character: CHARACTER });
    render(<CharacterSheetView />);

    expect(await screen.findByText("Cebulak")).toBeInTheDocument();
    expect(screen.getByText("Poziom 3")).toBeInTheDocument();
    expect(screen.getByText("45 HP")).toBeInTheDocument();

    const stats = screen.getByRole("region", { name: "Statystyki" });
    expect(termValue(stats, "Siła")).toBe("4");
    expect(termValue(stats, "Charyzma")).toBe("5");

    const wallet = screen.getByRole("region", { name: "Waluty" });
    expect(termValue(wallet, "Cebuliony")).toMatch(/^12\s500$/);
    expect(termValue(wallet, "Złote Zęby")).toBe("10");
    expect(termValue(wallet, "Medale")).toBe("2");
  });

  it("draws the saved appearance with the creator preview", async () => {
    fetchMock.mockResolvedValue({ kind: "loaded", character: CHARACTER });
    render(<CharacterSheetView />);

    expect(await screen.findByRole("img", { name: /podgląd zawodnika/i })).toHaveAccessibleName(
      "Podgląd zawodnika: twarz 4/8, włosy 2/8, zarost 8/8, skóra 5/5, tatuaż 1/8",
    );
  });

  it("shows four empty equipment slots", async () => {
    fetchMock.mockResolvedValue({ kind: "loaded", character: CHARACTER });
    render(<CharacterSheetView />);

    const equipment = await screen.findByRole("region", { name: "Ekwipunek" });
    const slots = within(equipment).getAllByRole("listitem");
    expect(slots.map((slot) => slot.textContent)).toEqual([
      "Rękawice: pusty slot",
      "Spodenki: pusty slot",
      "Buty: pusty slot",
      "Dodatek: pusty slot",
    ]);
  });

  it.each([
    ["missing", "/create-character"],
    ["unauthenticated", "/login"],
  ] as const)("redirects a player whose result is %s to %s", async (kind, route) => {
    fetchMock.mockResolvedValue({ kind });
    render(<CharacterSheetView />);

    await vi.waitFor(() => expect(replace).toHaveBeenCalledWith(route));
    expect(screen.getByRole("status")).toHaveTextContent("Wczytujemy zawodnika…");
  });

  it("shows an error and loads again on retry", async () => {
    fetchMock.mockResolvedValueOnce({ kind: "unavailable" });
    fetchMock.mockResolvedValueOnce({ kind: "loaded", character: CHARACTER });
    const user = userEvent.setup();
    render(<CharacterSheetView />);

    expect(await screen.findByRole("alert")).toHaveTextContent("Nie udało się wczytać zawodnika.");
    await user.click(screen.getByRole("button", { name: "Spróbuj ponownie" }));

    expect(await screen.findByText("Cebulak")).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
