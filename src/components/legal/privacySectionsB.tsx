import Link from "next/link";
import {
  BulletList,
  type LegalSection,
} from "@/components/legal/LegalDocument";

export const PRIVACY_SECTIONS_B: LegalSection[] = [
{
    number: "05",
    title: "Bezpieczeństwo i płatności",
    body: (
      <>
        <p>
          Stosujemy środki techniczne i organizacyjne chroniące dane przed
          nieuprawnionym dostępem, utratą, zniszczeniem lub nieuprawnioną zmianą.
        </p>
        <BulletList
          items={[
            "hasła przechowywane w formie zahashowanej,",
            "szyfrowanie połączenia (HTTPS),",
            "ograniczony dostęp do paneli administracyjnych,",
            "kopie zapasowe i monitoring incydentów,",
            "zasada minimalizacji danych.",
          ]}
        />
        <p className="mt-3">
          Jeśli w Serwisie pojawią się płatności, transakcje obsługują zewnętrzni
          operatorzy płatności. Nie przechowujemy pełnych numerów kart
          płatniczych na naszych serwerach.
        </p>
      </>
    ),
  },
  {
    number: "06",
    title: "Odbiorcy i transfer danych",
    body: (
      <>
        <p>
          Dane mogą być powierzane podmiotom wspierającym działanie Serwisu, w
          zakresie niezbędnym do świadczenia usługi:
        </p>
        <BulletList
          items={[
            "hosting i infrastruktura chmurowa,",
            "dostawcy poczty e-mail i narzędzi supportu,",
            "dostawcy analityki (po spełnieniu wymogów zgody),",
            "operatorzy płatności (gdy aktywne),",
            "doradcy prawni lub księgowi, gdy jest to konieczne,",
            "organy publiczne, gdy wymaga tego prawo.",
          ]}
        />
        <p className="mt-3">
          Jeśli odbiorca działa poza EOG, stosujemy odpowiednie zabezpieczenia
          (np. standardowe klauzule umowne) albo korzystamy z usług spełniających
          wymogi RODO.
        </p>
      </>
    ),
  },
  {
    number: "07",
    title: "Okres przechowywania",
    body: (
      <>
        <p>Dane przechowujemy nie dłużej, niż jest to potrzebne:</p>
        <BulletList
          items={[
            "dane konta: przez czas posiadania konta, a po usunięciu przez okres potrzebny na rozliczenie i zabezpieczenie roszczeń,",
            "dane rozgrywki powiązane z kontem: do usunięcia konta lub anonimizacji,",
            "logi techniczne i bezpieczeństwa: zwykle do 12 miesięcy, chyba że dłuższy okres wynika z dochodzenia nadużyć,",
            "korespondencja: do zakończenia sprawy i przez okres przedawnienia roszczeń,",
            "dane płatności / księgowe: zgodnie z wymogami prawa podatkowego,",
            "zgody marketingowe: do cofnięcia zgody lub usunięcia danych.",
          ]}
        />
      </>
    ),
  },
  {
    number: "08",
    title: "Twoje prawa",
    body: (
      <>
        <p>W zakresie przewidzianym przez RODO masz prawo do:</p>
        <BulletList
          items={[
            "dostępu do swoich danych,",
            "sprostowania (poprawienia) danych,",
            "usunięcia danych (\"prawo do bycia zapomnianym\"),",
            "ograniczenia przetwarzania,",
            "przenoszenia danych,",
            "sprzeciwu wobec przetwarzania opartego na prawnie uzasadnionym interesie,",
            "cofnięcia zgody w dowolnym momencie (bez wpływu na zgodność wcześniejszego przetwarzania),",
            "wniesienia skargi do Prezesa Urzędu Ochrony Danych Osobowych (UODO).",
          ]}
        />
        <p className="mt-3">
          Żądania dotyczące prywatności złóż przez stronę{" "}
          <Link
            href="/contact"
            className="font-semibold text-white underline decoration-red-600 underline-offset-4 hover:text-red-500"
          >
            Kontakt
          </Link>{" "}
          lub e-mail{" "}
          <a
            href="mailto:kontakt@freaklegends.pl"
            className="font-semibold text-white underline decoration-red-600 underline-offset-4 hover:text-red-500"
          >
            kontakt@freaklegends.pl
          </a>
          . Odpowiadamy bez zbędnej zwłoki, zwykle w ciągu 30 dni.
        </p>
        <p className="mt-3">
          Możemy aktualizować tę politykę. O istotnych zmianach poinformujemy w
          Serwisie. Dalsze korzystanie z gry po publikacji nowej wersji oznacza
          zapoznanie się z aktualnymi zasadami.
        </p>
      </>
    ),
  }
];
