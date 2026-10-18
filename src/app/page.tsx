import type { Metadata } from "next";
import { FeatureStrip } from "@/components/landing/FeatureStrip";
import { Hero } from "@/components/landing/Hero";
import { SiteFooter } from "@/components/landing/SiteFooter";
import { SiteHeader } from "@/components/landing/SiteHeader";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://freaklegends.pl";

export const metadata: Metadata = {
  title: {
    absolute: "Freak Legends: przeglądarkowa gra RPG o freak fightach",
  },
  description:
    "Zostań legendą świata freak fightów. Trenuj, walcz z graczami, buduj hype i zdobywaj pasy w darmowej grze przeglądarkowej Freak Legends.",
  alternates: {
    canonical: "/",
    languages: {
      "pl-PL": "/",
      "x-default": "/",
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
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "Freak Legends",
      description:
        "Darmowa przeglądarkowa gra RPG w świecie freak fightów.",
      publisher: { "@id": `${siteUrl}/#organization` },
      inLanguage: "pl-PL",
    },
    {
      "@type": "VideoGame",
      "@id": `${siteUrl}/#game`,
      name: "Freak Legends",
      url: siteUrl,
      image: `${siteUrl}/images/og-freak-legends.png`,
      description:
        "Przeglądarkowa gra RPG w świecie freak fightów. Trenuj zawodnika, walcz online i zdobywaj tytuły.",
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
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="relative">
        <SiteHeader />
        <main>
          <Hero />
          <FeatureStrip />
        </main>
      </div>
      <SiteFooter />
    </>
  );
}
