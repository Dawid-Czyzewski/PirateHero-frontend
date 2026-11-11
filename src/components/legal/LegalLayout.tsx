import Image from "next/image";
import type { CSSProperties } from "react";
import { BackToTop } from "@/components/legal/BackToTop";
import { LEGAL_TITLE_ID } from "@/components/legal/legalIds";
import { LegalToc } from "@/components/legal/LegalToc";
import {
  CONSENT_CONTROLS,
  LEGAL_MAIN,
  PLACEHOLDER,
  SECTION,
  SECTION_BODY,
  SECTION_HEADING,
  SECTION_NUMBER,
  SECTION_NUMBER_ROW,
} from "@/components/legal/legalStyles";
import { CookieConsentControls } from "@/components/site/CookieConsentControls";
import { SiteShell } from "@/components/site/SiteShell";

type TitleWord = {
  src: string;
  w: number;
  h: number;
  iw: number;
};

type TocItem = { id: string; n: string; label: string };

type Section = {
  id: string;
  n: string;
  headingId: string;
  heading: string;
  body: string;
  consentControls?: boolean;
};

type LegalLayoutProps = {
  title: string;
  words: readonly TitleWord[];
  date: string;
  showSettings?: boolean;
  toc: readonly TocItem[];
  sections: readonly Section[];
};

const TABLE_MARKER = 'class="ltable';

function layoutOf(section: Section): keyof typeof SECTION_BODY {
  return section.body.includes(TABLE_MARKER) ? "table" : "prose";
}

export function LegalLayout({ title, words, date, showSettings = false, toc, sections }: LegalLayoutProps) {
  return (
    <SiteShell page="legal" mainClassName={LEGAL_MAIN}>
      <header className="relative z-1 flex flex-col items-center text-center phone:pt-14 desk:pt-30">
        <h1 className="leading-[0]" id={LEGAL_TITLE_ID}>
          <span className="sr-only">{title}</span>
          <span className="flex flex-wrap items-end justify-center gap-x-[calc(64*var(--ts))]" aria-hidden="true">
            {words.map((word) => (
              <Image
                key={word.src}
                className="h-auto w-[calc(var(--iw)*var(--ts))] [filter:drop-shadow(0_3px_8px_rgba(0,0,0,.8))]"
                src={`/assets/legal/${word.src}`}
                width={word.w}
                height={word.h}
                style={{ "--iw": String(word.iw) } as CSSProperties}
                alt=""
                priority
                unoptimized
              />
            ))}
          </span>
        </h1>
        <p className="font-semi text-[calc(26*var(--k))] leading-[1.2] font-medium text-[#ddd5ca] [text-shadow:0_2px_6px_rgba(0,0,0,.9)] phone:mt-12 desk:mt-8 desk:text-[max(15px,calc(19*var(--k)))]">
          Ostatnia aktualizacja: <span className={PLACEHOLDER}>{date}</span>
        </p>
        {showSettings ? (
          <p className="mt-6">
            <button
              type="button"
              className="min-h-[44px] cursor-pointer border-0 bg-transparent px-[6px] font-cond text-[calc(24*var(--k))] leading-none font-semibold tracking-[.02em] text-gold underline underline-offset-[.2em] hover:text-gold-light desk:text-[max(16px,calc(18*var(--k)))]"
              data-cookie-settings
            >
              Zmień ustawienia cookies
            </button>
          </p>
        ) : null}
      </header>

      <div className="relative z-1 phone:mx-22 phone:mt-30 phone:flex phone:flex-col phone:gap-14 desk:mt-28 desk:grid desk:grid-cols-[calc(300*var(--k))_minmax(0,1fr)] desk:items-start desk:gap-22">
        <LegalToc items={toc} />
        <div className="flex flex-col phone:gap-14 desk:gap-12">
          {sections.map((section) => {
            const layout = layoutOf(section);
            return (
              <section key={section.id} className={SECTION} id={section.id} aria-labelledby={section.headingId}>
                <span className={`${SECTION_NUMBER} ${SECTION_NUMBER_ROW[layout]}`} aria-hidden="true">
                  {section.n}
                </span>
                <h2 className={SECTION_HEADING} id={section.headingId}>
                  <span className="sr-only">{section.n}. </span>
                  {section.heading}
                </h2>
                <div className={SECTION_BODY[layout]} dangerouslySetInnerHTML={{ __html: section.body }} />
                {section.consentControls ? <CookieConsentControls className={CONSENT_CONTROLS} /> : null}
              </section>
            );
          })}
        </div>
      </div>

      <BackToTop />
    </SiteShell>
  );
}
