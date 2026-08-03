import { useTranslation } from 'react-i18next';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';

export default function OfflineBanner() {
  const { t } = useTranslation();
  const online = useOnlineStatus();

  if (online) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="bg-amber-600 text-black text-center text-sm font-bold py-2 px-4 border-b-2 border-amber-500"
    >
      {t('offlineBanner')}
    </div>
  );
}
