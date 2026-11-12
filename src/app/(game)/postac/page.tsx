import type { Metadata } from "next";
import { CharacterSheetView } from "@/components/character/sheet/CharacterSheetView";

export const metadata: Metadata = {
  title: "Postać",
  description: "Twój zawodnik Freak Legends: poziom, zdrowie, statystyki, waluty i ekwipunek.",
  robots: { index: false, follow: false },
};

export default function CharacterSheetPage() {
  return <CharacterSheetView />;
}
