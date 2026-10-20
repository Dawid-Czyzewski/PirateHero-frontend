import Link from "next/link";
import {
  BulletList,
  type LegalSection,
} from "@/components/legal/LegalDocument";

export const TERMS_SECTIONS_B: LegalSection[] = [
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
  }
];
