/* Auto-extracted from reference/polityka-prywatnosci.html – template for lawyer review. Do not invent missing [placeholder] values. */
export const meta = {
  "title": "Polityka prywatności",
  "words": [
    {
      "src": "t-polityka-w.webp",
      "w": 1255,
      "h": 331,
      "iw": 1255
    },
    {
      "src": "t-prywatnosci-r.webp",
      "w": 1685,
      "h": 370,
      "iw": 1685
    }
  ],
  "showSettings": false,
  "date": "[data]"
} as const;

export const toc = [
  {
    "id": "administrator",
    "n": "1",
    "label": "Administrator danych"
  },
  {
    "id": "dane",
    "n": "2",
    "label": "Jakie dane zbieramy"
  },
  {
    "id": "cele",
    "n": "3",
    "label": "Cele i podstawy prawne"
  },
  {
    "id": "platnosci",
    "n": "4",
    "label": "Płatności (Stripe)"
  },
  {
    "id": "lista",
    "n": "5",
    "label": "Lista mailowa i nagroda"
  },
  {
    "id": "reklamy",
    "n": "6",
    "label": "Reklamy i analityka"
  },
  {
    "id": "odbiorcy",
    "n": "7",
    "label": "Odbiorcy danych"
  },
  {
    "id": "eog",
    "n": "8",
    "label": "Przekazywanie poza EOG"
  },
  {
    "id": "okres",
    "n": "9",
    "label": "Okres przechowywania"
  },
  {
    "id": "prawa",
    "n": "10",
    "label": "Twoje prawa"
  },
  {
    "id": "wiek",
    "n": "11",
    "label": "Wiek graczy"
  },
  {
    "id": "bezpieczenstwo",
    "n": "12",
    "label": "Bezpieczeństwo"
  },
  {
    "id": "profilowanie",
    "n": "13",
    "label": "Decyzje automatyczne"
  },
  {
    "id": "zmiany",
    "n": "14",
    "label": "Zmiany i kontakt"
  }
] as const;

export type LegalSection = {
  id: string;
  n: string;
  headingId: string;
  heading: string;
  body: string;
};

