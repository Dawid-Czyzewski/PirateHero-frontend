import { useTranslation } from 'react-i18next';

export default function UserPreviewLoading() {
  const { t } = useTranslation();

  return (
    <div className="text-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
      <p className="text-yellow-400">{t('loadingProfile')}</p>
    </div>
  );
}
