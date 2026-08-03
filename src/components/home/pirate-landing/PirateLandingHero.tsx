import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const LANDING_HERO_BG = '/images/hero-bg.jpg';
const LANDING_LOGO = '/images/pirate-logo.png';

const heroCtaButtonClassName =
  'rounded-md bg-primary px-8 py-3 font-display text-sm font-bold uppercase tracking-widest text-primary-foreground transition-all hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background';

type PirateLandingHeroProps = {
  isAuthenticated: boolean;
};

export function PirateLandingHero({ isAuthenticated }: PirateLandingHeroProps) {
  const { t } = useTranslation();

  const playHref = '/zagraj';
  const playLabel = isAuthenticated ? t('landing.ctaPlayAuthenticated') : t('landing.ctaPlayNow');

  return (
    <section
      className="relative flex min-h-[90vh] w-full items-center justify-center overflow-hidden px-4"
      aria-labelledby="pirate-hero-title"
    >
      <img
        src={LANDING_HERO_BG}
        alt={t('landing.heroBgAlt')}
        width={1920}
        height={1080}
        fetchPriority="high"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-background/60" aria-hidden />

      <div className="relative z-10 flex max-w-2xl flex-col items-center gap-6 text-center">
        <img
          src={LANDING_LOGO}
          alt=""
          width={120}
          height={120}
          decoding="async"
          className="h-[7.5rem] w-[7.5rem] object-contain motion-safe:animate-float"
        />

        <h1
          id="pirate-hero-title"
          className="font-display text-5xl font-black tracking-wider text-primary md:text-7xl"
        >
          {t('gameTitle')}
        </h1>

        <p className="max-w-lg text-lg text-foreground/80">{t('auth.heroTagline')}</p>

        <div className="flex flex-col gap-4 sm:flex-row sm:gap-4">
          <Link to={playHref} className={heroCtaButtonClassName}>
            {playLabel}
          </Link>
          <Link to="/o-grze" className={heroCtaButtonClassName}>
            {t('landing.ctaLearnMore')}
          </Link>
        </div>
      </div>
    </section>
  );
}
