import type { Metadata, Viewport } from "next";
import { Bebas_Neue, Inter, Rubik_Wet_Paint } from "next/font/google";
import localFont from "next/font/local";
import { SessionExpiryListener } from "@/components/auth/SessionExpiryListener";
import { CookieBanner } from "@/components/site/CookieBanner";
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

const barlowCondensed = localFont({
  variable: "--font-barlow-condensed",
  display: "swap",
  src: [
    { path: "../../public/assets/auth/fonts/BarlowCondensed-Medium.woff2", weight: "500" },
    { path: "../../public/assets/auth/fonts/BarlowCondensed-SemiBold.woff2", weight: "600" },
    { path: "../../public/assets/auth/fonts/BarlowCondensed-Bold.woff2", weight: "700" },
  ],
});

const barlowSemiCondensed = localFont({
  variable: "--font-barlow-semi",
  display: "swap",
  src: [
    { path: "../../public/assets/auth/fonts/BarlowSemiCondensed-Regular.woff2", weight: "400" },
    { path: "../../public/assets/auth/fonts/BarlowSemiCondensed-Medium.woff2", weight: "500" },
    { path: "../../public/assets/auth/fonts/BarlowSemiCondensed-SemiBold.woff2", weight: "600" },
    { path: "../../public/assets/auth/fonts/BarlowSemiCondensed-Bold.woff2", weight: "700" },
  ],
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
      className={`${body.variable} ${display.variable} ${marker.variable} ${barlowCondensed.variable} ${barlowSemiCondensed.variable} h-full antialiased [--foot-h:54px] desk-mid:[--foot-h:96px] desk-xl:[--foot-h:64px]`}
    >
      <body className="w-full">
        {children}
        <CookieBanner />
        <SessionExpiryListener />
      </body>
    </html>
  );
}
