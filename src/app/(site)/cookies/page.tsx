import type { Metadata } from "next";
import { LegalLayout } from "@/components/legal/LegalLayout";
import { meta, sections, toc } from "@/content/legal/cookies";

export const metadata: Metadata = {
  title: "Polityka cookies",
  description:
    "Polityka cookies gry FREAK LEGENDS: jakie pliki cookies stosujemy, po co i jak zmienić ustawienia zgód.",
  alternates: { canonical: "/cookies" },
};

export default function CookiesPage() {
  return (
    <>
      <LegalLayout
        title={meta.title}
        words={meta.words}
        date={meta.date}
        showSettings={meta.showSettings}
        toc={toc}
        sections={sections}
      />
    </>
  );
}
