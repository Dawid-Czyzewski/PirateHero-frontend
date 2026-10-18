import type { Metadata } from "next";
import Link from "next/link";
import { LegalShell } from "@/components/legal/LegalShell";

export const metadata: Metadata = {
  title: "Rejestracja",
  description:
    "Załóż konto w Freak Legends i zacznij karierę zawodnika freak fightów w przeglądarce.",
  alternates: { canonical: "/register" },
  robots: { index: false, follow: false },
};

export default function RegisterPage() {
  return (
    <LegalShell title="Rejestracja">
      <p>
        Rejestracja konta będzie dostępna wraz z otwarciem gry. Zostaw śledzenie
        aktualności na stronie głównej albo wróć wkrótce, aby stworzyć
        zawodnika i walczyć o legendę.
      </p>
      <p>
        <Link
          href="/"
          className="inline-flex -skew-x-12 bg-red-600 px-8 py-3 text-[0.85rem] font-extrabold uppercase tracking-[0.12em] text-white hover:bg-red-700"
        >
          <span className="inline-block skew-x-12">Wróć na stronę główną</span>
        </Link>
      </p>
    </LegalShell>
  );
}
