import { useTranslation } from 'react-i18next';
import { NARROW_WRAP, type StepItem } from '@/components/about-game/aboutGameTypes';

export function AboutGameHowToSection() {
  const { t } = useTranslation();
  const steps = t('aboutPage.steps', { returnObjects: true }) as StepItem[];

  return (
    <section className="border-t border-border py-10 md:py-16 lg:py-24" aria-labelledby="about-how-heading">
      <div className={NARROW_WRAP}>
        <h2
          id="about-how-heading"
          className="mb-6 text-center font-display text-3xl font-bold tracking-wider text-primary md:mb-10 md:text-4xl lg:mb-12"
        >
          {t('aboutPage.howTitle')}
        </h2>
        <div className="grid gap-6 md:grid-cols-3 md:gap-8">
          {steps.map((item) => (
            <div key={item.step} className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border-2 border-primary font-display text-2xl font-black text-primary">
                {item.step}
              </div>
              <h3 className="mb-2 font-display text-lg font-bold text-foreground">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
