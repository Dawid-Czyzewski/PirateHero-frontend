import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { createShip } from '@/services/shipService';
import { gamePageTitleH1Class } from '@/features/game/layout/gamePageTitleClasses';
import { CREATE_SHIP_GOLD_COST } from './createShipConstants';
import type { CreateShipFormProps } from './createShipFormTypes';
import { CreateShipBuildCard } from './CreateShipBuildCard';
import { CreateShipJoinCard } from './CreateShipJoinCard';

export default function CreateShipForm({
  user,
  fetchUserData,
  onShipCreated,
  setActionLoading,
  actionLoading,
  errorMessage,
  successMessage,
  setErrorMessage,
  setSuccessMessage,
  onNavigateToRanking,
}: CreateShipFormProps) {
  const { t } = useTranslation();
  const [createTitle, setCreateTitle] = useState('');
  const [createDescription, setCreateDescription] = useState('');

  const goldOk = user != null && Number(user.gold ?? 0) >= CREATE_SHIP_GOLD_COST;
  const canSubmit = goldOk && createTitle.trim().length > 0 && !actionLoading && !!user;

  const handleCreateShip = async () => {
    if (!createTitle.trim()) {
      setErrorMessage(t('shipNameRequired'));
      setSuccessMessage(null);
      return;
    }

    const result = await createShip(createTitle, createDescription, user, fetchUserData, setActionLoading);
    if (result.success === false) {
      setErrorMessage(result.message);
      setSuccessMessage(null);
      return;
    }
    setCreateTitle('');
    setCreateDescription('');
    setErrorMessage(null);
    setSuccessMessage(t('statekCreatedSuccessfully'));
    onShipCreated?.(result.ship);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  return (
    <section
      className="w-full space-y-8 px-2 sm:px-3 md:px-4 py-6 sm:py-8"
      aria-label={t('statek')}
    >
      <h1 className={gamePageTitleH1Class}>{t('statek')}</h1>

      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 lg:grid-cols-2 lg:items-start">
        <CreateShipBuildCard
          createTitle={createTitle}
          createDescription={createDescription}
          onTitleChange={setCreateTitle}
          onDescriptionChange={setCreateDescription}
          canSubmit={canSubmit}
          actionLoading={actionLoading}
          onSubmit={handleCreateShip}
          errorMessage={errorMessage}
          successMessage={successMessage}
        />
        <CreateShipJoinCard onNavigateToRanking={onNavigateToRanking} />
      </div>
    </section>
  );
}
