import Link from "next/link";
import {
  BulletList,
  type LegalSection,
} from "@/components/legal/LegalDocument";
import { COOKIE_TYPE_ITEMS } from "@/components/legal/cookieIcons";


export const COOKIE_SECTIONS_A: LegalSection[] = [

  {
    number: "01",
    title: "Czym są cookies?",
    crown: true,
    body: (
      <>
        <p>
          Pliki cookies (i podobne technologie, np. local storage) to małe
          informacje zapisywane w Twojej przeglądarce podczas korzystania z
          Freak Legends (freaklegends.pl).
        </p>
        <p className="mt-3">
          Pomagają utrzymać sesję, zapamiętać wybory (np. zgody) oraz - za Twoją
          zgodą - mierzyć ruch i dopasowywać komunikację marketingową.
        </p>
        <BulletList
          items={[
            "Polityka dotyczy strony i gry w przeglądarce.",
            "Szczegóły przetwarzania danych: Polityka prywatności.",
            "Aktualną wersję znajdziesz pod adresem /cookies.",
          ]}
        />
      </>
    ),
  },
  {
    number: "02",
    title: "Jakie cookies używamy?",
    body: (
      <>
        <ul className="space-y-2.5">
          {COOKIE_TYPE_ITEMS.map((item) => (
            <li
              key={item.label}
              className="flex items-center gap-3 font-bold uppercase tracking-[0.08em] text-white"
            >
              {item.icon}
              <span>{item.label}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-zinc-300">
          Zakres konkretnych plików może się zmieniać wraz z rozwojem Serwisu.
          Lista poniżej opisuje kategorie, nie każdy pojedynczy klucz.
        </p>
      </>
    ),
  },
  {
    number: "03",
    title: "Cookies niezbędne",
    body: (
      <>
        <p>
          Są wymagane do działania Serwisu. Bez nich logowanie, bezpieczeństwo
          sesji i zapis zgód mogą nie działać poprawnie.
        </p>
        <BulletList
          items={[
            "utrzymanie sesji gracza,",
            "ochrona przed nadużyciami (np. CSRF / limity),",
            "zapis decyzji z banera cookies,",
            "podstawowe ustawienia techniczne strony.",
          ]}
        />
        <p className="mt-3">
          Podstawa: prawnie uzasadniony interes / niezbędność do świadczenia
          usługi. Te cookies nie wymagają zgody, ale możesz je ograniczyć w
          przeglądarce (ryzyko utraty funkcji).
        </p>
      </>
    ),
  },
  {
    number: "04",
    title: "Preferencje i analityka",
    body: (
      <>
        <p>
          <strong className="text-white">Preferencje</strong> zapamiętują Twoje
          wybory w interfejsie (np. ustawienia banera).
        </p>
        <p className="mt-3">
          <strong className="text-white">Analityczne</strong> pomagają rozumieć,
          jak działa Serwis: ruch, błędy, popularność podstron. Staramy się
          korzystać z rozwiązań ograniczających identyfikację, a gdy prawo tego
          wymaga - włączamy je dopiero po zgodzie.
        </p>
        <BulletList
          items={[
            "pomiar odwiedzin i ścieżek w Serwisie,",
            "diagnostyka wydajności i awarii,",
            "ulepszanie rozgrywki i landing page.",
          ]}
        />
      </>
    ),
  }
];
