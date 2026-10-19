import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { PageFrame } from "@/components/landing/PageFrame";
import { SiteFooter } from "@/components/landing/SiteFooter";
import { SiteHeader } from "@/components/landing/SiteHeader";

type PolicySection = {
  number: string;
  title: string;
  crown?: boolean;
  body: ReactNode;
};

const DATA_ITEMS: { label: string; icon: ReactNode }[] = [
  { label: "E-mail", icon: <IconEnvelope /> },
  { label: "Nick i dane konta", icon: <IconUser /> },
  { label: "Dane rejestracyjne", icon: <IconController /> },
  { label: "Statystyki o grze", icon: <IconChart /> },
  { label: "Adresy IP i logi", icon: <IconPin /> },
  { label: "Cookies / urządzenie", icon: <IconCookie /> },
];

function formatDisplayDate(iso: string) {
  const [y, m, d] = iso.split("-");
  return `${d}.${m}.${y}`;
}

function CrownMark() {
  return (
    <svg
      viewBox="0 0 256 256"
      className="h-4 w-4"
      fill="currentColor"
      aria-hidden
    >
      <path d="M239.75,90.81c0,.11,0,.21-.07.32L217,195a16,16,0,0,1-15.72,13H54.71A16,16,0,0,1,39,195L16.32,91.13c0-.11-.05-.21-.07-.32A16,16,0,0,1,44,77.39l33.67,36.29,35.8-80.29a1,1,0,0,0,0-.1,16,16,0,0,1,29.06,0,1,1,0,0,0,0,.1l35.8,80.29L212,77.39a16,16,0,0,1,27.71,13.42Z" />
    </svg>
  );
}

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

function IconEnvelope() {
  return (
    <IconShell label="E-mail">
      <path d="M224,48H32a8,8,0,0,0-8,8V192a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A8,8,0,0,0,224,48Zm-8,144H40V74.19l82.59,75.71a8,8,0,0,0,10.82,0L216,74.19Z" />
    </IconShell>
  );
}

function IconUser() {
  return (
    <IconShell label="Konto">
      <path d="M230.92,212c-15.23-26.33-38.7-45.21-66.09-54.16a72,72,0,1,0-73.66,0C63.78,166.78,40.31,185.66,25.08,212a8,8,0,1,0,13.85,8c18.84-32.56,52.14-52,89.07-52s70.23,19.44,89.07,52a8,8,0,1,0,13.85-8ZM72,96a56,56,0,1,1,56,56A56.06,56.06,0,0,1,72,96Z" />
    </IconShell>
  );
}

function IconChart() {
  return (
    <IconShell label="Statystyki">
      <path d="M232,208a8,8,0,0,1-8,8H32a8,8,0,0,1,0-16h8V136a8,8,0,0,1,8-8h32a8,8,0,0,1,8,8v64h16V88a8,8,0,0,1,8-8h32a8,8,0,0,1,8,8V200h16V40a8,8,0,0,1,8-8h32a8,8,0,0,1,8,8V200h8A8,8,0,0,1,232,208Z" />
    </IconShell>
  );
}

function IconController() {
  return (
    <IconShell label="Dane rejestracyjne">
      <path d="M247.51,124.28l-30.94-49.5A32,32,0,0,0,189.86,60H66.14a32,32,0,0,0-26.71,14.78l-30.94,49.5A15.87,15.87,0,0,0,8,131.72v36.13A24.17,24.17,0,0,0,32.17,192H56a40,40,0,0,0,40-40h64a40,40,0,0,0,40,40h23.83A24.17,24.17,0,0,0,248,167.85V131.72A15.87,15.87,0,0,0,247.51,124.28ZM184,148a12,12,0,1,1,12-12A12,12,0,0,1,184,148ZM72,148H56a12,12,0,0,1,0-24H72a12,12,0,0,1,0,24Zm16-36H72a12,12,0,0,1,0-24h16a12,12,0,0,1,0,24Z" />
    </IconShell>
  );
}

function IconPin() {
  return (
    <IconShell label="Adresy IP">
      <path d="M128,16a88.1,88.1,0,0,0-88,88c0,75.3,80,132.17,83.41,134.55a8,8,0,0,0,9.18,0C136,236.17,216,179.3,216,104A88.1,88.1,0,0,0,128,16Zm0,56a32,32,0,1,1-32,32A32,32,0,0,1,128,72Z" />
    </IconShell>
  );
}

