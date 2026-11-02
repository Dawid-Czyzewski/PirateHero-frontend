import type { Metadata } from "next";
import { ContactPageView } from "@/components/legal/ContactPage";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://freaklegends.pl";
const pageUrl = `${siteUrl}/contact`;
const updatedAt = "2026-10-19";

export const metadata: Metadata = {
  title: "Kontakt",
  description:
    "Kontakt z supportem Freak Legends: formularz, e-mail support@freaklegends.pl, współpraca media@freaklegends.pl i Discord społeczności.",
  keywords: [
    "kontakt",
    "support",
    "Freak Legends",
    "pomoc",
    "FAQ",
    "Discord",
    "formularz kontaktowy",
  ],
  alternates: {
    canonical: "/contact",
    languages: {
      "pl-PL": "/contact",
      "x-default": "/contact",
    },
  },
  openGraph: {
    type: "website",
    locale: "pl_PL",
    url: "/contact",
    siteName: "Freak Legends",
    title: "Kontakt | Freak Legends",
    description:
      "Napisz do supportu Freak Legends: formularz kontaktowy, e-mail i społeczność Discord.",
    images: [
      {
        url: "/images/og-freak-legends.png",
        width: 1200,
        height: 630,
        alt: "Freak Legends, przeglądarkowa gra RPG o freak fightach",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kontakt | Freak Legends",
    description:
      "Support, współpraca i Discord Freak Legends. Napisz do nas.",
    images: ["/images/og-freak-legends.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

const faqItems = [
  {
    q: "Problem z rubinami",
    a: "Napisz przez formularz kontaktowy lub na support@freaklegends.pl, podając nick i opis problemu z rubinami.",
  },
  {
    q: "Odzyskiwanie konta",
    a: "Skontaktuj się z supportem z adresu e-mail powiązanego z kontem. Wybierz temat Konto / logowanie w formularzu.",
  },
  {
    q: "Problem z logowaniem",
    a: "Sprawdź hasło i przeglądarkę, a jeśli nadal nie działa, zgłoś to supportowi przez formularz lub e-mail.",
  },
  {
    q: "Płatności i zakupy",
    a: "W sprawach płatności napisz na support@freaklegends.pl z ID transakcji lub użyj formularza z tematem Płatności.",
  },
  {
    q: "Zgłoszenie błędu",
    a: "Opisz błąd, urządzenie i kroki odtworzenia w formularzu kontaktowym (temat Zgłoszenie błędu).",
  },
  {
    q: "Ban / fair play",
    a: "Odwołania od bana i pytania o fair play kieruj na support@freaklegends.pl z nickiem konta.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ContactPage",
      "@id": `${pageUrl}#webpage`,
      url: pageUrl,
      name: "Kontakt | Freak Legends",
      description:
        "Formularz i dane kontaktowe supportu Freak Legends.",
      inLanguage: "pl-PL",
      datePublished: updatedAt,
      dateModified: updatedAt,
      isPartOf: {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        name: "Freak Legends",
        url: siteUrl,
      },
      primaryImageOfPage: {
        "@type": "ImageObject",
        url: `${siteUrl}/images/og-freak-legends.png`,
        width: 1200,
        height: 630,
      },
      mainEntity: {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: "Freak Legends",
        url: siteUrl,
        email: "support@freaklegends.pl",
        contactPoint: [
          {
            "@type": "ContactPoint",
            contactType: "customer support",
            email: "support@freaklegends.pl",
            availableLanguage: ["pl", "Polish"],
          },
          {
            "@type": "ContactPoint",
            contactType: "sales",
            email: "media@freaklegends.pl",
            availableLanguage: ["pl", "Polish"],
          },
        ],
      },
      relatedLink: [
        `${siteUrl}/privacy`,
        `${siteUrl}/terms`,
        `${siteUrl}/cookies`,
      ],
      breadcrumb: { "@id": `${pageUrl}#breadcrumb` },
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${pageUrl}#breadcrumb`,
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Strona główna",
          item: siteUrl,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Kontakt",
          item: pageUrl,
        },
      ],
    },
    {
      "@type": "FAQPage",
      "@id": `${pageUrl}#faq`,
      isPartOf: { "@id": `${pageUrl}#webpage` },
      mainEntity: faqItems.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.a,
        },
      })),
    },
  ],
};

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ContactPageView />
    </>
  );
}
