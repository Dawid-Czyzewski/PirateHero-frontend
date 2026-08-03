import { Plus, Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { EnergyRefillConfirmModal } from '@/features/game/energyRefill/EnergyRefillConfirmModal';
import { EnergyRefillDialogContent } from '@/features/game/energyRefill/EnergyRefillDialogContent';
import { EnergyRefillSuccessModal } from '@/features/game/energyRefill/EnergyRefillSuccessModal';
import { useEnergyRefill } from '@/features/game/energyRefill/useEnergyRefill';

export default function EnergyRefillButton() {
  const { t } = useTranslation();
  const {
    refillInfo,
    confirmOpen,
    successOpen,
    error,
    openConfirm,
    closeConfirm,
    closeSuccess,
    executeRefill,
    canRefill,
    userGold,
    maxEnergy,
    currentEnergy,
    plusButtonDisabled,
    plusTooltipLabel,
  } = useEnergyRefill();

  const confirmDisabled =
    !refillInfo ||
    !canRefill ||
    (refillInfo != null && userGold < refillInfo.nextRefillCost) ||
    Boolean(refillInfo?.hasActiveMission);

  const confirmLabel =
    refillInfo != null
      ? `${t('refill')} (${refillInfo.nextRefillCost} ${t('gold')})`
      : t('energyRefillInfoLoading');

  return (
    <>
      <div className="mb-4 flex items-center gap-2 rounded-full border border-white/[0.12] bg-[hsl(220_18%_12%)] px-3 py-1.5">
        <Zap className="h-4 w-4 shrink-0 text-amber-400" strokeWidth={2} aria-hidden />
        <span className="font-heading text-sm font-bold tabular-nums text-white">
          {currentEnergy}/{maxEnergy}
        </span>
        <span className="text-xs text-white/50">{t('energy')}</span>
        <button
          type="button"
          onClick={() => {
            if (!plusButtonDisabled) openConfirm();
          }}
          disabled={plusButtonDisabled}
          title={plusTooltipLabel}
          aria-label={plusTooltipLabel}
          className={`ml-1 flex items-center gap-1 rounded-md px-2 py-1 font-heading text-[10px] font-bold uppercase tracking-wide transition ${
            !plusButtonDisabled
              ? 'cursor-pointer bg-[hsl(45,88%,48%)] text-black hover:brightness-105'
              : 'cursor-not-allowed bg-white/10 text-white/40'
          }`}
        >
          <Plus className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden />
          {t('refill')}
        </button>
      </div>

      <EnergyRefillConfirmModal
        isOpen={confirmOpen}
        onClose={closeConfirm}
        onConfirm={() => void executeRefill()}
        title={t('refillEnergy')}
        dismissLabel={t('cancel')}
        confirmLabel={confirmLabel}
        confirmDisabled={confirmDisabled}
      >
        <EnergyRefillDialogContent refillInfo={refillInfo} error={error} userGold={userGold} t={t} />
      </EnergyRefillConfirmModal>

      <EnergyRefillSuccessModal
        isOpen={successOpen}
        onClose={closeSuccess}
        title={t('success')}
        message={t('energyRefilled')}
        closeLabel={t('close')}
      />
    </>
  );
}
