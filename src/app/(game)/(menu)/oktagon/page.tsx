import type { Metadata } from "next";
import { OctagonView } from "@/components/combat/OctagonView";

export const metadata: Metadata = {
  title: "Oktagon",
  description: "Wybierz przeciwnika w Oktagonie i walcz o doświadczenie i Cebuliony.",
  robots: { index: false, follow: false },
};

export default function OctagonPage() {
  return <OctagonView />;
}
