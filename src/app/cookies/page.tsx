import type { Metadata } from "next";
import { LegalShell } from "@/components/legal/LegalShell";

export const metadata: Metadata = {
  title: "Polityka cookies",
  description:
    "Informacje o plikach cookies i podobnych technologiach używanych w Freak Legends.",
  alternates: { canonical: "/cookies" },
};

export default function CookiesPage() {
  return (
    <LegalShell title="Polityka cookies">
      <p>
        Freak Legends może używać plików cookies oraz podobnych technologii, aby
        utrzymać sesję, zapamiętać preferencje (np. zgody) i analizować ruch.
      </p>
      <h2 className="pt-4 text-lg font-bold text-white">Rodzaje</h2>
      <p>
        Cookies niezbędne — działanie serwisu i bezpieczeństwo. Cookies
        preferencji — zapis wyborów użytkownika. Cookies analityczne — tylko po
        zgodzie, o ile są włączone.
      </p>
      <h2 className="pt-4 text-lg font-bold text-white">Zarządzanie</h2>
      <p>
        Zgodę możesz zmienić w banerze cookies lub ustawieniach przeglądarki.
        Wyłączenie części cookies może ograniczyć funkcje gry.
      </p>
      <p className="text-sm text-zinc-500">Ostatnia aktualizacja: 18.10.2026</p>
    </LegalShell>
  );
}
