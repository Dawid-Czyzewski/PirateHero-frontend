import Link from "next/link";
import {
  BulletList,
  type LegalSection,
} from "@/components/legal/LegalDocument";
import { PRIVACY_DATA_ITEMS } from "@/components/legal/privacyIcons";


export const PRIVACY_SECTIONS_A: LegalSection[] = [

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
          {PRIVACY_DATA_ITEMS.map((item) => (
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
  }
];
