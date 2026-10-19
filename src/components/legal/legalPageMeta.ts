import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://freaklegends.pl";

export const LEGAL_UPDATED_AT = "2026-10-19";

type LegalPageConfig = {
  path: "/privacy" | "/terms" | "/cookies";
  title: string;
  description: string;
  ogDescription: string;
  twitterDescription: string;
  keywords: string[];
  aboutType: "PrivacyPolicy" | "TermsOfService" | "DigitalDocument";
  aboutName: string;
  breadcrumbName: string;
};

export function buildLegalMetadata(config: LegalPageConfig): Metadata {
  const fullTitle = `${config.title} | Freak Legends`;

  return {
    title: config.title,
    description: config.description,
    keywords: config.keywords,
    alternates: {
      canonical: config.path,
      languages: {
        "pl-PL": config.path,
        "x-default": config.path,
      },
    },
    openGraph: {
      type: "website",
      locale: "pl_PL",
      url: config.path,
      siteName: "Freak Legends",
      title: fullTitle,
      description: config.ogDescription,
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
      title: fullTitle,
      description: config.twitterDescription,
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
}

export function buildLegalJsonLd(config: LegalPageConfig) {
  const pageUrl = `${siteUrl}${config.path}`;
  const fullTitle = `${config.title} | Freak Legends`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: fullTitle,
        description: config.description,
        inLanguage: "pl-PL",
        datePublished: LEGAL_UPDATED_AT,
        dateModified: LEGAL_UPDATED_AT,
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
        about: {
          "@type": config.aboutType,
          name: config.aboutName,
          url: pageUrl,
          datePublished: LEGAL_UPDATED_AT,
          dateModified: LEGAL_UPDATED_AT,
          inLanguage: "pl-PL",
        },
        relatedLink: [
          `${siteUrl}/privacy`,
          `${siteUrl}/terms`,
          `${siteUrl}/cookies`,
          `${siteUrl}/contact`,
        ].filter((url) => url !== pageUrl),
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
            name: config.breadcrumbName,
            item: pageUrl,
          },
        ],
      },
    ],
  };
}

export const PRIVACY_PAGE = {
  path: "/privacy",
  title: "Polityka prywatności",
  description:
    "Pełna polityka prywatności Freak Legends (RODO): administrator, dane konta i gry, cele przetwarzania, cookies, bezpieczeństwo, odbiorcy, okres przechowywania i Twoje prawa.",
  ogDescription:
    "Zasady przetwarzania danych w Freak Legends: co zbieramy, jak chronimy konta i płatności oraz jakie masz prawa.",
  twitterDescription:
    "RODO i dane graczy w Freak Legends: konto, analityka, bezpieczeństwo i Twoje prawa.",
  keywords: [
    "polityka prywatności",
    "RODO",
    "ochrona danych",
    "Freak Legends",
    "dane osobowe",
    "gra przeglądarkowa",
  ],
  aboutType: "PrivacyPolicy",
  aboutName: "Polityka prywatności Freak Legends",
  breadcrumbName: "Polityka prywatności",
} as const satisfies LegalPageConfig;

export const TERMS_PAGE = {
  path: "/terms",
  title: "Regulamin",
  description:
    "Regulamin Freak Legends: konto gracza, zasady rozgrywki, fair play, własność intelektualna, płatności opcjonalne i odpowiedzialność.",
  ogDescription:
    "Zasady korzystania z Freak Legends: konto, rozgrywka, zakazy, IP i zmiany regulaminu.",
  twitterDescription:
    "Konto, fair play i zasady gry w Freak Legends. Pełny regulamin serwisu.",
  keywords: [
    "regulamin",
    "Freak Legends",
    "zasady gry",
    "konto gracza",
    "fair play",
    "gra przeglądarkowa",
  ],
  aboutType: "TermsOfService",
  aboutName: "Regulamin Freak Legends",
  breadcrumbName: "Regulamin",
} as const satisfies LegalPageConfig;

export const COOKIES_PAGE = {
  path: "/cookies",
  title: "Polityka cookies",
  description:
    "Polityka cookies Freak Legends: cookies niezbędne, preferencje, analityka, marketing, czas przechowywania i zarządzanie zgodą.",
  ogDescription:
    "Jak Freak Legends używa cookies: kategorie, zgody, czas życia i sposób zarządzania.",
  twitterDescription:
    "Cookies niezbędne, preferencje, analityka i marketing w Freak Legends.",
  keywords: [
    "cookies",
    "ciasteczka",
    "Freak Legends",
    "zgoda cookies",
    "analityka",
    "RODO",
  ],
  aboutType: "DigitalDocument",
  aboutName: "Polityka cookies Freak Legends",
  breadcrumbName: "Polityka cookies",
} as const satisfies LegalPageConfig;