export const sections: LegalSection[] = [
  {
    "id": "administrator",
    "n": "1",
    "headingId": "administrator-h",
    "heading": "Administrator danych",
    "body": "<p>Administratorem Twoich danych osobowych, czyli podmiotem, który decyduje, jak i&nbsp;po co są one wykorzystywane, jest <span class=\"ph\">[Imię i nazwisko / nazwa firmy]</span>, <span class=\"ph\">[adres]</span>, NIP: <span class=\"ph\">[NIP]</span>, REGON: <span class=\"ph\">[REGON]</span> (dalej: „Administrator”, „my”).</p>\n<ul>\n<li>E-mail w&nbsp;sprawach danych osobowych: <span class=\"ph\">[e-mail kontaktowy]</span></li>\n<li>Adres do korespondencji: <span class=\"ph\">[adres do korespondencji]</span></li>\n<li>Inspektor ochrony danych: <span class=\"ph\">[dane IOD, jeśli został wyznaczony – w&nbsp;przeciwnym razie usuń ten punkt]</span></li>\n</ul>\n<p>Ta polityka dotyczy gry przeglądarkowej FREAK LEGENDS (dalej: „Gra”), strony <span class=\"ph\">[adres strony]</span> i&nbsp;powiązanych usług: konta gracza, sklepu ze Złotymi Zębami, przepustki sezonowej i&nbsp;listy mailowej. Dane przetwarzamy zgodnie z&nbsp;RODO (rozporządzenie UE 2016/679) i&nbsp;polskimi przepisami.</p>"
  },
  {
    "id": "dane",
    "n": "2",
    "headingId": "dane-h",
    "heading": "Jakie dane zbieramy",
    "body": "<ul>\n<li><strong>Konto gracza:</strong> adres e-mail, nick, hasło (przechowujemy wyłącznie jego zabezpieczony skrót, nigdy samo hasło), data założenia konta, potwierdzenie wieku i&nbsp;akceptacji Regulaminu.</li>\n<li><strong>Dane z&nbsp;gry:</strong> postęp, statystyki zawodnika, ekwipunek, saldo Cebulionów i&nbsp;Złotych Zębów, Medale i&nbsp;postęp przepustki sezonowej, historia zakupów w&nbsp;Grze<span class=\"ph\">[, wiadomości z&nbsp;czatu – jeśli Gra ma czat]</span>.</li>\n<li><strong>Dane techniczne:</strong> adres IP, identyfikator sesji, typ urządzenia i&nbsp;przeglądarki, system operacyjny, język, logi błędów i&nbsp;bezpieczeństwa.</li>\n<li><strong>Płatności:</strong> identyfikator transakcji, kwota, waluta, data i&nbsp;status płatności oraz dane potrzebne do rozliczeń. Pełnych danych karty nie widzimy – obsługuje je Stripe.</li>\n<li><strong>Kontakt:</strong> imię lub nick, e-mail i&nbsp;treść wiadomości, gdy piszesz do nas przez formularz albo e-mail.</li>\n<li><strong>Lista mailowa:</strong> adres e-mail, data i&nbsp;sposób zapisu, potwierdzenie zgody.</li>\n<li><strong>Reklamy i&nbsp;analityka:</strong> identyfikatory cookies i&nbsp;podobnych technologii oraz dane o&nbsp;korzystaniu z&nbsp;Gry – tylko gdy wyrazisz zgodę (szczegóły w&nbsp;<a href=\"/cookies\">Polityce cookies</a>).</li>\n</ul>\n<p>Podanie danych jest dobrowolne, ale bez adresu e-mail, nicku i&nbsp;hasła nie założysz konta, a&nbsp;bez danych do płatności nie kupisz Złotych Zębów ani przepustki.</p>"
  },
  {
    "id": "cele",
    "n": "3",
    "headingId": "cele-h",
    "heading": "Cele i podstawy prawne",
    "body": "<ul>\n<li>Założenie i&nbsp;prowadzenie konta, udostępnienie Gry i&nbsp;jej funkcji – art.&nbsp;6 ust.&nbsp;1 lit.&nbsp;b RODO (wykonanie umowy, czyli <a href=\"/terms\">Regulaminu</a>).</li>\n<li>Sprzedaż treści cyfrowych (Złote Zęby, przepustka sezonowa), obsługa płatności i&nbsp;reklamacji – art.&nbsp;6 ust.&nbsp;1 lit.&nbsp;b RODO; rozliczenia i&nbsp;dokumentacja podatkowa – art.&nbsp;6 ust.&nbsp;1 lit.&nbsp;c RODO (obowiązek prawny).</li>\n<li>Wiadomości serwisowe (reset hasła, potwierdzenie zakupu, ważne zmiany Regulaminu) – art.&nbsp;6 ust.&nbsp;1 lit.&nbsp;b i&nbsp;f RODO.</li>\n<li>Bezpieczeństwo Gry, zapobieganie oszustwom, cheatom, botom i&nbsp;multikontom – art.&nbsp;6 ust.&nbsp;1 lit.&nbsp;f RODO (nasz prawnie uzasadniony interes: uczciwa rozgrywka i&nbsp;ochrona usługi).</li>\n<li>Odpowiedzi na wiadomości i&nbsp;zgłoszenia oraz ustalenie, dochodzenie i&nbsp;obrona roszczeń – art.&nbsp;6 ust.&nbsp;1 lit.&nbsp;f RODO.</li>\n<li>Lista mailowa i&nbsp;informacje handlowe e-mailem – art.&nbsp;6 ust.&nbsp;1 lit.&nbsp;a RODO (zgoda) oraz zgoda na komunikację marketingową drogą elektroniczną (art.&nbsp;398 ustawy – Prawo komunikacji elektronicznej).</li>\n<li>Analityka i&nbsp;reklamy spersonalizowane – art.&nbsp;6 ust.&nbsp;1 lit.&nbsp;a RODO (zgoda wyrażona w&nbsp;banerze cookies).</li>\n</ul>\n<p>Zapisywanie informacji na Twoim urządzeniu i&nbsp;odczytywanie ich (cookies) odbywa się zgodnie z&nbsp;art.&nbsp;399 ustawy z&nbsp;12 lipca 2024&nbsp;r. – Prawo komunikacji elektronicznej: cookies niezbędne bez zgody, pozostałe wyłącznie za zgodą.</p>"
  },
  {
    "id": "platnosci",
    "n": "4",
    "headingId": "platnosci-h",
    "heading": "Płatności (Stripe)",
    "body": "<p>Płatności za Złote Zęby i&nbsp;przepustkę sezonową obsługuje Stripe Payments Europe, Ltd. (Irlandia). Formularz płatności dostarcza Stripe, a&nbsp;dane karty trafiają bezpośrednio do Stripe – nie mamy do nich dostępu.</p>\n<ul>\n<li>Od Stripe otrzymujemy: identyfikator i&nbsp;status płatności, kwotę, walutę, datę<span class=\"ph\">[, typ karty i&nbsp;jej 4 ostatnie cyfry]</span>.</li>\n<li>Stripe przetwarza dane także jako odrębny administrator, m.in. w&nbsp;celu zapobiegania oszustwom i&nbsp;spełnienia obowiązków prawnych – na zasadach z&nbsp;polityki prywatności Stripe.</li>\n<li>Stripe może przekazywać dane poza EOG (m.in. do USA) na podstawie decyzji Komisji Europejskiej o&nbsp;odpowiednim stopniu ochrony lub standardowych klauzul umownych.</li>\n</ul>"
  },
  {
    "id": "lista",
    "n": "5",
    "headingId": "lista-h",
    "heading": "Lista mailowa i nagroda",
    "body": "<p>Na listę mailową (listę oczekujących) możesz zapisać się przed startem Gry albo w&nbsp;jej trakcie.</p>\n<ul>\n<li>Zapis potwierdzasz linkiem z&nbsp;wiadomości e-mail (podwójna zgoda – double opt-in).</li>\n<li>Za potwierdzony zapis przyznajemy jednorazową nagrodę: <span class=\"ph\">[np. 60 Złotych Zębów]</span>, którą otrzymasz po założeniu konta na ten sam adres e-mail – zasady w&nbsp;<a href=\"regulamin.html#waitlista\">Regulaminie</a>.</li>\n<li>Wysyłamy informacje o&nbsp;starcie Gry, aktualizacjach, wydarzeniach i&nbsp;ofertach – nie częściej niż <span class=\"ph\">[częstotliwość wysyłki]</span>.</li>\n<li>Zgodę wycofasz w&nbsp;każdej chwili: link „Wypisz się” w&nbsp;każdej wiadomości albo e-mail na <span class=\"ph\">[e-mail kontaktowy]</span>. Przyznana nagroda zostaje na koncie.</li>\n</ul>\n<p>Wiadomości wysyłamy za pomocą <span class=\"ph\">[dostawca poczty e-mail]</span>.</p>"
  },
  {
    "id": "reklamy",
    "n": "6",
    "headingId": "reklamy-h",
    "heading": "Reklamy i analityka",
    "body": "<ul>\n<li>Gra jest darmowa i&nbsp;może wyświetlać reklamy, w&nbsp;tym reklamy z&nbsp;nagrodą, które oglądasz dobrowolnie w&nbsp;zamian za bonus w&nbsp;Grze.</li>\n<li>Reklamy dostarcza <span class=\"ph\">[sieć reklamowa]</span>. Bez Twojej zgody pokazujemy tylko reklamy niespersonalizowane (kontekstowe); dopasowane do Ciebie – wyłącznie za zgodą na cookies marketingowe.</li>\n<li>Statystyki korzystania z&nbsp;Gry zbiera <span class=\"ph\">[dostawca analityki]</span> – wyłącznie za zgodą na cookies analityczne. Wyniki wykorzystujemy w&nbsp;formie zbiorczej, żeby poprawiać Grę.</li>\n<li>Zgodę zmienisz w&nbsp;każdej chwili w&nbsp;<a href=\"polityka-cookies.html#zgoda\">ustawieniach cookies</a>.</li>\n</ul>"
  },
  {
    "id": "odbiorcy",
    "n": "7",
    "headingId": "odbiorcy-h",
    "heading": "Odbiorcy danych",
    "body": "<p>Dane udostępniamy tylko podmiotom, które pomagają nam prowadzić Grę – na podstawie umów powierzenia przetwarzania albo jako odrębnym administratorom:</p>\n<ul>\n<li>hosting i&nbsp;serwery – <span class=\"ph\">[dostawca hostingu]</span>;</li>\n<li>płatności – Stripe Payments Europe, Ltd.;</li>\n<li>wysyłka e-maili – <span class=\"ph\">[dostawca poczty e-mail]</span>;</li>\n<li>analityka – <span class=\"ph\">[dostawca analityki]</span> (za zgodą);</li>\n<li>reklamy – <span class=\"ph\">[sieć reklamowa]</span> (za zgodą);</li>\n<li>księgowość – <span class=\"ph\">[biuro rachunkowe]</span>; doradcy prawni – w&nbsp;razie potrzeby;</li>\n<li>organy publiczne – gdy wymaga tego prawo.</li>\n</ul>\n<p>Nie sprzedajemy Twoich danych. Inni gracze widzą tylko Twój nick, poziom, statystyki zawodnika i&nbsp;<span class=\"ph\">[inne publiczne dane profilu, np. miejsce w&nbsp;rankingu]</span>.</p>"
  },
  {
    "id": "eog",
    "n": "8",
    "headingId": "eog-h",
    "heading": "Przekazywanie danych poza EOG",
    "body": "<p>Co do zasady przetwarzamy dane w&nbsp;Europejskim Obszarze Gospodarczym. Jeżeli dostawca przekazuje dane poza EOG, robi to na podstawie decyzji Komisji Europejskiej stwierdzającej odpowiedni stopień ochrony albo standardowych klauzul umownych zatwierdzonych przez Komisję. Kopię zabezpieczeń otrzymasz, pisząc na <span class=\"ph\">[e-mail kontaktowy]</span>.</p>"
  },
  {
    "id": "okres",
    "n": "9",
    "headingId": "okres-h",
    "heading": "Jak długo przechowujemy dane",
    "body": "<ul>\n<li>Konto i&nbsp;dane z&nbsp;gry – przez czas posiadania konta, a&nbsp;po jego usunięciu do <span class=\"ph\">[X]</span> dni (kopie zapasowe do <span class=\"ph\">[X]</span> dni).</li>\n<li>Konto nieaktywne przez <span class=\"ph\">[X miesięcy]</span> – możemy je usunąć po wcześniejszym powiadomieniu e-mailem.</li>\n<li>Dane do rozliczeń i&nbsp;dokumenty księgowe – 5 lat od końca roku kalendarzowego, w&nbsp;którym upłynął termin płatności podatku (Ordynacja podatkowa).</li>\n<li>Dane potrzebne do obrony roszczeń – do upływu terminów przedawnienia według Kodeksu cywilnego.</li>\n<li>Lista mailowa – do wycofania zgody.</li>\n<li>Wiadomości i&nbsp;zgłoszenia – <span class=\"ph\">[X miesięcy]</span> od zakończenia sprawy.</li>\n<li>Logi bezpieczeństwa i&nbsp;dane techniczne – <span class=\"ph\">[X]</span> dni.</li>\n<li>Cookies – przez okresy podane w&nbsp;<a href=\"polityka-cookies.html#lista\">Polityce cookies</a>.</li>\n</ul>"
  },
  {
    "id": "prawa",
    "n": "10",
    "headingId": "prawa-h",
    "heading": "Twoje prawa",
    "body": "<p>Masz prawo do:</p>\n<ul>\n<li>dostępu do danych i&nbsp;otrzymania ich kopii (art.&nbsp;15 RODO);</li>\n<li>sprostowania danych (art.&nbsp;16);</li>\n<li>usunięcia danych – „prawo do bycia zapomnianym” (art.&nbsp;17);</li>\n<li>ograniczenia przetwarzania (art.&nbsp;18);</li>\n<li>przenoszenia danych (art.&nbsp;20);</li>\n<li>sprzeciwu wobec przetwarzania opartego na naszym uzasadnionym interesie (art.&nbsp;21);</li>\n<li>wycofania zgody w&nbsp;dowolnym momencie – bez wpływu na zgodność z&nbsp;prawem przetwarzania przed jej wycofaniem (art.&nbsp;7 ust.&nbsp;3).</li>\n</ul>\n<p>Napisz na <span class=\"ph\">[e-mail kontaktowy]</span> z&nbsp;adresu przypisanego do konta. Odpowiemy bez zbędnej zwłoki, najpóźniej w&nbsp;ciągu miesiąca. Możemy poprosić o&nbsp;potwierdzenie tożsamości.</p>\n<p>Możesz też złożyć skargę do Prezesa Urzędu Ochrony Danych Osobowych, ul.&nbsp;Stawki 2, 00-193 Warszawa.</p>"
  },
  {
    "id": "wiek",
    "n": "11",
    "headingId": "wiek-h",
    "heading": "Wiek graczy",
    "body": "<p>Konto może założyć osoba, która ukończyła <span class=\"ph\">[16]</span> lat. <span class=\"ph\">[Osoba młodsza może grać tylko za zgodą rodzica lub opiekuna prawnego – albo: nie może założyć konta.]</span> Zakupy w&nbsp;Grze osoby niepełnoletnie robią wyłącznie za zgodą rodzica lub opiekuna. Jeśli okaże się, że zebraliśmy dane dziecka bez wymaganej zgody (art.&nbsp;8 RODO), usuniemy je. Rodzic lub opiekun może napisać na <span class=\"ph\">[e-mail kontaktowy]</span>.</p>"
  },
  {
    "id": "bezpieczenstwo",
    "n": "12",
    "headingId": "bezpieczenstwo-h",
    "heading": "Bezpieczeństwo",
    "body": "<p>Stosujemy środki techniczne i&nbsp;organizacyjne odpowiednie do ryzyka: szyfrowane połączenie (HTTPS), hasła przechowywane jako skróty, ograniczony dostęp do danych, kopie zapasowe i&nbsp;monitorowanie nadużyć. Nigdy nie poprosimy Cię o&nbsp;hasło w&nbsp;e-mailu ani na czacie.</p>"
  },
  {
    "id": "profilowanie",
    "n": "13",
    "headingId": "profilowanie-h",
    "heading": "Decyzje automatyczne i profilowanie",
    "body": "<p>Nie podejmujemy wobec Ciebie decyzji opartych wyłącznie na zautomatyzowanym przetwarzaniu, które wywołują skutki prawne lub w&nbsp;podobny sposób istotnie na Ciebie wpływają (art.&nbsp;22 RODO). Gra automatycznie dobiera przeciwników, zlecenia i&nbsp;nagrody, a&nbsp;system anty-cheat wykrywa podejrzane zachowania – blokadę konta za oszustwo <span class=\"ph\">[weryfikuje człowiek]</span>. Profilowanie reklamowe – tylko za Twoją zgodą.</p>"
  },
  {
    "id": "zmiany",
    "n": "14",
    "headingId": "zmiany-h",
    "heading": "Zmiany i kontakt",
    "body": "<p>Politykę możemy aktualizować, np. gdy dodamy nowe funkcje Gry albo zmienią się przepisy. Datę ostatniej zmiany znajdziesz na górze strony, a&nbsp;o&nbsp;istotnych zmianach poinformujemy w&nbsp;Grze lub e-mailem.</p>\n<p>Pytania o&nbsp;dane osobowe: <span class=\"ph\">[e-mail kontaktowy]</span> albo <a href=\"/contact\">formularz kontaktowy</a>.</p>"
  }
];
