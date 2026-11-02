/* Auto-extracted from reference/regulamin.html – template for lawyer review. Do not invent missing [placeholder] values. */
export const meta = {
  "title": "Regulamin",
  "words": [
    {
      "src": "t-regulamin-r.webp",
      "w": 1460,
      "h": 311,
      "iw": 1460
    }
  ],
  "showSettings": false,
  "date": "[data]"
} as const;

export const toc = [
  {
    "id": "ogolne",
    "n": "1",
    "label": "Postanowienia ogólne"
  },
  {
    "id": "definicje",
    "n": "2",
    "label": "Definicje"
  },
  {
    "id": "wymagania",
    "n": "3",
    "label": "Wymagania techniczne"
  },
  {
    "id": "konto",
    "n": "4",
    "label": "Konto gracza"
  },
  {
    "id": "fair-play",
    "n": "5",
    "label": "Zasady fair play"
  },
  {
    "id": "f2p",
    "n": "6",
    "label": "Gra za darmo i reklamy"
  },
  {
    "id": "zlote-zeby",
    "n": "7",
    "label": "Złote Zęby i zakupy"
  },
  {
    "id": "przepustka",
    "n": "8",
    "label": "Przepustka sezonowa"
  },
  {
    "id": "odstapienie",
    "n": "9",
    "label": "Prawo odstąpienia"
  },
  {
    "id": "reklamacje",
    "n": "10",
    "label": "Reklamacje"
  },
  {
    "id": "waitlista",
    "n": "11",
    "label": "Lista oczekujących"
  },
  {
    "id": "odpowiedzialnosc",
    "n": "12",
    "label": "Odpowiedzialność i przerwy"
  },
  {
    "id": "zawieszenie",
    "n": "13",
    "label": "Zawieszenie konta"
  },
  {
    "id": "prawa-autorskie",
    "n": "14",
    "label": "Prawa autorskie"
  },
  {
    "id": "spory",
    "n": "15",
    "label": "Rozwiązywanie sporów"
  },
  {
    "id": "zmiany",
    "n": "16",
    "label": "Zmiany Regulaminu"
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
    "id": "ogolne",
    "n": "1",
    "headingId": "ogolne-h",
    "heading": "Postanowienia ogólne",
    "body": "<p>Regulamin określa zasady korzystania z&nbsp;gry przeglądarkowej FREAK LEGENDS oraz świadczenia usług drogą elektroniczną (art.&nbsp;8 ustawy o&nbsp;świadczeniu usług drogą elektroniczną).</p>\n<ul>\n<li>Usługodawcą i&nbsp;sprzedawcą jest <span class=\"ph\">[Imię i nazwisko / nazwa firmy]</span>, <span class=\"ph\">[adres]</span>, NIP: <span class=\"ph\">[NIP]</span>, REGON: <span class=\"ph\">[REGON]</span>, <span class=\"ph\">[numer KRS lub wpis do CEIDG]</span>, e-mail: <span class=\"ph\">[e-mail kontaktowy]</span><span class=\"ph\">[, tel.: telefon – opcjonalnie]</span>.</li>\n<li>Regulamin jest dostępny bezpłatnie na stronie <span class=\"ph\">[adres strony]</span> w&nbsp;formie, która pozwala go pobrać, zapisać i&nbsp;wydrukować.</li>\n<li>Zakładając konto, akceptujesz Regulamin i&nbsp;zawierasz z&nbsp;nami umowę o&nbsp;dostarczanie Gry na czas nieokreślony.</li>\n<li>Dane osobowe przetwarzamy zgodnie z&nbsp;<a href=\"/privacy\">Polityką prywatności</a>, a&nbsp;pliki cookies – zgodnie z&nbsp;<a href=\"/cookies\">Polityką cookies</a>.</li>\n<li>FREAK LEGENDS to fikcja: wszystkie postacie, federacje, gale i&nbsp;wydarzenia w&nbsp;Grze są wymyślone, a&nbsp;podobieństwo do prawdziwych osób jest przypadkowe.</li>\n</ul>"
  },
  {
    "id": "definicje",
    "n": "2",
    "headingId": "definicje-h",
    "heading": "Definicje",
    "body": "<ul>\n<li><strong>Gra</strong> – gra przeglądarkowa FREAK LEGENDS dostępna na stronie <span class=\"ph\">[adres strony]</span>.</li>\n<li><strong>Gracz</strong> – osoba korzystająca z&nbsp;Gry; <strong>Konsument</strong> – Gracz będący konsumentem w&nbsp;rozumieniu art.&nbsp;22<sup>1</sup> Kodeksu cywilnego.</li>\n<li><strong>Konto</strong> – indywidualne konto Gracza w&nbsp;Grze.</li>\n<li><strong>Cebuliony</strong> – waluta zdobywana w&nbsp;trakcie rozgrywki<span class=\"ph\">[; potwierdź, czy można ją kupić]</span>.</li>\n<li><strong>Złote Zęby</strong> – waluta premium, którą można kupić za prawdziwe pieniądze albo zdobyć w&nbsp;Grze (np. za reklamy z&nbsp;nagrodą lub zapis na listę oczekujących).</li>\n<li><strong>Medale</strong> – punkty postępu Sezonu zdobywane za zadania; odblokowują nagrody w&nbsp;Przepustce.</li>\n<li><strong>Przepustka sezonowa</strong> – ścieżka nagród Sezonu: darmowa i&nbsp;płatna (premium).</li>\n<li><strong>Sezon</strong> – okres obowiązywania Przepustki: <span class=\"ph\">[czas trwania sezonu]</span>.</li>\n<li><strong>Treści cyfrowe</strong> – Złote Zęby, Przepustka premium i&nbsp;inne płatne elementy Gry dostarczane w&nbsp;formie cyfrowej.</li>\n</ul>"
  },
  {
    "id": "wymagania",
    "n": "3",
    "headingId": "wymagania-h",
    "heading": "Wymagania techniczne",
    "body": "<ul>\n<li>Urządzenie z&nbsp;dostępem do internetu i&nbsp;aktualna przeglądarka z&nbsp;włączoną obsługą JavaScriptu, cookies i&nbsp;pamięci lokalnej.</li>\n<li>Aktywny adres e-mail.</li>\n<li>Do płatności – karta lub inna metoda dostępna w&nbsp;formularzu Stripe.</li>\n</ul>\n<p>Korzystanie z&nbsp;internetu wiąże się z&nbsp;typowymi zagrożeniami, np. złośliwym oprogramowaniem i&nbsp;wyłudzaniem haseł (phishing). Aktualizuj oprogramowanie i&nbsp;nikomu nie podawaj hasła. Zakazane jest dostarczanie treści o&nbsp;charakterze bezprawnym.</p>"
  },
  {
    "id": "konto",
    "n": "4",
    "headingId": "konto-h",
    "heading": "Konto gracza",
    "body": "<ul>\n<li>Konto może założyć osoba, która ukończyła <span class=\"ph\">[16]</span> lat. Osoby niepełnoletnie grają i&nbsp;robią zakupy za zgodą rodzica lub opiekuna prawnego.</li>\n<li>Jedna osoba może mieć <span class=\"ph\">[jedno]</span> Konto.</li>\n<li>Nick nie może naruszać prawa ani dóbr osobistych, być wulgarny, obraźliwy ani podszywać się pod inne osoby, w&nbsp;tym pod zespół Gry.</li>\n<li>Dbasz o&nbsp;poufność hasła. Konto jest osobiste – nie wolno go sprzedawać, udostępniać ani przekazywać.</li>\n<li>Konto możesz usunąć w&nbsp;każdej chwili w&nbsp;ustawieniach lub pisząc na <span class=\"ph\">[e-mail kontaktowy]</span> – jest to wypowiedzenie umowy <span class=\"ph\">[ze skutkiem natychmiastowym]</span>.</li>\n</ul>"
  },
  {
    "id": "fair-play",
    "n": "5",
    "headingId": "fair-play-h",
    "heading": "Zasady fair play",
    "body": "<p>Gramy uczciwie. Zabronione jest w&nbsp;szczególności:</p>\n<ul>\n<li>używanie botów, skryptów, makr i&nbsp;programów automatyzujących rozgrywkę;</li>\n<li>cheaty, modyfikowanie Gry i&nbsp;ingerowanie w&nbsp;komunikację z&nbsp;serwerem;</li>\n<li>wykorzystywanie błędów (exploitów) zamiast ich zgłoszenia;</li>\n<li>handel Kontami, walutą i&nbsp;przedmiotami z&nbsp;Gry za prawdziwe pieniądze;</li>\n<li>zakładanie multikont, aby zdobywać przewagę lub nagrody;</li>\n<li>obrażanie i&nbsp;nękanie innych, mowa nienawiści, spam i&nbsp;treści bezprawne.</li>\n</ul>\n<p>Znalazłeś błąd? Zgłoś go na <span class=\"ph\">[e-mail kontaktowy]</span> – za ważne zgłoszenia możemy przyznać nagrodę w&nbsp;Grze.</p>"
  },
  {
    "id": "f2p",
    "n": "6",
    "headingId": "f2p-h",
    "heading": "Gra za darmo i reklamy",
    "body": "<ul>\n<li>Gra jest darmowa. Płatne Treści cyfrowe są dobrowolne i&nbsp;nie są potrzebne, żeby grać.</li>\n<li>Możemy wyświetlać reklamy, w&nbsp;tym reklamy z&nbsp;nagrodą. Oglądasz je dobrowolnie, a&nbsp;bonus otrzymujesz po obejrzeniu całej reklamy, w&nbsp;limicie <span class=\"ph\">[X dziennie]</span>.</li>\n<li>Przed każdym zakupem jasno pokazujemy cenę i&nbsp;to, co otrzymasz.</li>\n<li><span class=\"ph\">[Jeśli Gra zawiera losowe nagrody: przed zakupem pokazujemy szanse na zdobycie poszczególnych nagród – usuń, jeśli nie dotyczy.]</span></li>\n</ul>"
  },
  {
    "id": "zlote-zeby",
    "n": "7",
    "headingId": "zlote-zeby-h",
    "heading": "Złote Zęby i zakupy",
    "body": "<ul>\n<li>Złote Zęby kupujesz w&nbsp;sklepie w&nbsp;Grze. Ceny podajemy w&nbsp;złotych (PLN) i&nbsp;są to ceny brutto (z&nbsp;VAT).</li>\n<li>Płatności obsługuje Stripe; dostępne metody widzisz w&nbsp;formularzu płatności.</li>\n<li>Umowę zawieramy w&nbsp;chwili potwierdzenia zamówienia przyciskiem „Kupuję i&nbsp;płacę” (lub o&nbsp;równoważnej treści).</li>\n<li>Złote Zęby dodajemy do Konta zaraz po zaksięgowaniu płatności, a&nbsp;potwierdzenie zakupu wysyłamy e-mailem.</li>\n<li>Złote Zęby nie są pieniędzmi ani środkiem płatniczym. Nie można ich wymienić na pieniądze ani przekazać innemu Graczowi lub na inne Konto.</li>\n<li>Złote Zęby wydajesz w&nbsp;Grze na treści i&nbsp;funkcje widoczne w&nbsp;sklepie. Złote Zęby nie wygasają, dopóki istnieje Konto i&nbsp;Gra <span class=\"ph\">[lub: okres ważności]</span>.</li>\n<li>Fakturę wystawimy na życzenie – napisz na <span class=\"ph\">[e-mail kontaktowy]</span>.</li>\n</ul>"
  },
  {
    "id": "przepustka",
    "n": "8",
    "headingId": "przepustka-h",
    "heading": "Przepustka sezonowa (Medale)",
    "body": "<ul>\n<li>Sezon trwa <span class=\"ph\">[czas trwania sezonu]</span>. Za zadania w&nbsp;Grze zdobywasz Medale, które odblokowują kolejne poziomy Przepustki.</li>\n<li>Ścieżka darmowa jest dostępna dla wszystkich. Przepustka premium – kupowana za <span class=\"ph\">[Złote Zęby / PLN]</span> – odblokowuje dodatkowe nagrody.</li>\n<li>Nagrody odbierasz do końca Sezonu <span class=\"ph\">[lub: w&nbsp;ciągu X dni po jego zakończeniu]</span>; nieodebrane przepadają.</li>\n<li>Przepustka dotyczy jednego Sezonu i&nbsp;nie przechodzi na kolejny.</li>\n<li>Nagrody z&nbsp;kupionej Przepustki nie zmienią się na Twoją niekorzyść.</li>\n</ul>"
  },
  {
    "id": "odstapienie",
    "n": "9",
    "headingId": "odstapienie-h",
    "heading": "Prawo odstąpienia od umowy",
    "body": "<p>Konsument może odstąpić od umowy zawartej na odległość w&nbsp;ciągu 14 dni bez podania przyczyny (art.&nbsp;27 ustawy o&nbsp;prawach konsumenta).</p>\n<ul>\n<li><strong>Treści cyfrowe:</strong> prawo odstąpienia nie przysługuje, jeśli dostarczanie Złotych Zębów lub Przepustki rozpoczęło się za Twoją wyraźną i&nbsp;uprzednią zgodą, po poinformowaniu Cię o&nbsp;utracie tego prawa, a&nbsp;my przekazaliśmy Ci potwierdzenie (art.&nbsp;38 ust.&nbsp;1 pkt&nbsp;13 ustawy o&nbsp;prawach konsumenta). O&nbsp;tę zgodę prosimy w&nbsp;sklepie osobnym polem przed zapłatą.</li>\n<li>Jeśli takiej zgody nie wyraziłeś, możesz odstąpić od umowy, pisząc na <span class=\"ph\">[e-mail kontaktowy]</span> lub korzystając z&nbsp;<span class=\"ph\">[wzoru formularza odstąpienia]</span>. Zwrot otrzymasz w&nbsp;ciągu 14 dni, tą samą metodą płatności.</li>\n<li>Umowę o&nbsp;darmowe Konto możesz zakończyć w&nbsp;każdej chwili, usuwając Konto.</li>\n<li>Te same prawa ma przedsiębiorca będący osobą fizyczną, gdy umowa nie ma dla niego charakteru zawodowego (art.&nbsp;38a ustawy o&nbsp;prawach konsumenta).</li>\n</ul>"
  },
  {
    "id": "reklamacje",
    "n": "10",
    "headingId": "reklamacje-h",
    "heading": "Reklamacje",
    "body": "<p>Odpowiadamy za zgodność Treści cyfrowych i&nbsp;Gry z&nbsp;umową (rozdział 5b ustawy o&nbsp;prawach konsumenta).</p>\n<ul>\n<li>Reklamację wyślij na <span class=\"ph\">[e-mail kontaktowy]</span> lub przez <a href=\"/contact\">formularz kontaktowy</a>. Podaj nick lub e-mail Konta, opis problemu, datę, <span class=\"ph\">[identyfikator transakcji]</span> przy zakupach oraz swoje żądanie.</li>\n<li>Odpowiemy w&nbsp;ciągu 14 dni. Brak odpowiedzi w&nbsp;tym terminie oznacza, że uznaliśmy reklamację.</li>\n<li>Gdy Treść cyfrowa nie została dostarczona lub jest niezgodna z&nbsp;umową, możesz żądać doprowadzenia jej do zgodności, a&nbsp;w&nbsp;przypadkach z&nbsp;ustawy – obniżenia ceny albo odstąpienia od umowy i&nbsp;zwrotu pieniędzy.</li>\n</ul>"
  },
  {
    "id": "waitlista",
    "n": "11",
    "headingId": "waitlista-h",
    "heading": "Lista oczekujących z nagrodą",
    "body": "<ul>\n<li>Za zapis na listę oczekujących (listę mailową) i&nbsp;jego potwierdzenie otrzymujesz nagrodę: <span class=\"ph\">[np. 60 Złotych Zębów]</span>.</li>\n<li>Nagrodę przyznajemy raz na jeden adres e-mail i&nbsp;jedną osobę, po założeniu Konta na ten sam adres do <span class=\"ph\">[data]</span>.</li>\n<li>Nagrody nie można wymienić na pieniądze ani przenieść na inne Konto. Wypisanie się z&nbsp;listy nie odbiera przyznanej nagrody.</li>\n<li>W&nbsp;razie nadużyć (np. masowego zakładania adresów) możemy odmówić nagrody lub ją cofnąć.</li>\n<li>Zasady przetwarzania danych – w&nbsp;<a href=\"polityka-prywatnosci.html#lista\">Polityce prywatności</a>.</li>\n</ul>"
  },
  {
    "id": "odpowiedzialnosc",
    "n": "12",
    "headingId": "odpowiedzialnosc-h",
    "heading": "Odpowiedzialność i przerwy w działaniu",
    "body": "<ul>\n<li>Dbamy, by Gra działała bez przerw, ale możemy ją czasowo wyłączyć na prace techniczne i&nbsp;aktualizacje. O&nbsp;planowanych przerwach informujemy z&nbsp;wyprzedzeniem, gdy to możliwe.</li>\n<li>Możemy zmieniać i&nbsp;balansować rozgrywkę (np. statystyki przedmiotów, ceny w&nbsp;Cebulionach, wydarzenia), żeby Gra była uczciwa i&nbsp;ciekawa – bez zmiany na Twoją niekorzyść istoty Treści cyfrowych, za które zapłaciłeś.</li>\n<li>Za szkody odpowiadamy na zasadach ogólnych. Regulamin nie ogranicza praw konsumenta wynikających z&nbsp;przepisów bezwzględnie obowiązujących.</li>\n<li>Nie odpowiadamy za skutki udostępnienia przez Ciebie hasła innym osobom.</li>\n</ul>"
  },
  {
    "id": "zawieszenie",
    "n": "13",
    "headingId": "zawieszenie-h",
    "heading": "Zawieszenie i usunięcie konta",
    "body": "<ul>\n<li>Za naruszenie Regulaminu, zwłaszcza zasad fair play, możemy dać ostrzeżenie, czasowo zawiesić Konto, a&nbsp;przy poważnym lub powtarzającym się naruszeniu – wypowiedzieć umowę i&nbsp;usunąć Konto.</li>\n<li>Poinformujemy Cię e-mailem, podając przyczynę. Możesz się odwołać w&nbsp;ciągu <span class=\"ph\">[14]</span> dni na <span class=\"ph\">[e-mail kontaktowy]</span>; odwołanie rozpatruje człowiek.</li>\n<li>Niewykorzystane Złote Zęby po usunięciu Konta: <span class=\"ph\">[zasady zwrotu niewykorzystanych Złotych Zębów]</span>.</li>\n<li>Jeśli zakończymy prowadzenie Gry, uprzedzimy Graczy co najmniej <span class=\"ph\">[30]</span> dni wcześniej; <span class=\"ph\">[zasady zwrotu za niewykorzystane Treści cyfrowe]</span>.</li>\n</ul>"
  },
  {
    "id": "prawa-autorskie",
    "n": "14",
    "headingId": "prawa-autorskie-h",
    "heading": "Prawa autorskie",
    "body": "<p>Gra, jej grafika, postacie, teksty, muzyka i&nbsp;kod są chronione prawem autorskim i&nbsp;należą do <span class=\"ph\">[nazwa firmy]</span> lub licencjodawców. Możesz z&nbsp;nich korzystać tylko w&nbsp;ramach Gry, na własny użytek. Zrzuty ekranu i&nbsp;nagrania z&nbsp;rozgrywki możesz publikować <span class=\"ph\">[w&nbsp;celach niekomercyjnych / na zasadach dla twórców]</span>.</p>"
  },
  {
    "id": "spory",
    "n": "15",
    "headingId": "spory-h",
    "heading": "Rozwiązywanie sporów",
    "body": "<ul>\n<li>Konsument może skorzystać z&nbsp;pozasądowych sposobów rozwiązywania sporów: pomocy miejskiego lub powiatowego rzecznika konsumentów, stałego polubownego sądu konsumenckiego albo mediacji prowadzonej przez wojewódzki inspektorat Inspekcji Handlowej. Informacje znajdziesz na stronie Urzędu Ochrony Konkurencji i&nbsp;Konsumentów.</li>\n<li>Spory rozstrzyga sąd właściwy według przepisów ogólnych.</li>\n<li>Prawem właściwym jest prawo polskie. Konsument zachowuje ochronę, którą dają mu bezwzględnie obowiązujące przepisy kraju jego miejsca zamieszkania.</li>\n</ul>"
  },
  {
    "id": "zmiany",
    "n": "16",
    "headingId": "zmiany-h",
    "heading": "Zmiany Regulaminu i postanowienia końcowe",
    "body": "<ul>\n<li>Możemy zmienić Regulamin z&nbsp;ważnych przyczyn: zmiany przepisów, nowych funkcji Gry, zmiany metod płatności lub ze względów bezpieczeństwa.</li>\n<li>O&nbsp;zmianie poinformujemy w&nbsp;Grze i&nbsp;e-mailem co najmniej <span class=\"ph\">[14]</span> dni przed jej wejściem w&nbsp;życie. Jeśli nie akceptujesz zmian, możesz przed tą datą usunąć Konto.</li>\n<li>Zmiany nie dotyczą zakupów dokonanych wcześniej.</li>\n<li>W&nbsp;sprawach nieuregulowanych stosuje się prawo polskie, w&nbsp;szczególności Kodeks cywilny, ustawę o&nbsp;prawach konsumenta i&nbsp;ustawę o&nbsp;świadczeniu usług drogą elektroniczną.</li>\n<li>Regulamin obowiązuje od <span class=\"ph\">[data]</span>.</li>\n</ul>"
  }
];