function IconCookie() {
  return (
    <IconShell label="Cookies">
      <path d="M225.85,102.18a8,8,0,0,0-7.57-1.34,24,24,0,0,1-23.8-41.88,8,8,0,0,0-3.32-14.5A104,104,0,1,0,225.85,102.18ZM128,216A88,88,0,1,1,192.5,70.83a40,40,0,0,0,34.47,43.42A88.12,88.12,0,0,1,128,216Zm-8-88a12,12,0,1,1-12-12A12,12,0,0,1,120,128Zm-4,48a12,12,0,1,1-12-12A12,12,0,0,1,116,176Zm48-24a12,12,0,1,1-12-12A12,12,0,0,1,164,152Z" />
    </IconShell>
  );
}

function PolicyCard({
  number,
  title,
  children,
  crown,
}: {
  number: string;
  title: string;
  children: ReactNode;
  crown?: boolean;
}) {
  return (
    <article className="relative flex min-h-[16rem] flex-col overflow-hidden rounded-sm border border-red-600/35 bg-[#141414]/82 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-md">
      <span
        className="pointer-events-none absolute right-0 top-0 h-9 w-9 border-r-2 border-t-2 border-red-600"
        aria-hidden
      />
      <span
        className="pointer-events-none absolute bottom-0 left-0 h-9 w-9 border-b-2 border-l-2 border-red-600"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.04)_0%,transparent_40%,rgba(0,0,0,0.25)_100%)]"
        aria-hidden
      />

      <header className="relative z-10 flex items-start justify-between gap-3 px-5 pb-2 pt-5 sm:px-6 sm:pt-6">
        <h2 className="text-[0.95rem] font-extrabold uppercase tracking-[0.06em] text-white sm:text-base">
          <span className="text-red-600">{number}.</span> {title}
        </h2>
        {crown ? (
          <span className="mt-0.5 shrink-0 text-red-600" aria-hidden>
            <CrownMark />
          </span>
        ) : null}
      </header>

      <div className="relative z-10 max-h-[14rem] flex-1 overflow-y-auto px-5 pb-5 text-[0.82rem] leading-relaxed text-zinc-200 sm:max-h-[15rem] sm:px-6 sm:pb-6 [scrollbar-color:#e5e5e5_transparent] [scrollbar-width:thin]">
        {children}
      </div>
    </article>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="mt-3 list-disc space-y-1.5 pl-4 text-zinc-200 marker:text-red-600">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

