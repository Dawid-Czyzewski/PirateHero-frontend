import Image from "next/image";
import type { ReactNode } from "react";
import { PageFrame } from "@/components/landing/PageFrame";
import { SiteFooter } from "@/components/landing/SiteFooter";
import { SiteHeader } from "@/components/landing/SiteHeader";

export type LegalSection = {
  number: string;
  title: string;
  crown?: boolean;
  body: ReactNode;
};

export function formatDisplayDate(iso: string) {
  const [y, m, d] = iso.split("-");
  return `${d}.${m}.${y}`;
}

function CrownMark() {
  return (
    <svg
      viewBox="0 0 256 256"
      className="h-4 w-4"
      fill="currentColor"
      aria-hidden
    >
      <path d="M239.75,90.81c0,.11,0,.21-.07.32L217,195a16,16,0,0,1-15.72,13H54.71A16,16,0,0,1,39,195L16.32,91.13c0-.11-.05-.21-.07-.32A16,16,0,0,1,44,77.39l33.67,36.29,35.8-80.29a1,1,0,0,0,0-.1,16,16,0,0,1,29.06,0,1,1,0,0,0,0,.1l35.8,80.29L212,77.39a16,16,0,0,1,27.71,13.42Z" />
    </svg>
  );
}

export function PolicyCard({
  number,
  title,
  children,
  crown,
}: {
  number: string;
  title: string;
  children: ReactNode;
  crown?: boolean;
}) {
  const headingId = `legal-section-${number}`;

  return (
    <article
      className="relative flex min-h-[16rem] flex-col overflow-hidden rounded-sm border border-red-600/35 bg-[#141414]/82 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-md"
      aria-labelledby={headingId}
    >
      <span
        className="pointer-events-none absolute right-0 top-0 h-9 w-9 border-r-2 border-t-2 border-red-600"
        aria-hidden
      />
      <span
        className="pointer-events-none absolute bottom-0 left-0 h-9 w-9 border-b-2 border-l-2 border-red-600"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.04)_0%,transparent_40%,rgba(0,0,0,0.25)_100%)]"
        aria-hidden
      />

      <header className="relative z-10 flex items-start justify-between gap-3 px-5 pb-2 pt-5 sm:px-6 sm:pt-6">
        <h2
          id={headingId}
          className="text-[0.95rem] font-extrabold uppercase tracking-[0.06em] text-white sm:text-base"
        >
          <span className="text-red-600">{number}.</span> {title}
        </h2>
        {crown ? (
          <span className="mt-0.5 shrink-0 text-red-600" aria-hidden>
            <CrownMark />
          </span>
        ) : null}
      </header>

      <div
        role="region"
        aria-labelledby={headingId}
        tabIndex={0}
        className="relative z-10 max-h-[14rem] flex-1 overflow-y-auto px-5 pb-5 text-[0.82rem] leading-relaxed text-zinc-200 outline-none focus-visible:ring-2 focus-visible:ring-red-600/60 sm:max-h-[15rem] sm:px-6 sm:pb-6 [scrollbar-color:#e5e5e5_transparent] [scrollbar-width:thin]"
      >
        {children}
      </div>
    </article>
  );
}

export function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="mt-3 list-disc space-y-1.5 pl-4 text-zinc-200 marker:text-red-600">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

export function LegalDocument({
  title,
  headlineSrc,
  headlineWidth,
  headlineHeight,
  updatedAt,
  sections,
}: {
  title: string;
  headlineSrc: string;
  headlineWidth: number;
  headlineHeight: number;
  updatedAt: string;
  sections: LegalSection[];
}) {
  return (
    <>
      <div className="relative min-h-screen w-full overflow-x-clip overflow-y-clip bg-[#0a0a0a]">
        <div className="absolute inset-0 z-0" aria-hidden>
          <Image
            src="/bg-octagon.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/55 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-[#0a0a0a]/50" />
        </div>

        <div
          className="pointer-events-none absolute bottom-0 right-0 z-[5] hidden h-[min(52vh,420px)] w-[min(42vw,340px)] md:block"
          aria-hidden
        >
          <Image
            src="/images/hero-fighter-v4.png"
            alt=""
            width={605}
            height={676}
            loading="lazy"
            sizes="(max-width: 768px) 0px, 340px"
            className="h-full w-full object-contain object-bottom opacity-80 brightness-0 contrast-150"
          />
        </div>

        <SiteHeader />

        <main className="relative z-20 flex flex-col pb-16 pt-28 md:pb-20 md:pt-32">
          <PageFrame>
            <header className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
              <div className="max-w-xl">
                <h1 className="sr-only">{title}</h1>
                <Image
                  src={headlineSrc}
                  alt=""
                  width={headlineWidth}
                  height={headlineHeight}
                  priority
                  sizes="(max-width: 768px) 85vw, 28rem"
                  className="h-auto w-full max-w-[20rem] select-none drop-shadow-[0_8px_24px_rgba(0,0,0,0.55)] sm:max-w-[24rem] lg:max-w-[28rem]"
                />
              </div>
              <p className="shrink-0 text-[0.68rem] font-bold uppercase tracking-[0.14em] text-red-600 sm:pb-2 sm:text-right">
                Ostatnia aktualizacja:{" "}
                <time dateTime={updatedAt}>{formatDisplayDate(updatedAt)}</time>
              </p>
            </header>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 lg:gap-6">
              {sections.map((section) => (
                <PolicyCard
                  key={section.number}
                  number={section.number}
                  title={section.title}
                  crown={section.crown}
                >
                  {section.body}
                </PolicyCard>
              ))}
            </div>
          </PageFrame>
        </main>
      </div>
      <SiteFooter />
    </>
  );
}
