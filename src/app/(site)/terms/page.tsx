import type { Metadata } from "next";
import { LegalLayout } from "@/components/legal/LegalLayout";
import { meta, sections, toc } from "@/content/legal/terms";

export const metadata: Metadata = {
  title: "Regulamin",
  description:
    "Regulamin gry FREAK LEGENDS: zasady korzystania z konta, płatności i treści w grze.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
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
