import type { Metadata } from "next";
import { CreateCharacterView } from "@/components/character/CreateCharacterView";

export const metadata: Metadata = {
  title: "Stwórz zawodnika",
  description: "Kreator postaci Freak Legends: wybierz twarz, włosy, zarost, skórę i tatuaż swojego zawodnika.",
  robots: { index: false, follow: false },
};

export default function CreateCharacterPage() {
  return <CreateCharacterView />;
}
