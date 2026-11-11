/* Auto-extracted from reference/polityka-cookies.html – template for lawyer review. Do not invent missing [placeholder] values. */
export const meta = {
  "title": "Polityka cookies",
  "words": [
    {
      "src": "t-polityka-w.webp",
      "w": 1255,
      "h": 331,
      "iw": 1255
    },
    {
      "src": "t-cookies-r.webp",
      "w": 1062,
      "h": 270,
      "iw": 1062
    }
  ],
  "showSettings": true,
  "date": "[data]"
} as const;

export const toc = [
  {
    "id": "czym",
    "n": "1",
    "label": "Czym są cookies"
  },
  {
    "id": "kto",
    "n": "2",
    "label": "Kto używa cookies"
  },
  {
    "id": "kategorie",
    "n": "3",
    "label": "Kategorie cookies"
  },
  {
    "id": "lista",
    "n": "4",
    "label": "Lista cookies"
  },
  {
    "id": "zgoda",
    "n": "5",
    "label": "Zgoda i ustawienia"
  },
  {
    "id": "przegladarka",
    "n": "6",
    "label": "Ustawienia przeglądarki"
  },
  {
    "id": "stripe",
    "n": "7",
    "label": "Płatności Stripe"
  },
  {
    "id": "zmiany",
    "n": "8",
    "label": "Zmiany i kontakt"
  }
] as const;

export type LegalSection = {
  id: string;
  consentControls?: boolean;
  n: string;
  headingId: string;
  heading: string;
  body: string;
};

