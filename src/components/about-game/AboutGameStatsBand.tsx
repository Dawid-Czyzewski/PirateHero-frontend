import { useTranslation } from 'react-i18next';
import mapBg from '@/assets/map-bg.jpg';
import { Zap } from 'lucide-react';
import { NARROW_WRAP, type StatItem } from '@/components/about-game/aboutGameTypes';

export function AboutGameStatsBand() {
  const { t } = useTranslation();
  const stats = t('aboutPage.stats', { returnObjects: true }) as StatItem[];

  return (
    <section
      className="relative overflow-hidden py-10 md:py-20 lg:py-24"
      aria-labelledby="about-stats-heading"
    >
      <img
        src={mapBg}
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-30"
        loading="lazy"
        width={1920}
        height={800}
      />
      <div className="absolute inset-0 bg-background/70" aria-hidden />
      <div className={`${NARROW_WRAP} relative z-10 text-center`}>
        <Zap className="mx-auto mb-4 h-10 w-10 text-primary md:mb-6 md:h-12 md:w-12" aria-hidden />
        <h2
          id="about-stats-heading"
          className="mb-4 font-display text-3xl font-bold tracking-wider text-primary md:mb-6 md:text-4xl"
        >
          {t('aboutPage.statsTitle')}
        </h2>
        <p className="mx-auto mb-6 max-w-2xl text-base leading-relaxed text-foreground/80 md:mb-10 md:text-lg lg:mb-12">
          {t('aboutPage.statsLead')}
        </p>
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4 md:gap-6">
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-lg border border-border bg-card/80 p-4 backdrop-blur-sm md:p-6"
            >
              <p className="font-display text-3xl font-black text-primary">{s.label}</p>
              <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
