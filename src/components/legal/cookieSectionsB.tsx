import Link from "next/link";
import {
  BulletList,
  type LegalSection,
} from "@/components/legal/LegalDocument";

export const COOKIE_SECTIONS_B: LegalSection[] = [
{
    number: "05",
    title: "Cookies marketingowe",
    body: (
      <>
        <p>
          Marketingowe cookies (jeśli włączone) służą do pomiaru kampanii i
          dopasowania komunikatów reklamowych. Uruchamiamy je wyłącznie po
          wyrażeniu zgody w banerze.
        </p>
        <BulletList
          items={[
            "możesz odmówić lub wycofać zgodę w każdej chwili,",
            "odmowa nie blokuje podstawowej gry,",
            "partnerzy reklamowi (jeśli pojawią się) będą wskazani w aktualizacji tej polityki.",
          ]}
        />
      </>
    ),
  },
  {
    number: "06",
    title: "Czas przechowywania",
    body: (
      <>
        <p>Cookies dzielimy m.in. na:</p>
        <BulletList
          items={[
            "sesyjne - usuwane po zamknięciu przeglądarki,",
            "trwałe - pozostają do wygaśnięcia lub ręcznego usunięcia,",
            "zgody cookies - zwykle do 12 miesięcy lub do zmiany decyzji,",
            "logi powiązane z bezpieczeństwem - zgodnie z Polityką prywatności.",
          ]}
        />
        <p className="mt-3">
          Dokładny czas życia zależy od kategorii i konfiguracji narzędzia.
        </p>
      </>
    ),
  },
  {
    number: "07",
    title: "Jak zarządzać zgodą?",
    body: (
      <>
        <p>Możesz kontrolować cookies na kilka sposobów:</p>
        <BulletList
          items={[
            "baner cookies na stronie (akceptacja, odmowa, ustawienia),",
            "ustawienia przeglądarki (blokada / usuwanie cookies),",
            "tryb prywatny / incognito (ogranicza trwałe cookies),",
            "narzędzia opt-out dostawców analityki / reklam (gdy stosowane).",
          ]}
        />
        <p className="mt-3">
          Wyłączenie niezbędnych cookies może uniemożliwić logowanie lub zapis
          postępu. Szczegóły danych osobowych:{" "}
          <Link
            href="/privacy"
            className="font-semibold text-white underline decoration-red-600 underline-offset-4 hover:text-red-500"
          >
            Polityka prywatności
          </Link>
          .
        </p>
      </>
    ),
  },
  {
    number: "08",
    title: "Kontakt i zmiany",
    body: (
      <>
        <p>
          W sprawach cookies i prywatności napisz przez{" "}
          <Link
            href="/contact"
            className="font-semibold text-white underline decoration-red-600 underline-offset-4 hover:text-red-500"
          >
            Kontakt
          </Link>{" "}
          lub na{" "}
          <a
            href="mailto:kontakt@freaklegends.pl"
            className="font-semibold text-white underline decoration-red-600 underline-offset-4 hover:text-red-500"
          >
            kontakt@freaklegends.pl
          </a>
          .
        </p>
        <BulletList
          items={[
            "Możemy aktualizować tę politykę wraz z rozwojem Serwisu.",
            "O istotnych zmianach poinformujemy na stronie.",
            "Dalsze korzystanie z Serwisu po aktualizacji oznacza zapoznanie się z nowymi zasadami.",
          ]}
        />
      </>
    ),
  }
];
