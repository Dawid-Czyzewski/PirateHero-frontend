import { useTranslation } from 'react-i18next';
import pirateLogo from '@/assets/auth/pirate-logo.png';

export function AuthMobileBrand() {
  const { t } = useTranslation();

  return (
    <div className="lg:hidden flex flex-col items-center mb-4">
      <img
        src={pirateLogo}
        alt={t('gameTitle')}
        width={80}
        height={80}
        className="w-16 h-16 sm:w-20 sm:h-20 object-contain"
      />
      <h1 className="font-display font-bold text-2xl text-gold-gradient mt-2">{t('gameTitle')}</h1>
    </div>
  );
}
