import type { Metadata } from "next";
import { LegalShell } from "@/components/legal/LegalShell";

export const metadata: Metadata = {
  title: "Regulamin",
  description:
    "Regulamin korzystania z Freak Legends — darmowej przeglądarkowej gry RPG w świecie freak fightów.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <LegalShell title="Regulamin">
      <p>
        Korzystając z Freak Legends, akceptujesz niniejszy regulamin. Gra jest
        przeznaczona dla osób pełnoletnich lub za zgodą opiekuna, zgodnie z
        lokalnym prawem.
      </p>
      <h2 className="pt-4 text-lg font-bold text-white">Konto gracza</h2>
      <p>
        Odpowiadasz za bezpieczeństwo logowania i treści powiązane z kontem.
        Zabrania się cheatów, botów, nękania oraz działań szkodzących rozgrywce
        lub innym graczom.
      </p>
      <h2 className="pt-4 text-lg font-bold text-white">Własność intelektualna</h2>
      <p>
        Nazwa Freak Legends, grafiki, kod i treści gry są chronione. Nie wolno
        ich kopiować ani wykorzystywać komercyjnie bez zgody.
      </p>
      <h2 className="pt-4 text-lg font-bold text-white">Zmiany</h2>
      <p>
        Możemy aktualizować regulamin i mechaniki gry. O istotnych zmianach
        poinformujemy w serwisie.
      </p>
      <p className="text-sm text-zinc-500">Ostatnia aktualizacja: 18.10.2026</p>
    </LegalShell>
  );
}
