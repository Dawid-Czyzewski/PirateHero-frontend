import Link from "next/link";
import {
  BulletList,
  type LegalSection,
} from "@/components/legal/LegalDocument";


export const TERMS_SECTIONS_A: LegalSection[] = [

  {
    number: "01",
    title: "Postanowienia ogólne",
    crown: true,
    body: (
      <>
        <p>
          Niniejszy regulamin określa zasady korzystania z serwisu Freak Legends
          (freaklegends.pl) oraz powiązanej przeglądarkowej gry RPG (dalej:
          Serwis / Gra).
        </p>
        <p className="mt-3">
          Operatorem Serwisu jest zespół Freak Legends. Korzystając z Gry,
          konta lub strony, akceptujesz ten regulamin oraz{" "}
          <Link
            href="/privacy"
            className="font-semibold text-white underline decoration-red-600 underline-offset-4 hover:text-red-500"
          >
            Politykę prywatności
          </Link>
          .
        </p>
        <BulletList
          items={[
            "Regulamin wiąże wszystkich użytkowników Serwisu.",
            "Jeśli nie akceptujesz zasad, nie rejestruj konta i nie korzystaj z Gry.",
            "Aktualną wersję regulaminu znajdziesz pod adresem /terms.",
          ]}
        />
      </>
    ),
  },
  {
    number: "02",
    title: "Wymagania i wiek",
    body: (
      <>
        <p>
          Gra jest przeznaczona przede wszystkim dla osób pełnoletnich. Osoby
          niepełnoletnie mogą korzystać z Serwisu wyłącznie za zgodą rodzica lub
          opiekuna prawnego, zgodnie z lokalnym prawem.
        </p>
        <BulletList
          items={[
            "Do gry potrzebujesz przeglądarki i stabilnego połączenia z internetem.",
            "Część funkcji wymaga konta gracza.",
            "Nie gwarantujemy działania na wszystkich urządzeniach i przeglądarkach.",
            "Treści mogą zawierać motywy walki sportowej / fikcyjnej przemocy typowej dla gatunku.",
          ]}
        />
      </>
    ),
  },
  {
    number: "03",
    title: "Konto gracza",
    body: (
      <>
        <p>
          Rejestrując konto, podajesz prawdziwe dane w wymaganym zakresie i
          odpowiadasz za ich aktualność.
        </p>
        <BulletList
          items={[
            "Chronisz login i hasło; nie udostępniasz konta osobom trzecim.",
            "Za aktywność na koncie odpowiada jego właściciel.",
            "Jeden gracz nie powinien obchodzić limitów przez wiele kont w celu nadużyć.",
            "Możesz usunąć konto na zasadach opisanych w Serwisie lub przez Kontakt.",
            "Możemy zawiesić lub usunąć konto przy naruszeniu regulaminu.",
          ]}
        />
      </>
    ),
  },
  {
    number: "04",
    title: "Zasady rozgrywki",
    body: (
      <>
        <p>
          Freak Legends to darmowa gra przeglądarkowa. Mechaniki (trening, walki,
          rankingi, popularność, pasy) mogą się zmieniać wraz z rozwojem projektu.
        </p>
        <BulletList
          items={[
            "Wyniki walk i rankingów wynikają z logiki gry i mogą zawierać elementy losowości.",
            "Nie gwarantujemy stałej dostępności konkretnych funkcji, eventów ani nagród.",
            "Postęp postaci jest powiązany z kontem i może zostać zresetowany przy poważnych naruszeniach.",
            "Komunikacja w grze i społecznościach ma być zgodna z prawem i kulturą fair play.",
          ]}
        />
      </>
    ),
  }
];
