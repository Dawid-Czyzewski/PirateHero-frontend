import type { Metadata } from "next";
import { LoginPageView } from "@/components/auth/LoginPage";

export const metadata: Metadata = {
  title: "Logowanie",
  description:
    "Zaloguj się do Freak Legends: e-mail lub nick i hasło. Wróć do kariery w przeglądarkowym RPG o freak fightach.",
  alternates: {
    canonical: "/login",
    languages: {
      "pl-PL": "/login",
      "x-default": "/login",
    },
  },
  openGraph: {
    type: "website",
    locale: "pl_PL",
    url: "/login",
    siteName: "Freak Legends",
    title: "Logowanie | Freak Legends",
    description:
      "Zaloguj się do Freak Legends i wróć do oktagonu. E-mail lub nick i hasło.",
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
    title: "Logowanie | Freak Legends",
    description: "Zaloguj się i wróć do kariery w Freak Legends.",
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

export default function LoginPage() {
  return <LoginPageView />;
}