const SECTIONS: PolicySection[] = [
  {
    number: "01",
    title: "Postanowienia ogólne",
    crown: true,
    body: (
      <>
        <p>
          Niniejsza polityka prywatności określa zasady przetwarzania danych
          osobowych w serwisie Freak Legends dostępnym pod adresem freaklegends.pl
          (dalej: Serwis) oraz w powiązanej przeglądarkowej grze RPG.
        </p>
        <p className="mt-3">
          Administratorem danych osobowych jest zespół Freak Legends.
          Korzystając z Serwisu, konta gracza lub funkcji gry, akceptujesz tę
          politykę oraz obowiązujący{" "}
          <Link
            href="/terms"
            className="font-semibold text-white underline decoration-red-600 underline-offset-4 hover:text-red-500"
          >
            Regulamin
          </Link>
          .
        </p>
        <BulletList
          items={[
            "Polityka dotyczy graczy, gości strony i osób kontaktujących się z nami.",
            "Nie świadczymy usług skierowanych do dzieci poniżej 16. roku życia bez zgody opiekuna.",
            "Aktualną wersję polityki zawsze znajdziesz pod adresem /privacy.",
          ]}
        />
      </>
    ),
  },
  {
    number: "02",
    title: "Jakie dane zbieramy?",
    body: (
      <>
        <ul className="space-y-2.5">
          {DATA_ITEMS.map((item) => (
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
          Szczegółowo możemy przetwarzać m.in.:
        </p>
        <BulletList
          items={[
            "dane konta: nick, e-mail, hash hasła, ustawienia profilu,",
            "dane rozgrywki: postęp, walki, rankingi, popularność, przedmioty,",
            "dane techniczne: IP, typ przeglądarki, system, czas wizyty, logi błędów,",
            "dane komunikacji: treść wiadomości z formularza kontaktu,",
            "dane płatności (jeśli włączone): status transakcji, ID u operatora (bez pełnych danych kart).",
          ]}
        />
      </>
    ),
  },
  {
    number: "03",
    title: "Cele i podstawy prawne",
    body: (
      <>
        <p>Przetwarzamy dane w następujących celach:</p>
        <BulletList
          items={[
            "świadczenie usługi gry i utrzymanie konta (umowa / regulamin),",
            "bezpieczeństwo, walka z oszustwami, cheatami i nadużyciami (prawnie uzasadniony interes),",
            "obsługa zapytań i reklamacji (umowa lub prawnie uzasadniony interes),",
            "analityka i ulepszanie Serwisu (zgoda lub prawnie uzasadniony interes, zależnie od narzędzia),",
            "marketing własny (np. newsletter) tylko na podstawie zgody,",
            "wypełnienie obowiązków prawnych (np. księgowość, jeśli wystąpią płatności).",
          ]}
        />
        <p className="mt-3">
          Podanie danych konta jest dobrowolne, ale niezbędne do rejestracji i
          gry na koncie. Bez danych technicznych część funkcji może nie działać.
        </p>
      </>
    ),
  },
  {
    number: "04",
    title: "Cookies i podobne technologie",
    body: (
      <>
        <p>
          Serwis używa plików cookies oraz podobnych technologii. Szczegóły
          znajdziesz w{" "}
          <Link
            href="/cookies"
            className="font-semibold text-white underline decoration-red-600 underline-offset-4 hover:text-red-500"
          >
            Polityce cookies
          </Link>
          .
        </p>
        <BulletList
          items={[
            "niezbędne: sesja, bezpieczeństwo, zapis zgód,",
            "preferencje: zapamiętanie wyborów gracza,",
            "analityczne: pomiar ruchu i stabilności (po zgodzie, jeśli wymagana),",
            "marketingowe: tylko po wyrażeniu zgody.",
          ]}
        />
        <p className="mt-3">
          Zgodę możesz zmienić w banerze cookies lub w ustawieniach
          przeglądarki. Wyłączenie części cookies może ograniczyć funkcje gry.
        </p>
      </>
    ),
  },
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
  },
];

export function PrivacyPolicy({ updatedAt }: { updatedAt: string }) {
  return (
    <>
      <div className="relative min-h-screen w-full overflow-x-clip bg-[#0a0a0a]">
        <div className="absolute inset-0 z-0" aria-hidden>
          <Image
            src="/bg-octagon.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/55 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-[#0a0a0a]/50" />
        </div>

        <div
          className="pointer-events-none absolute bottom-0 right-0 z-[5] hidden h-[min(52vh,420px)] w-[min(42vw,340px)] md:block"
          aria-hidden
        >
          <Image
            src="/images/hero-fighter-v4.png"
            alt=""
            width={605}
            height={676}
            className="h-full w-full object-contain object-bottom opacity-80 brightness-0 contrast-150"
          />
        </div>

        <SiteHeader />

        <main className="relative z-20 flex flex-col pb-16 pt-28 md:pb-20 md:pt-32">
          <PageFrame>
            <header className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
              <div className="max-w-xl">
                <h1 className="sr-only">Polityka prywatności</h1>
                <Image
                  src="/images/privacy-headline.png"
                  alt=""
                  width={1182}
                  height={658}
                  priority
                  sizes="(max-width: 768px) 85vw, 28rem"
                  className="h-auto w-full max-w-[20rem] select-none drop-shadow-[0_8px_24px_rgba(0,0,0,0.55)] sm:max-w-[24rem] lg:max-w-[28rem]"
                />
              </div>
              <p className="shrink-0 text-[0.68rem] font-bold uppercase tracking-[0.14em] text-red-600 sm:pb-2 sm:text-right">
                Ostatnia aktualizacja:{" "}
                <time dateTime={updatedAt}>{formatDisplayDate(updatedAt)}</time>
              </p>
            </header>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 lg:gap-6">
              {SECTIONS.map((section) => (
                <PolicyCard
                  key={section.number}
                  number={section.number}
                  title={section.title}
                  crown={section.crown}
                >
                  {section.body}
                </PolicyCard>
              ))}
            </div>
          </PageFrame>
        </main>
      </div>
      <SiteFooter />
    </>
  );
}
