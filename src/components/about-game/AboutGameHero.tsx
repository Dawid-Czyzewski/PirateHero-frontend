import { useTranslation } from 'react-i18next';
import heroBg from '@/assets/hero-bg.jpg';
import pirateLogo from '@/assets/auth/pirate-logo.png';

export function AboutGameHero() {
  const { t } = useTranslation();

  return (
    <section
      className="relative flex min-h-0 flex-col items-center justify-center overflow-hidden py-10 sm:py-14 md:min-h-[60vh] md:py-0"
      aria-labelledby="about-hero-heading"
    >
      <img
        src={heroBg}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
        width={1920}
        height={1080}
        fetchPriority="high"
      />
      <div
        className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/60 to-background"
        aria-hidden
      />
      <div className="relative z-10 flex flex-col items-center gap-4 px-4 text-center">
        <img
          src={pirateLogo}
          alt=""
          width={100}
          height={100}
          className="motion-safe:animate-float"
        />
        <h1
          id="about-hero-heading"
          className="font-display text-5xl font-black tracking-wider text-primary md:text-6xl"
        >
          {t('aboutPage.heroTitle')}
        </h1>
        <p className="max-w-2xl text-lg text-foreground/80">{t('aboutPage.heroLead')}</p>
      </div>
    </section>
  );
}
