import type { Metadata } from "next";
import Link from "next/link";
import { LegalShell } from "@/components/legal/LegalShell";

export const metadata: Metadata = {
  title: "Logowanie",
  description:
    "Zaloguj się do Freak Legends i kontynuuj karierę w przeglądarkowym RPG o freak fightach.",
  alternates: { canonical: "/login" },
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <LegalShell title="Logowanie">
      <p>
        Panel logowania uruchomimy razem z otwarciem gry. Jeśli masz już konto
        testowe, wróć tutaj po starcie wersji publicznej.
      </p>
      <p>
        <Link
          href="/register"
          className="font-semibold text-red-500 underline-offset-4 hover:underline"
        >
          Przejdź do rejestracji
        </Link>{" "}
        albo{" "}
        <Link href="/" className="font-semibold text-white underline-offset-4 hover:underline">
          wróć na stronę główną
        </Link>
        .
      </p>
    </LegalShell>
  );
}
