import { act, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { TrainingView } from "@/components/character/training/TrainingView";
import type { CharacterSheet } from "@/modules/character/characterSheet";
import { CharacterSheetProvider } from "@/modules/character/hooks/CharacterSheetContext";
import { fetchMyCharacter } from "@/modules/character/myCharacter";
import { trainStat, type TrainStatResult } from "@/modules/character/trainStat";

const replace = vi.fn();
const router = { replace };

vi.mock("next/navigation", () => ({ useRouter: () => router }));
vi.mock("@/modules/character/myCharacter", () => ({ fetchMyCharacter: vi.fn() }));
vi.mock("@/modules/character/trainStat", () => ({ trainStat: vi.fn() }));

const fetchMock = vi.mocked(fetchMyCharacter);
const trainMock = vi.mocked(trainStat);

const CHARACTER: CharacterSheet = {
  id: "c1",
  nick: "Cebulak",
  level: 2,
  maxHp: 30,
  experience: { current: 40, required: 200 },
  stats: { strength: 4, endurance: 2, technique: 1, charisma: 5 },
  stamina: { current: 70, max: 100, nextPointInSeconds: 134 },
  wallet: { onions: 0, goldTeeth: 0, reach: 0, medals: 0 },
  appearance: { face: 3, hair: 1, beard: 7, skin: 4, tattoo: 0 },
};

const TRAINED: CharacterSheet = {
  ...CHARACTER,
  stats: { ...CHARACTER.stats, strength: 5 },
  stamina: { current: 60, max: 100, nextPointInSeconds: 180 },
};

function renderTraining(character: CharacterSheet = CHARACTER) {
  fetchMock.mockResolvedValue({ kind: "loaded", character });
  return render(
    <CharacterSheetProvider>
      <TrainingView />
    </CharacterSheetProvider>,
  );
}

async function statCard(name: string) {
  return within(await screen.findByRole("region", { name }));
}

describe("TrainingView", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("shows stamina with the next point countdown and four stat cards", async () => {
    renderTraining();

    expect(await screen.findByRole("heading", { level: 1, name: "Trening" })).toBeInTheDocument();
    expect(screen.getByRole("progressbar", { name: "Kondycha: 70 z 100" })).toBeInTheDocument();
    expect(screen.getByRole("timer")).toHaveTextContent("Następny punkt za 2:14");
    expect(screen.getAllByRole("button", { name: "Trenuj (-10 Kondychy)" })).toHaveLength(4);
    expect((await statCard("Charyzma")).getByText("5")).toBeInTheDocument();
  });

  it("trains at once without waiting for the server, then keeps the confirmed state", async () => {
    let answer: (result: TrainStatResult) => void = () => undefined;
    trainMock.mockReturnValue(new Promise((resolve) => (answer = resolve)));
    renderTraining();
    const strength = await statCard("Siła");

    await userEvent.click(strength.getByRole("button", { name: "Trenuj (-10 Kondychy)" }));

    expect(strength.getByText("+1")).toBeInTheDocument();
    expect(strength.getByText("5")).toBeInTheDocument();
    expect(screen.getByRole("progressbar", { name: "Kondycha: 60 z 100" })).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("Siła: wzrost do 5");
    expect(strength.getByRole("button", { name: "Trenuj (-10 Kondychy)" })).toBeEnabled();
    expect(trainMock).toHaveBeenCalledWith("strength");

    await act(async () => answer({ kind: "trained", character: TRAINED }));

    expect(strength.getByText("5")).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("locks training below 10 stamina and says when it will be enough", async () => {
    renderTraining({ ...CHARACTER, stamina: { current: 8, max: 100, nextPointInSeconds: 14 } });
    const technique = await statCard("Technika");

    const button = technique.getByRole("button", { name: "Trenuj (-10 Kondychy)" });
    expect(button).toBeDisabled();
    expect(button).toHaveAccessibleDescription("Wystarczy Kondychy za 3:14");
  });

  it("rolls back and shows a Polish message instead of crashing when the API fails", async () => {
    trainMock.mockResolvedValue({ kind: "failure", reason: "unexpected" });
    renderTraining();
    const endurance = await statCard("Kondycja");

    await userEvent.click(endurance.getByRole("button", { name: "Trenuj (-10 Kondychy)" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Serwer ma chwilowy problem. Spróbuj ponownie za moment.");
    expect(endurance.getByText("2")).toBeInTheDocument();
    expect(endurance.getByRole("button", { name: "Trenuj (-10 Kondychy)" })).toBeEnabled();
  });
});
