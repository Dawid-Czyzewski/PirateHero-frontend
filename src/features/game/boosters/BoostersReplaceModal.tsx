import { useTranslation } from 'react-i18next';
import type { ShopBoosterDefinition } from '@/features/game/boosters/shopBoosterCatalog';
import { shopBoosterName } from '@/features/game/boosters/shopBoosterI18n';

type Props = {
  pendingBooster: ShopBoosterDefinition;
  onConfirm: () => void;
  onCancel: () => void;
};

export function BoostersReplaceModal({ pendingBooster, onConfirm, onCancel }: Props) {
  const { t } = useTranslation();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-md rounded-xl border border-yellow-400/30 bg-gray-900 p-5 shadow-2xl">
        <h2 className="text-lg font-bold text-yellow-300">{t('boostersPage.replaceTitle')}</h2>
        <p className="mt-3 text-sm text-gray-200">
          {t('boostersPage.replaceBodyBefore')}
          <span className="font-semibold text-white">{shopBoosterName(t, pendingBooster)}</span>
          {t('boostersPage.replaceBodyAfter')}
        </p>
        <div className="mt-5 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="cursor-pointer rounded-lg bg-gray-700 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-600"
          >
            {t('boostersPage.cancel')}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="cursor-pointer rounded-lg bg-yellow-500 px-4 py-2 text-sm font-semibold text-black hover:bg-yellow-400"
          >
            {t('boostersPage.confirm')}
          </button>
        </div>
      </div>
    </div>
  );
}
