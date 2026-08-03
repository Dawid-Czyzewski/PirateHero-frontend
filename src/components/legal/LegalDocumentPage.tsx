import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { usePageMeta } from '@/hooks/usePageMeta';

type LegalSection = { h: string; p: string[] };

type LegalDocumentPageProps = {
  documentKey: 'terms' | 'privacy';
  headingId: string;
};

export default function LegalDocumentPage({ documentKey, headingId }: LegalDocumentPageProps) {
  const { t } = useTranslation();
  const root = `legal.${documentKey}` as const;

  usePageMeta({
    title: t(`${root}.seoTitle`),
    description: t(`${root}.seoDescription`),
  });

  const sections = t(`${root}.sections`, { returnObjects: true });
  const list: LegalSection[] = Array.isArray(sections) ? (sections as LegalSection[]) : [];

  return (
    <div className="flex w-full flex-1 flex-col bg-background text-foreground">
      <div className="mx-auto w-full max-w-3xl px-6 py-8 md:px-8 md:py-10 lg:max-w-4xl">
        <article
          className="rounded-2xl border border-border bg-muted/25 p-6 shadow-sm sm:p-8 md:p-10"
          aria-labelledby={headingId}
        >
          <header className="border-b border-primary/20 pb-6">
            <h1 id={headingId} className="font-display text-3xl font-bold text-gold-gradient sm:text-4xl">
              {t(`${root}.title`)}
            </h1>
            <p className="mt-3 text-xs text-muted-foreground sm:text-sm">{t(`${root}.updated`)}</p>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
              {t(`${root}.intro`)}
            </p>
          </header>

          <div className="space-y-8 pt-8">
            {list.map((section, i) => (
              <section key={`${headingId}-${i}`} aria-labelledby={`${headingId}-sec-${i}`}>
                <h2
                  id={`${headingId}-sec-${i}`}
                  className="font-display text-lg font-semibold text-foreground sm:text-xl"
                >
                  {section.h}
                </h2>
                {section.p.map((para, j) => (
                  <p
                    key={`${headingId}-${i}-p-${j}`}
                    className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base"
                  >
                    {para}
                  </p>
                ))}
              </section>
            ))}
          </div>

          <footer className="mt-10 border-t border-primary/20 pt-6">
            <p className="text-sm text-muted-foreground">
              {t(`${root}.contactLead`)}{' '}
              <Link
                to="/contact"
                className="font-medium text-primary underline-offset-2 transition-colors hover:text-primary/85 hover:underline"
              >
                {t(`${root}.contactLinkLabel`)}
              </Link>
              .
            </p>
            <nav
              className="mt-4 flex flex-wrap gap-4 text-sm font-medium"
              aria-label={t('legal.relatedNavAria')}
            >
              {documentKey === 'terms' ? (
                <Link to="/privacy" className="text-primary hover:underline">
                  {t('legal.privacy.shortTitle')}
                </Link>
              ) : (
                <Link to="/terms" className="text-primary hover:underline">
                  {t('legal.terms.shortTitle')}
                </Link>
              )}
            </nav>
          </footer>
        </article>
      </div>
    </div>
  );
}
