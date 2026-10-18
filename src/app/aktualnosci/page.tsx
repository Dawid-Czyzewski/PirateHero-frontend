import type { Metadata } from "next";
import { LegalShell } from "@/components/legal/LegalShell";

export const metadata: Metadata = {
  title: "Aktualności",
  description:
    "Aktualności Freak Legends: start gry, patche i wydarzenia społeczności.",
  alternates: { canonical: "/aktualnosci" },
};

export default function NewsPage() {
  return (
    <LegalShell title="Aktualności">
      <p>
        Tu publikujemy informacje o otwarciu gry, poprawkach i wydarzeniach.
        Najbliższy krok to start wersji publicznej.
      </p>
      <p>Data ostatniej informacji: 18.10.2026.</p>
    </LegalShell>
  );
}
