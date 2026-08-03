import { useTranslation } from 'react-i18next';
import { Sword, Shield, Crown, Users, Shirt, ScrollText } from 'lucide-react';
import { SECTION_WRAP, type MechanicItem } from '@/components/about-game/aboutGameTypes';

const MECHANIC_ICONS = [Shirt, Sword, Crown, ScrollText, Shield, Users] as const;

export function AboutGameMechanicsSection() {
  const { t } = useTranslation();
  const mechanics = t('aboutPage.mechanics', { returnObjects: true }) as MechanicItem[];

  return (
    <section className="py-10 md:py-16 lg:py-24" aria-labelledby="about-mechanics-heading">
      <div className={SECTION_WRAP}>
        <h2
          id="about-mechanics-heading"
          className="mb-6 text-center font-display text-3xl font-bold tracking-wider text-primary md:mb-12 md:text-4xl lg:mb-16"
        >
          {t('aboutPage.mechanicsTitle')}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
          {mechanics.map((f, i) => {
            const Icon = MECHANIC_ICONS[i] ?? Shirt;
            return (
              <div
                key={f.title}
                className="group rounded-lg border border-border bg-card p-5 transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 md:p-8"
              >
                <Icon
                  className="mb-4 h-10 w-10 text-primary transition-transform group-hover:scale-110"
                  aria-hidden
                />
                <h3 className="mb-2 font-display text-lg font-bold text-foreground">{f.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
