import type { Metadata } from "next";
import { LegalShell } from "@/components/legal/LegalShell";

export const metadata: Metadata = {
  title: "Rankingi",
  description:
    "Rankingi Freak Legends: zawodnicy według zwycięstw, popularności i pasów.",
  alternates: { canonical: "/rankingi" },
};

export default function RankingsPage() {
  return (
    <LegalShell title="Rankingi">
      <p>
        Po starcie rozgrywki ranking pokaże zawodników według zwycięstw,
        popularności i zdobytych pasów.
      </p>
      <p>Lista jest pusta do otwarcia gry.</p>
    </LegalShell>
  );
}
