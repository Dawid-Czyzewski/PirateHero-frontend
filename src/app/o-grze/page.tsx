import type { Metadata } from "next";
import { LegalShell } from "@/components/legal/LegalShell";

export const metadata: Metadata = {
  title: "O grze",
  description:
    "Jak działa Freak Legends: trening, walki, popularność i pasy w darmowej grze przeglądarkowej.",
  alternates: { canonical: "/o-grze" },
};

export default function AboutGamePage() {
  return (
    <LegalShell title="O grze">
      <p>
        Freak Legends to darmowa gra przeglądarkowa. Tworzysz zawodnika freak
        fightów i prowadzisz jego karierę bez instalowania programu.
      </p>
      <h2 className="pt-4 text-lg font-bold text-white">Trening</h2>
      <p>Rozwijasz atrybuty zawodnika i przygotowujesz go do kolejnych walk.</p>
      <h2 className="pt-4 text-lg font-bold text-white">Walki i pasy</h2>
      <p>
        Walczysz z innymi graczami, budujesz popularność i zdobywasz pasy na
        galach.
      </p>
    </LegalShell>
  );
}
