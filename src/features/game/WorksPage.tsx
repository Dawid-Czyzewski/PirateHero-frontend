import { useTranslation } from 'react-i18next';
import { MissionErrorAlert } from '@/features/game/missions/MissionErrorAlert';
import { ActiveWorkCard } from '@/features/game/works/ActiveWorkCard';
import { AvailableWorksSection } from '@/features/game/works/AvailableWorksSection';
import { WorksPageHeader } from '@/features/game/works/WorksPageHeader';
import { useWorksPageSession } from '@/features/game/works/useWorksPageSession';
import { usePageMeta } from '@/hooks/usePageMeta';
import CancelWorkModal from '@/components/modal/CancelWorkModal';
import { WorkCompletedCard } from '@/features/game/works/WorkCompletedCard';

export default function WorksPage() {
  const { t } = useTranslation();
  const session = useWorksPageSession();

  usePageMeta({
    title: `${t('works')} | Pirate Hero`,
    description: t('worksPage.seoDescription', {
      defaultValue:
        'Wybieraj prace, zarabiaj złoto i rozwijaj kapitana - bez zużycia energii treningowej czy misyjnej.',
    }),
  });

  return (
    <div className="w-full space-y-5">
      <MissionErrorAlert
        message={session.pageError}
        onDismiss={() => session.setPageError(null)}
        closeLabel={String(t('close'))}
      />

      <WorksPageHeader t={t} />

      {session.hasActiveWork && !session.isWorkTimeComplete ? (
        <ActiveWorkCard
          title={session.activeWorkTitle}
          progressPercent={session.activeProgress.progress}
          remainingMs={session.activeProgress.remainingMs}
          expectedGoldBase={session.activeBaseGold}
          goldGenitiveLabel={String(t('goldGenitive'))}
          rewardCaption={String(t('worksPage.expectedRewardCaption'))}
          workShipGoldExtra={session.workShipGoldExtra}
          workBoosterGoldExtra={session.workBoosterGoldExtra}
          onCancelPress={() => session.setCancelModalOpen(true)}
          cancelLabel={String(t('worksPage.cancelWork'))}
          cancelAriaLabel={String(t('worksPage.cancelWorkAria'))}
          t={t}
        />
      ) : null}

      {session.hasActiveWork && session.isWorkTimeComplete ? (
        <WorkCompletedCard
          title={session.activeWorkTitle}
          expectedGoldBase={session.activeBaseGold}
          goldGenitiveLabel={String(t('goldGenitive'))}
          workShipGoldExtra={session.workShipGoldExtra}
          workBoosterGoldExtra={session.workBoosterGoldExtra}
          onClaim={() => void session.claimWorkReward()}
          t={t}
        />
      ) : null}

      {session.workRows.length > 0 || session.isLoadingNewWorks ? (
        <AvailableWorksSection
          rows={session.workRows}
          hasActiveWork={session.hasActiveWork}
          onStart={(row) => void session.startRow(row)}
          t={t}
          isLoadingNewList={session.isLoadingNewWorks}
        />
      ) : null}

      {!session.hasActiveWork && session.workRows.length === 0 && !session.isLoadingNewWorks ? (
        <p className="text-center text-sm text-white/60">{t('noWorks')}</p>
      ) : null}

      <CancelWorkModal
        isOpen={session.cancelModalOpen}
        onClose={() => session.setCancelModalOpen(false)}
        onConfirm={() => void session.confirmCancelWork()}
        title={String(t('worksPage.cancelWorkTitle'))}
        description={String(t('worksPage.cancelWorkBody'))}
        confirmLabel={String(t('worksPage.cancelWorkConfirm'))}
        dismissLabel={String(t('worksPage.cancelWorkDismiss'))}
      />

    </div>
  );
}
