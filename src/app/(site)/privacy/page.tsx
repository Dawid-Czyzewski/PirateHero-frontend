import type { Metadata } from "next";
import { LegalLayout } from "@/components/legal/LegalLayout";
import { meta, sections, toc } from "@/content/legal/privacy";

export const metadata: Metadata = {
  title: "Polityka prywatności",
  description:
    "Polityka prywatności FREAK LEGENDS: kto przetwarza dane, w jakim celu i jakie masz prawa.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
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
