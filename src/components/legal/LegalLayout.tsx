import { BackToTop } from "@/components/legal/BackToTop";
import { LegalToc } from "@/components/legal/LegalToc";
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
};

type LegalLayoutProps = {
  title: string;
  words: readonly TitleWord[];
  date: string;
  showSettings?: boolean;
  toc: readonly TocItem[];
  sections: readonly Section[];
};

export function LegalLayout({
  title,
  words,
  date,
  showSettings = false,
  toc,
  sections,
}: LegalLayoutProps) {
  return (
    <SiteShell page="legal" mainClass="col legal">
      <header className="lhead">
        <h1 className="ltitle">
          <span className="visually-hidden">{title}</span>
          <span className="ltitle__art" aria-hidden="true">
            {words.map((w) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={w.src}
                className="ltitle__w"
                src={`/assets/legal/${w.src}`}
                width={w.w}
                height={w.h}
                style={{ ["--iw" as string]: String(w.iw) }}
                alt=""
              />
            ))}
          </span>
        </h1>
        <p className="lhead__date">
          Ostatnia aktualizacja: <span className="ph">{date}</span>
        </p>
        {showSettings ? (
          <p className="lhead__act">
            <button
              type="button"
              className="lhead__link"
              data-cookie-settings
            >
              Zmień ustawienia cookies
            </button>
          </p>
        ) : null}
      </header>

      <div className="lgrid">
        <LegalToc items={toc} />
        <div className="ldoc">
          {sections.map((s) => (
            <section
              key={s.id}
              className="lsec panel"
              id={s.id}
              aria-labelledby={s.headingId}
            >
              <span className="lsec__n" aria-hidden="true">
                {s.n}
              </span>
              <h2 className="lsec__h" id={s.headingId}>
                <span className="visually-hidden">{s.n}. </span>
                {s.heading}
              </h2>
              <div
                className="lsec__body"
                dangerouslySetInnerHTML={{ __html: s.body }}
              />
            </section>
          ))}
        </div>
      </div>

      <BackToTop />
    </SiteShell>
  );
}
