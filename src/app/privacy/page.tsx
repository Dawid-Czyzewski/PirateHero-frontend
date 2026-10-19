import type { Metadata } from "next";
import { PrivacyPolicy } from "@/components/legal/PrivacyPolicy";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://freaklegends.pl";
const pageUrl = `${siteUrl}/privacy`;
const updatedAt = "2026-10-19";

export const metadata: Metadata = {
  title: "Polityka prywatności",
  description:
    "Pełna polityka prywatności Freak Legends (RODO): administrator, dane konta i gry, cele przetwarzania, cookies, bezpieczeństwo, odbiorcy, okres przechowywania i Twoje prawa.",
  keywords: [
    "polityka prywatności",
    "RODO",
    "ochrona danych",
    "Freak Legends",
    "dane osobowe",
    "gra przeglądarkowa",
  ],
  alternates: {
    canonical: "/privacy",
    languages: {
      "pl-PL": "/privacy",
      "x-default": "/privacy",
    },
  },
  openGraph: {
    type: "website",
    locale: "pl_PL",
    url: "/privacy",
    siteName: "Freak Legends",
    title: "Polityka prywatności | Freak Legends",
    description:
      "Zasady przetwarzania danych w Freak Legends: co zbieramy, jak chronimy konta i płatności oraz jakie masz prawa.",
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
    title: "Polityka prywatności | Freak Legends",
    description:
      "RODO i dane graczy w Freak Legends: konto, analityka, bezpieczeństwo i Twoje prawa.",
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

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${pageUrl}#webpage`,
      url: pageUrl,
      name: "Polityka prywatności | Freak Legends",
      description:
        "Zasady przetwarzania danych osobowych w serwisie Freak Legends.",
      inLanguage: "pl-PL",
      dateModified: updatedAt,
      isPartOf: {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        name: "Freak Legends",
        url: siteUrl,
      },
      about: {
        "@type": "PrivacyPolicy",
        name: "Polityka prywatności Freak Legends",
        url: pageUrl,
        dateModified: updatedAt,
        inLanguage: "pl-PL",
      },
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
          name: "Polityka prywatności",
          item: pageUrl,
        },
      ],
    },
  ],
};

export default function PrivacyPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PrivacyPolicy updatedAt={updatedAt} />
    </>
  );
}
