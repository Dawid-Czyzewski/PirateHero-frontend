import { useTranslation } from 'react-i18next';
import { NARROW_WRAP } from '@/components/about-game/aboutGameTypes';

export function AboutGameIntro() {
  const { t } = useTranslation();

  return (
    <section className="py-8 md:py-16 lg:py-20" aria-labelledby="about-intro-heading">
      <div className={`${NARROW_WRAP} text-center`}>
        <h2
          id="about-intro-heading"
          className="mb-4 font-display text-3xl font-bold tracking-wider text-primary md:mb-6 md:text-4xl"
        >
          {t('aboutPage.introTitle')}
        </h2>
        <p className="mx-auto max-w-3xl text-lg leading-relaxed text-foreground/80">
          <strong className="text-primary">{t('gameTitle')}</strong> {t('aboutPage.introBodyRest')}
        </p>
      </div>
    </section>
  );
}
