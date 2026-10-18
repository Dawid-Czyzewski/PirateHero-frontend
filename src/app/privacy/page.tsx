import type { Metadata } from "next";
import { LegalShell } from "@/components/legal/LegalShell";

export const metadata: Metadata = {
  title: "Polityka prywatności",
  description:
    "Polityka prywatności Freak Legends: jak przetwarzamy dane graczy w przeglądarkowej grze RPG o freak fightach.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <LegalShell title="Polityka prywatności">
      <p>
        Niniejsza polityka opisuje zasady przetwarzania danych osobowych w
        serwisie Freak Legends (freaklegends.pl). Administratorem danych jest
        zespół Freak Legends.
      </p>
      <h2 className="pt-4 text-lg font-bold text-white">Jakie dane zbieramy</h2>
      <p>
        W zależności od korzystania z gry możemy przetwarzać dane konta (np.
        nick, adres e-mail), dane techniczne (adres IP, typ przeglądarki) oraz
        dane wynikające z rozgrywki (postęp, statystyki).
      </p>
      <h2 className="pt-4 text-lg font-bold text-white">Cel i podstawa</h2>
      <p>
        Dane służą do świadczenia usługi gry, bezpieczeństwa, analityki oraz
        komunikacji związanej z kontem. Podstawą może być umowa (regulamin),
        zgoda lub prawnie uzasadniony interes administratora.
      </p>
      <h2 className="pt-4 text-lg font-bold text-white">Twoje prawa</h2>
      <p>
        Masz prawo dostępu do danych, ich sprostowania, usunięcia, ograniczenia
        przetwarzania, przenoszenia oraz wniesienia sprzeciwu. W sprawach
        prywatności napisz przez stronę Kontakt.
      </p>
      <p className="text-sm text-zinc-500">Ostatnia aktualizacja: 18.10.2026</p>
    </LegalShell>
  );
}
