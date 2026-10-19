import Link from "next/link";
import {
  BulletList,
  LegalDocument,
  type LegalSection,
} from "@/components/legal/LegalDocument";

const SECTIONS: LegalSection[] = [
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
  },
  {
    number: "05",
    title: "Zakazy i fair play",
    body: (
      <>
        <p>Zabrania się w szczególności:</p>
        <BulletList
          items={[
            "używania cheatów, botów, exploitów i automatyzacji rozgrywki,",
            "ataków na infrastrukturę Serwisu lub konta innych graczy,",
            "nękania, gróźb, mowy nienawiści i treści nielegalnych,",
            "handlu kontami, przedmiotami lub walutą gry poza oficjalnymi kanałami,",
            "podszywania się pod administrację lub innych graczy,",
            "rozpowszechniania wirusów, phishingu i treści szkodliwych,",
            "naruszania praw własności intelektualnej osób trzecich.",
          ]}
        />
        <p className="mt-3">
          Naruszenia mogą skutkować ostrzeżeniem, blokadą funkcji, zawieszeniem
          lub trwałym banem bez zwrotu korzyści zdobytych nieuczciwie.
        </p>
      </>
    ),
  },
  {
    number: "06",
    title: "Własność intelektualna",
    body: (
      <>
        <p>
          Nazwa Freak Legends, logo, grafiki, kod, teksty, dźwięki i pozostałe
          treści Serwisu są chronione prawem. Zabrania się ich kopiowania,
          modyfikacji i wykorzystania komercyjnego bez naszej zgody.
        </p>
        <BulletList
          items={[
            "Otrzymujesz niewyłączną, odwołalną licencję na korzystanie z Gry wyłącznie do własnej rozrywki.",
            "Nie nabywasz praw własności do wirtualnych przedmiotów poza zakresem przewidzianym w grze.",
            "Zgłaszając treści (np. nick, wiadomości), zapewniasz, że masz do nich prawa.",
          ]}
        />
      </>
    ),
  },
  {
    number: "07",
    title: "Płatności i usługi opcjonalne",
    body: (
      <>
        <p>
          Podstawowa gra jest darmowa. W przyszłości możemy oferować opcjonalne
          zakupy lub usługi premium.
        </p>
        <BulletList
          items={[
            "Ceny, zakres i warunki zakupów będą podane przed transakcją.",
            "Płatności obsługują zewnętrzni operatorzy.",
            "Wirtualne dobra nie są środkiem płatniczym poza grą.",
            "Reklamacje zakupów zgłaszaj przez Kontakt, podając dane transakcji.",
            "Prawo odstąpienia może być ograniczone przy treści cyfrowej dostarczonej za Twoją zgodą.",
          ]}
        />
      </>
    ),
  },
  {
    number: "08",
    title: "Odpowiedzialność i zmiany",
    body: (
      <>
        <p>
          Dokładamy starań, aby Serwis działał stabilnie, lecz nie gwarantujemy
          nieprzerwanej dostępności. Gra może być niedostępna z powodu prac
          technicznych, awarii lub siły wyższej.
        </p>
        <BulletList
          items={[
            "Nie odpowiadamy za szkody wynikłe z nieprawidłowego użycia Gry lub działań osób trzecich, w zakresie dozwolonym prawem.",
            "Możemy zmieniać regulamin, mechaniki i zawartość Gry.",
            "O istotnych zmianach poinformujemy w Serwisie.",
            "Dalsze korzystanie z Gry po publikacji zmian oznacza ich akceptację.",
          ]}
        />
        <p className="mt-3">
          Pytania dotyczące regulaminu:{" "}
          <Link
            href="/contact"
            className="font-semibold text-white underline decoration-red-600 underline-offset-4 hover:text-red-500"
          >
            Kontakt
          </Link>{" "}
          lub{" "}
          <a
            href="mailto:kontakt@freaklegends.pl"
            className="font-semibold text-white underline decoration-red-600 underline-offset-4 hover:text-red-500"
          >
            kontakt@freaklegends.pl
          </a>
          .
        </p>
      </>
    ),
  },
];

export function TermsOfService({ updatedAt }: { updatedAt: string }) {
  return (
    <LegalDocument
      title="Regulamin"
      headlineSrc="/images/terms-headline.png"
      headlineWidth={1219}
      headlineHeight={696}
      updatedAt={updatedAt}
      sections={SECTIONS}
    />
  );
}
