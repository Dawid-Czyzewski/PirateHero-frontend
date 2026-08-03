import { useTranslation } from 'react-i18next';
import pirateLogo from '@/assets/auth/pirate-logo.png';
import heroImage from '@/assets/auth/hero-pirate.jpg';

export function AuthHeroColumn() {
  const { t } = useTranslation();

  return (
    <div className="hidden lg:flex flex-1 relative overflow-hidden items-center justify-center">
      <img
        src={heroImage}
        alt=""
        className="absolute inset-0 w-full h-full object-cover object-center"
      />
      <div className="absolute inset-0 bg-background/70 backdrop-blur-[3px]" />
      <div className="relative z-10 text-center px-12">
        <img
          src={pirateLogo}
          alt={t('gameTitle')}
          width={112}
          height={112}
          className="mx-auto mb-6 animate-float w-24 h-24 sm:w-28 sm:h-28 object-contain drop-shadow-lg"
        />
        <h1 className="text-4xl font-display font-bold text-gold-gradient mb-3">{t('gameTitle')}</h1>
        <p className="text-muted-foreground max-w-sm mx-auto text-sm leading-relaxed">
          {t('auth.heroTagline')}
        </p>
      </div>
    </div>
  );
}
