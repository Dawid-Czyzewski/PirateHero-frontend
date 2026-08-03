import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Anchor } from 'lucide-react';

export function AboutGameCtaBand() {
  const { t } = useTranslation();

  return (
    <section
      className="relative overflow-hidden border-t border-primary/30 bg-gradient-to-b from-primary/[0.14] via-muted/50 to-background py-10 md:py-20 lg:py-28"
      aria-labelledby="about-cta-heading"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/70 to-transparent"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-1/4 top-1/2 h-[28rem] w-[28rem] -translate-y-1/2 rounded-full bg-primary/10 blur-3xl md:h-[36rem] md:w-[36rem]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-1/4 top-1/3 h-64 w-64 rounded-full bg-amber-500/8 blur-3xl"
        aria-hidden
      />
      <div className="relative mx-auto w-full max-w-2xl px-4 text-center md:px-6">
        <div className="rounded-2xl border border-primary/35 bg-card/85 px-5 py-8 shadow-xl shadow-primary/20 ring-1 ring-primary/15 backdrop-blur-sm md:px-10 md:py-12 lg:py-14">
          <Anchor
            className="mx-auto mb-4 h-10 w-10 text-primary drop-shadow-[0_0_12px_rgba(234,179,8,0.35)] md:mb-6 md:h-12 md:w-12"
            aria-hidden
          />
          <h2
            id="about-cta-heading"
            className="mb-3 font-display text-3xl font-bold tracking-wider text-primary md:mb-4 md:text-4xl"
          >
            {t('aboutPage.ctaTitle')}
          </h2>
          <p className="mb-6 text-base leading-relaxed text-foreground/85 md:mb-8 md:text-lg">
            {t('aboutPage.ctaLead')}
          </p>
          <Link
            to="/zagraj"
            className="inline-block rounded-md bg-primary px-10 py-4 font-display text-sm font-bold tracking-widest text-primary-foreground uppercase shadow-md shadow-primary/30 transition-all hover:brightness-110 hover:shadow-lg hover:shadow-primary/40"
          >
            {t('aboutPage.ctaButton')}
          </Link>
        </div>
      </div>
    </section>
  );
}