export const sections: LegalSection[] = [
  {
    "id": "czym",
    "n": "1",
    "headingId": "czym-h",
    "heading": "Czym są pliki cookies",
    "body": "<p>Pliki cookies (ciasteczka) to małe pliki tekstowe, które strona zapisuje w&nbsp;Twojej przeglądarce. Podobnie działają inne technologie, np. pamięć przeglądarki (localStorage) i&nbsp;piksele śledzące – w&nbsp;tej polityce nazywamy je wspólnie „cookies”.</p>\n<p>Dzięki cookies pozostajesz zalogowany, a&nbsp;Gra pamięta Twoje ustawienia. Za Twoją zgodą wiemy też, jak gracze korzystają z&nbsp;Gry, i&nbsp;możemy pokazywać dopasowane reklamy.</p>\n<ul>\n<li><strong>sesyjne</strong> – znikają po zamknięciu przeglądarki;</li>\n<li><strong>stałe</strong> – zostają do wygaśnięcia albo usunięcia;</li>\n<li><strong>własne</strong> – zapisuje je nasza strona; <strong>zewnętrzne</strong> – nasi partnerzy.</li>\n</ul>"
  },
  {
    "id": "kto",
    "n": "2",
    "headingId": "kto-h",
    "heading": "Kto używa cookies",
    "body": "<p>Administratorem jest <span class=\"ph\">[Imię i nazwisko / nazwa firmy]</span>, <span class=\"ph\">[adres]</span>, NIP: <span class=\"ph\">[NIP]</span>, REGON: <span class=\"ph\">[REGON]</span> – szczegóły w&nbsp;<a href=\"/privacy\">Polityce prywatności</a>. Cookies zewnętrzne zapisują: Stripe (płatności), <span class=\"ph\">[dostawca analityki]</span> (za zgodą) i&nbsp;<span class=\"ph\">[sieć reklamowa]</span> (za zgodą).</p>"
  },
  {
    "id": "kategorie",
    "n": "3",
    "headingId": "kategorie-h",
    "heading": "Kategorie cookies",
    "body": "<div class=\"ltable-wrap\" role=\"region\" aria-label=\"Kategorie plików cookies\" tabindex=\"0\"><table class=\"ltable ltable--cat\"><caption class=\"sr-only\">Kategorie plików cookies</caption><thead><tr><th scope=\"col\">Kategoria</th><th scope=\"col\">Cel</th><th scope=\"col\">Kto zapisuje</th><th scope=\"col\">Jak długo</th><th scope=\"col\">Zgoda</th></tr></thead><tbody><tr><th scope=\"row\" data-label=\"Kategoria\">Niezbędne</th><td data-label=\"Cel\"><span>Logowanie i sesja, bezpieczeństwo, zapamiętanie Twoich zgód, ochrona płatności przed oszustwami.</span></td><td data-label=\"Kto zapisuje\"><span>Administrator, Stripe</span></td><td data-label=\"Jak długo\"><span>Od sesji do <span class=\"ph\">[12 miesięcy]</span></span></td><td data-label=\"Zgoda\"><span>Bez zgody – Gra bez nich nie działa</span></td></tr><tr><th scope=\"row\" data-label=\"Kategoria\">Analityczne</th><td data-label=\"Cel\"><span>Statystyki: ile osób gra, z których funkcji korzystają, gdzie Gra działa wolno.</span></td><td data-label=\"Kto zapisuje\"><span><span class=\"ph\">[dostawca analityki]</span></span></td><td data-label=\"Jak długo\"><span>Do <span class=\"ph\">[X miesięcy]</span></span></td><td data-label=\"Zgoda\"><span>Tylko za zgodą</span></td></tr><tr><th scope=\"row\" data-label=\"Kategoria\">Marketingowe</th><td data-label=\"Cel\"><span>Reklamy dopasowane do Ciebie, pomiar skuteczności kampanii, ograniczanie powtórzeń reklam.</span></td><td data-label=\"Kto zapisuje\"><span><span class=\"ph\">[sieć reklamowa]</span></span></td><td data-label=\"Jak długo\"><span>Do <span class=\"ph\">[X miesięcy]</span></span></td><td data-label=\"Zgoda\"><span>Tylko za zgodą</span></td></tr></tbody></table></div>\n<p>Domyślnie działają tylko cookies niezbędne. Analityczne i&nbsp;marketingowe włączamy dopiero po Twojej zgodzie.</p>"
  },
  {
    "id": "lista",
    "n": "4",
    "headingId": "lista-h",
    "heading": "Lista cookies",
    "body": "<div class=\"ltable-wrap\" role=\"region\" aria-label=\"Lista plików cookies\" tabindex=\"0\"><table class=\"ltable ltable--list\"><caption class=\"sr-only\">Lista plików cookies</caption><thead><tr><th scope=\"col\">Nazwa</th><th scope=\"col\">Kategoria</th><th scope=\"col\">Dostawca</th><th scope=\"col\">Cel</th><th scope=\"col\">Okres</th></tr></thead><tbody><tr><th scope=\"row\" data-label=\"Nazwa\">fl-cookie-consent</th><td data-label=\"Kategoria\"><span>Niezbędne (pamięć przeglądarki)</span></td><td data-label=\"Dostawca\"><span>Administrator</span></td><td data-label=\"Cel\"><span>Zapamiętuje Twoje wybory z banera cookies.</span></td><td data-label=\"Okres\"><span><span class=\"ph\">[12 miesięcy]</span> – potem zapytamy ponownie</span></td></tr><tr><th scope=\"row\" data-label=\"Nazwa\"><span class=\"ph\">[nazwa cookie sesji]</span></th><td data-label=\"Kategoria\"><span>Niezbędne</span></td><td data-label=\"Dostawca\"><span>Administrator</span></td><td data-label=\"Cel\"><span>Utrzymuje zalogowanie i chroni formularze przed nadużyciami.</span></td><td data-label=\"Okres\"><span>Do końca sesji / <span class=\"ph\">[X dni]</span> przy „Zapamiętaj mnie”</span></td></tr><tr><th scope=\"row\" data-label=\"Nazwa\">__stripe_mid, __stripe_sid</th><td data-label=\"Kategoria\"><span>Niezbędne</span></td><td data-label=\"Dostawca\"><span>Stripe</span></td><td data-label=\"Cel\"><span>Zapobieganie oszustwom podczas płatności.</span></td><td data-label=\"Okres\"><span>1 rok / 30 minut <span class=\"ph\">[sprawdź u Stripe]</span></span></td></tr><tr><th scope=\"row\" data-label=\"Nazwa\"><span class=\"ph\">[nazwa cookie]</span></th><td data-label=\"Kategoria\"><span>Analityczne</span></td><td data-label=\"Dostawca\"><span><span class=\"ph\">[dostawca analityki]</span></span></td><td data-label=\"Cel\"><span><span class=\"ph\">[cel]</span></span></td><td data-label=\"Okres\"><span><span class=\"ph\">[okres]</span></span></td></tr><tr><th scope=\"row\" data-label=\"Nazwa\"><span class=\"ph\">[nazwa cookie]</span></th><td data-label=\"Kategoria\"><span>Marketingowe</span></td><td data-label=\"Dostawca\"><span><span class=\"ph\">[sieć reklamowa]</span></span></td><td data-label=\"Cel\"><span><span class=\"ph\">[cel]</span></span></td><td data-label=\"Okres\"><span><span class=\"ph\">[okres]</span></span></td></tr></tbody></table></div>\n<p>Listę aktualizujemy, gdy zmieniamy dostawców lub technologię.</p>"
  },
  {
    "id": "zgoda",
    "consentControls": true,
    "n": "5",
    "headingId": "zgoda-h",
    "heading": "Zgoda i zmiana ustawień",
    "body": "<p>Przy pierwszej wizycie pokazujemy baner, w&nbsp;którym możesz zaakceptować wszystkie cookies, wybrać tylko niezbędne albo zdecydować w&nbsp;ustawieniach osobno o&nbsp;każdej kategorii. Odmowa jest tak samo łatwa jak zgoda.</p>\n<p>Twój wybór zapamiętujemy na <span class=\"ph\">[12 miesięcy]</span>, potem zapytamy ponownie. Zgodę zmienisz lub wycofasz w&nbsp;każdej chwili – wycofanie nie wpływa na zgodność z&nbsp;prawem wcześniejszego przetwarzania.</p>"
  },
  {
    "id": "przegladarka",
    "n": "6",
    "headingId": "przegladarka-h",
    "heading": "Ustawienia przeglądarki",
    "body": "<p>Cookies możesz też usuwać i&nbsp;blokować w&nbsp;ustawieniach przeglądarki (zwykle w&nbsp;sekcji „Prywatność” lub „Bezpieczeństwo”), także tylko dla wybranych stron. Zablokowanie cookies niezbędnych może uniemożliwić logowanie i&nbsp;grę. Okno prywatne usuwa cookies po jego zamknięciu.</p>"
  },
  {
    "id": "stripe",
    "n": "7",
    "headingId": "stripe-h",
    "heading": "Płatności Stripe",
    "body": "<p>Formularz płatności dostarcza Stripe Payments Europe, Ltd. Stripe zapisuje własne cookies niezbędne do wykrywania oszustw i&nbsp;bezpiecznego przeprowadzenia płatności. Są potrzebne, żeby kupić Złote Zęby lub Przepustkę, i&nbsp;nie wymagają zgody. Więcej informacji podaje Stripe w&nbsp;swojej polityce prywatności i&nbsp;cookies.</p>"
  },
  {
    "id": "zmiany",
    "n": "8",
    "headingId": "zmiany-h",
    "heading": "Zmiany i kontakt",
    "body": "<p>Politykę możemy zmieniać, np. gdy dodamy nowego dostawcę. Datę ostatniej zmiany znajdziesz na górze strony. Pytania: <span class=\"ph\">[e-mail kontaktowy]</span> albo <a href=\"/contact\">formularz kontaktowy</a>.</p>"
  }
];
