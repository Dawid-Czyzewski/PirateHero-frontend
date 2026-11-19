import type { Metadata } from "next";
import { TrainingView } from "@/components/character/training/TrainingView";

export const metadata: Metadata = {
  title: "Trening",
  description: "Trenuj siłę, kondycję, technikę i charyzmę swojego zawodnika za Kondychę.",
  robots: { index: false, follow: false },
};

export default function TrainingPage() {
  return <TrainingView />;
}
