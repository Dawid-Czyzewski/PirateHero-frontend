import { useTranslation } from 'react-i18next';
import { usePageMeta } from '@/hooks/usePageMeta';
import { useAuth } from '@/hooks/useAuth';
import { PirateLandingHero } from '@/components/home/pirate-landing/PirateLandingHero';

export default function HomePage() {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();

  usePageMeta({
    title: t('landing.seoTitle'),
    description: t('landing.seoDescription'),
    openGraph: true,
  });

  return (
    <div className="w-full flex-1 overflow-x-hidden bg-background">
      <PirateLandingHero isAuthenticated={isAuthenticated} />
    </div>
  );
}
