import type { Metadata } from "next";
import { LegalShell } from "@/components/legal/LegalShell";

export const metadata: Metadata = {
  title: "Kontakt",
  description:
    "Skontaktuj się z zespołem Freak Legends — pytania o grę, konto, prywatność i współpracę.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <LegalShell title="Kontakt">
      <p id="spolecznosc">
        Masz pytanie o Freak Legends, konto, prywatność albo współpracę? Napisz
        do nas — odpowiadamy tak szybko, jak to możliwe.
      </p>
      <h2 className="pt-4 text-lg font-bold text-white">E-mail</h2>
      <p>
        <a
          href="mailto:kontakt@freaklegends.pl"
          className="font-semibold text-red-500 underline-offset-4 hover:underline"
        >
          kontakt@freaklegends.pl
        </a>
      </p>
      <h2 className="pt-4 text-lg font-bold text-white">Społeczność</h2>
      <p>
        Śledź aktualności i rozmawiaj z graczami na Discordzie oraz w mediach
        społecznościowych podlinkowanych w stopce.
      </p>
    </LegalShell>
  );
}
