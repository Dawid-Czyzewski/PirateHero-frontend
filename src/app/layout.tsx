import type { Metadata, Viewport } from "next";
import { Bebas_Neue, Inter, Rubik_Wet_Paint } from "next/font/google";
import { CookieBanner } from "@/components/legal/CookieBanner";
import "./globals.css";

const body = Inter({
  variable: "--font-body",
  subsets: ["latin", "latin-ext"],
});

const display = Bebas_Neue({
  variable: "--font-display",
  weight: "400",
  subsets: ["latin", "latin-ext"],
});

const marker = Rubik_Wet_Paint({
  variable: "--font-marker",
  weight: "400",
  subsets: ["latin", "latin-ext"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://freaklegends.pl";
const googleVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Freak Legends: przeglądarkowa gra RPG o freak fightach",
    template: "%s | Freak Legends",
  },
  description:
    "Freak Legends to darmowa przeglądarkowa gra RPG w świecie freak fightów. Trenuj zawodnika, walcz online, buduj popularność i zdobywaj pasy.",
  applicationName: "Freak Legends",
  authors: [{ name: "Freak Legends", url: siteUrl }],
  creator: "Freak Legends",
  publisher: "Freak Legends",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: "/favicon.ico",
  },
  manifest: "/manifest.webmanifest",
  keywords: [
    "Freak Legends",
    "gra przeglądarkowa",
    "RPG",
    "freak fight",
    "MMA gra",
    "gra online",
    "browser game",
    "walki",
  ],
  alternates: {
    canonical: "/",
    languages: {
      "pl-PL": "/",
      "x-default": "/",
    },
  },
  openGraph: {
    type: "website",
    locale: "pl_PL",
    url: "/",
    siteName: "Freak Legends",
    title: "Freak Legends: zostań legendą świata freak fightów",
    description:
      "Trenuj, walcz i buduj karierę zawodnika w przeglądarkowym RPG Freak Legends.",
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
    title: "Freak Legends: przeglądarkowa gra RPG",
    description:
      "Darmowa gra przeglądarkowa o freak fightach. Stwórz zawodnika i walcz o legendę.",
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
  ...(googleVerification
    ? { verification: { google: googleVerification } }
    : {}),
  category: "games",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pl"
      className={`${body.variable} ${display.variable} ${marker.variable} h-full antialiased`}
    >
      <body className="min-h-screen w-full bg-background text-foreground">
        {children}
        <CookieBanner />
      </body>
    </html>
  );
}
