import { WorksCoinsInCircle } from '@/features/game/works/WorksCoinsInCircle';
import { ActiveWorkGoldFooter } from '@/features/game/works/ActiveWorkGoldFooter';
import { formatMissionTimeShort } from '@/features/game/missions/formatMissionTime';
import { MissionCancelButton } from '@/features/game/missions/MissionCancelButton';

type Props = {
  title: string;
  progressPercent: number;
  remainingMs: number;
  expectedGoldBase: number;
  goldGenitiveLabel: string;
  rewardCaption: string;
  workShipGoldExtra?: number;
  workBoosterGoldExtra?: number;
  onCancelPress: () => void;
  cancelLabel: string;
  cancelAriaLabel: string;
  t: (key: string) => string;
};

const CARD =
  'w-full overflow-hidden rounded-xl border border-[hsl(43,40%,26%)]/55 bg-[#0a0b0e] shadow-[0_12px_40px_rgba(0,0,0,0.45)]';

export function ActiveWorkCard({
  title,
  progressPercent,
  remainingMs,
  expectedGoldBase,
  goldGenitiveLabel,
  rewardCaption,
  workShipGoldExtra,
  workBoosterGoldExtra,
  onCancelPress,
  cancelLabel,
  cancelAriaLabel,
  t,
}: Props) {
  return (
    <div className={CARD}>
      <div className="p-4 sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 gap-4">
            <WorksCoinsInCircle />
            <div className="min-w-0 pt-0.5">
              <p className="font-heading text-[10px] font-semibold uppercase tracking-[0.28em] text-white/45">
                {t('worksPage.workInProgress')}
              </p>
              <h3 className="mt-1 font-serif text-lg font-bold uppercase leading-tight tracking-tight text-white sm:text-xl">
                {title}
              </h3>
            </div>
          </div>
          <MissionCancelButton onCancel={onCancelPress} label={cancelLabel} ariaLabel={cancelAriaLabel} />
        </div>

        <div className="mt-5">
          <div className="mb-1.5 flex items-center justify-between gap-3">
            <span className="text-xs text-white/45">{t('worksPage.workProgressLabel')}</span>
            <span className="font-heading text-sm font-bold tabular-nums text-white/90">
              {formatMissionTimeShort(remainingMs)}
            </span>
          </div>
          <div
            className="h-2 w-full overflow-hidden rounded-full bg-black/55 ring-1 ring-inset ring-white/10"
            role="progressbar"
            aria-valuenow={Math.round(progressPercent)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuetext={formatMissionTimeShort(remainingMs)}
          >
            <div
              className="h-full rounded-full bg-gradient-to-r from-[hsl(43,45%,28%)] via-[hsl(43,72%,48%)] to-[hsl(43,88%,58%)] transition-all duration-1000 ease-linear"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <ActiveWorkGoldFooter
          goldAmountBase={expectedGoldBase}
          goldGenitiveLabel={goldGenitiveLabel}
          caption={rewardCaption}
          workShipGoldExtra={workShipGoldExtra}
          workBoosterGoldExtra={workBoosterGoldExtra}
        />
      </div>
    </div>
  );
}
