import { useTranslation } from 'react-i18next';
import { usePageMeta } from '@/hooks/usePageMeta';
import { AboutGameHero } from '@/components/about-game/AboutGameHero';
import { AboutGameIntro } from '@/components/about-game/AboutGameIntro';
import { AboutGameFeatureShowcase } from '@/components/about-game/AboutGameFeatureShowcase';
import { AboutGameStatsBand } from '@/components/about-game/AboutGameStatsBand';
import { AboutGameMechanicsSection } from '@/components/about-game/AboutGameMechanicsSection';
import { AboutGameHowToSection } from '@/components/about-game/AboutGameHowToSection';
import { AboutGameCtaBand } from '@/components/about-game/AboutGameCtaBand';

export default function AboutGamePage() {
  const { t } = useTranslation();

  usePageMeta({
    title: t('aboutPage.seoTitle'),
    description: t('aboutPage.seoDescription'),
    openGraph: true,
  });

  return (
    <div className="w-full flex-1 overflow-x-hidden bg-background text-foreground">
      <AboutGameHero />
      <AboutGameIntro />
      <AboutGameFeatureShowcase />
      <AboutGameStatsBand />
      <AboutGameMechanicsSection />
      <AboutGameHowToSection />
      <AboutGameCtaBand />
    </div>
  );
}
