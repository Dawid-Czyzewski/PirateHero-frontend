import { useTranslation } from 'react-i18next';

type Props = {
  onRetry: () => void;
};

export default function GameProfileErrorScreen({ onRetry }: Props) {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-8">
      <p className="text-red-400 mb-4 text-center">
        {t('gameProfileLoadError')}
      </p>
      <button
        type="button"
        className="px-4 py-2 bg-yellow-400 text-black font-bold rounded cursor-pointer"
        onClick={() => void onRetry()}
      >
        Retry
      </button>
    </div>
  );
}
