import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useUser } from '@/hooks/useUser';
import { getFightRefillInfo } from '@/services/refillService';
import { Plus } from 'lucide-react';
import { calculateCapacityWithBoosters } from './boosters/boosterUtils';
import { FightRefillModals } from '@/features/game/fights/FightRefillModals';

export default function FightRefillButton() {
  const { t } = useTranslation();
  const { user } = useUser();
  const [refillInfo, setRefillInfo] = useState<{ canRefill?: boolean; refillsRemaining?: number } | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    void (async () => {
      const result = await getFightRefillInfo();
      if (result.success === true) {
        setRefillInfo(result.data);
      }
    })();
  }, [user]);

  const capacities = calculateCapacityWithBoosters(user?.userCapacities, user?.userBoosters);
  const maxFightPoints = capacities.fightPoints;
  const currentFightPoints = user?.duelPoints || 0;
  const canRefill = refillInfo?.canRefill ?? false;
  const allRefillsUsed = refillInfo?.refillsRemaining === 0;

  return (
    <>
      <div className="flex items-center gap-2 rounded-full border border-yellow-200 bg-yellow-50 px-3 py-1">
        <span className="font-bold text-yellow-500">⚔️</span>
        <span className="font-semibold text-gray-800">
          {currentFightPoints}/{maxFightPoints}
        </span>
        <span className="ml-1 text-sm text-gray-500">{t('duelPoints')}</span>
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className={`ml-2 flex items-center gap-1 rounded px-2 py-1 text-xs font-bold transition ${
            canRefill && refillInfo && !allRefillsUsed
              ? 'cursor-pointer bg-yellow-400 text-gray-900 hover:bg-yellow-500'
              : 'cursor-not-allowed bg-gray-300 text-gray-600'
          }`}
          disabled={allRefillsUsed}
          title={
            !refillInfo
              ? t('loading')
              : allRefillsUsed
                ? t('allRefillsUsed')
                : canRefill
                  ? t('refillFightPoints')
                  : t('fightPointsFull')
          }
        >
          <Plus size={14} className="font-bold" />
          {t('refill')}
        </button>
      </div>

      <FightRefillModals open={showModal} onRequestClose={() => setShowModal(false)} />
    </>
  );
}
