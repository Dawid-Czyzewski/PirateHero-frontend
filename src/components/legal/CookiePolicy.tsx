import Link from "next/link";
import type { ReactNode } from "react";
import {
  BulletList,
  LegalDocument,
  type LegalSection,
} from "@/components/legal/LegalDocument";

const COOKIE_TYPES: { label: string; icon: ReactNode }[] = [
  { label: "Niezbędne", icon: <IconShield /> },
  { label: "Preferencje", icon: <IconSliders /> },
  { label: "Analityczne", icon: <IconChart /> },
  { label: "Marketingowe", icon: <IconMegaphone /> },
];

function IconShell({ children, label }: { children: ReactNode; label: string }) {
  return (
    <svg
      viewBox="0 0 256 256"
      className="h-5 w-5 shrink-0 text-red-600"
      fill="currentColor"
      aria-hidden
    >
      <title>{label}</title>
      {children}
    </svg>
  );
}

function IconShield() {
  return (
    <IconShell label="Niezbędne">
      <path d="M208,40H48A16,16,0,0,0,32,56v58.78c0,89.61,75.82,119.34,91,124.39a15.53,15.53,0,0,0,10,0c15.2-5.05,91-34.78,91-124.39V56A16,16,0,0,0,208,40Zm-34.34,69.66-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35a8,8,0,0,1,11.32,11.32Z" />
    </IconShell>
  );
}

function IconSliders() {
  return (
    <IconShell label="Preferencje">
      <path d="M40,88H73a32,32,0,0,0,62,0h81a8,8,0,0,0,0-16H135a32,32,0,0,0-62,0H40a8,8,0,0,0,0,16Zm64-24A16,16,0,1,1,88,80,16,16,0,0,1,104,64ZM216,168H183a32,32,0,0,0-62,0H40a8,8,0,0,0,0,16h81a32,32,0,0,0,62,0h33a8,8,0,0,0,0-16Zm-64,24a16,16,0,1,1,16-16A16,16,0,0,1,152,192Z" />
    </IconShell>
  );
}

function IconChart() {
  return (
    <IconShell label="Analityczne">
      <path d="M232,208a8,8,0,0,1-8,8H32a8,8,0,0,1,0-16h8V136a8,8,0,0,1,8-8h32a8,8,0,0,1,8,8v64h16V88a8,8,0,0,1,8-8h32a8,8,0,0,1,8,8V200h16V40a8,8,0,0,1,8-8h32a8,8,0,0,1,8,8V200h8A8,8,0,0,1,232,208Z" />
    </IconShell>
  );
}

function IconMegaphone() {
  return (
    <IconShell label="Marketingowe">
      <path d="M248,120a48.05,48.05,0,0,0-48-48H160V40a16,16,0,0,0-16-16H104A16,16,0,0,0,88,40V72H56a48.05,48.05,0,0,0-48,48,48.05,48.05,0,0,0,48,48H88v32a16,16,0,0,0,16,16h40a16,16,0,0,0,16-16V168h40a48.05,48.05,0,0,0,48-48ZM104,40h40V72H104ZM144,208H104V168h40Zm56-56H56a32,32,0,0,1,0-64H200a32,32,0,0,1,0,64Z" />
    </IconShell>
  );
}

const SECTIONS: LegalSection[] = [
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
          {COOKIE_TYPES.map((item) => (
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
  },
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
  },
];

export function CookiePolicy({ updatedAt }: { updatedAt: string }) {
  return (
    <LegalDocument
      title="Polityka cookies"
      headlineSrc="/images/cookies-headline.png"
      headlineWidth={1236}
      headlineHeight={692}
      updatedAt={updatedAt}
      sections={SECTIONS}
    />
  );
}
