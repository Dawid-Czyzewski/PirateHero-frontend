import type { Metadata } from "next";
import { RegisterPageView } from "@/components/auth/RegisterPage";

export const metadata: Metadata = {
  title: "Rejestracja",
  description:
    "Załóż konto w Freak Legends: nick, e-mail i hasło. Zacznij karierę w przeglądarkowym RPG o freak fightach.",
  keywords: [
    "rejestracja Freak Legends",
    "załóż konto",
    "stwórz konto",
    "Freak Legends register",
  ],
  alternates: {
    canonical: "/register",
    languages: {
      "pl-PL": "/register",
      "x-default": "/register",
    },
  },
  openGraph: {
    type: "website",
    locale: "pl_PL",
    url: "/register",
    siteName: "Freak Legends",
    title: "Rejestracja | Freak Legends",
    description:
      "Stwórz konto w Freak Legends i zacznij karierę zawodnika freak fightów.",
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
    title: "Rejestracja | Freak Legends",
    description: "Załóż konto i stwórz swoją legendę w Freak Legends.",
    images: ["/images/og-freak-legends.png"],
  },
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export default function RegisterPage() {
  return <RegisterPageView />;
}
