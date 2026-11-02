import type { Metadata } from "next";
import { AboutGame } from "@/components/landing/AboutGame";
import {
  ABOUT_FEATURES,
  ABOUT_PAGE_DESCRIPTION,
  ABOUT_UPDATED_AT,
} from "@/components/landing/aboutFeatures";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://freaklegends.pl";
const pageUrl = `${siteUrl}/o-grze`;
const fullTitle = "O grze | Freak Legends";

export const metadata: Metadata = {
  title: "O grze",
  description: ABOUT_PAGE_DESCRIPTION,
  keywords: [
    "o grze Freak Legends",
    "Freak Legends",
    "gra przeglądarkowa",
    "RPG online",
    "freak fight gra",
    "MMA gra przeglądarkowa",
    "walki PvP",
    "oktagon",
    "pasy mistrzowskie",
    "trening zawodnika",
    "hype",
    "browser game",
  ],
  category: "games",
  alternates: {
    canonical: "/o-grze",
    languages: {
      "pl-PL": "/o-grze",
      "x-default": "/o-grze",
    },
  },
  openGraph: {
    type: "website",
    locale: "pl_PL",
    url: "/o-grze",
    siteName: "Freak Legends",
    title: fullTitle,
    description: ABOUT_PAGE_DESCRIPTION,
    images: [
      {
        url: "/images/og-freak-legends.png",
        width: 1200,
        height: 630,
        alt: "Freak Legends — trening, hype, walki i pasy w przeglądarkowym RPG",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: fullTitle,
    description:
      "Jak działa Freak Legends: trening, hype, walki PvP w oktagonie i pasy mistrzowskie.",
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
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "Freak Legends",
      url: siteUrl,
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/icon-512.png`,
        width: 512,
        height: 512,
      },
    },
    {
      "@type": "WebPage",
      "@id": `${pageUrl}#webpage`,
      url: pageUrl,
      name: fullTitle,
      description: ABOUT_PAGE_DESCRIPTION,
      inLanguage: "pl-PL",
      datePublished: "2026-10-19",
      dateModified: ABOUT_UPDATED_AT,
      isPartOf: {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        name: "Freak Legends",
        url: siteUrl,
      },
      about: { "@id": `${siteUrl}/#game` },
      mainEntity: { "@id": `${siteUrl}/#game` },
      primaryImageOfPage: {
        "@type": "ImageObject",
        url: `${siteUrl}/images/og-freak-legends.png`,
        width: 1200,
        height: 630,
      },
      relatedLink: [
        siteUrl,
        `${siteUrl}/contact`,
        `${siteUrl}/privacy`,
        `${siteUrl}/terms`,
      ],
      breadcrumb: { "@id": `${pageUrl}#breadcrumb` },
      hasPart: { "@id": `${pageUrl}#features` },
    },
    {
      "@type": "VideoGame",
      "@id": `${siteUrl}/#game`,
      name: "Freak Legends",
      url: siteUrl,
      image: `${siteUrl}/images/og-freak-legends.png`,
      description:
        "Darmowa przeglądarkowa gra RPG w świecie freak fightów. Trenuj zawodnika, buduj hype, walcz PvP i zdobywaj pasy.",
      genre: ["RPG", "Fighting", "Browser game"],
      gamePlatform: ["Web browser"],
      applicationCategory: "Game",
      operatingSystem: "Any",
      inLanguage: "pl-PL",
      datePublished: "2026-10-18",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "PLN",
        availability: "https://schema.org/InStock",
        url: siteUrl,
      },
      author: { "@id": `${siteUrl}/#organization` },
      publisher: { "@id": `${siteUrl}/#organization` },
    },
    {
      "@type": "ItemList",
      "@id": `${pageUrl}#features`,
      name: "Filary rozgrywki Freak Legends",
      numberOfItems: ABOUT_FEATURES.length,
      itemListElement: ABOUT_FEATURES.map((feature, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: feature.title,
        description: feature.text,
        url: `${pageUrl}#${feature.id}`,
      })),
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
          name: "O grze",
          item: pageUrl,
        },
      ],
    },
  ],
};

export default function AboutGamePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AboutGame />
    </>
  );
}
