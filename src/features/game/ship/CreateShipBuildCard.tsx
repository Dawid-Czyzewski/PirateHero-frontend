import { useTranslation } from 'react-i18next';
import { CreateShipAlerts } from './CreateShipAlerts';
import { CreateShipCostBanner } from './CreateShipCostBanner';
import { CreateShipFields } from './CreateShipFields';

type Props = {
  createTitle: string;
  createDescription: string;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  canSubmit: boolean;
  actionLoading: boolean;
  onSubmit: () => void;
  errorMessage: string | null;
  successMessage: string | null;
};

export function CreateShipBuildCard({
  createTitle,
  createDescription,
  onTitleChange,
  onDescriptionChange,
  canSubmit,
  actionLoading,
  onSubmit,
  errorMessage,
  successMessage,
}: Props) {
  const { t } = useTranslation();

  return (
    <article className="relative flex flex-col overflow-hidden rounded-xl border border-border bg-card/70 shadow-sm backdrop-blur-sm">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/45 to-transparent"
        aria-hidden
      />
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-secondary/25 blur-2xl" aria-hidden />
      <div className="absolute -bottom-10 -left-10 h-28 w-28 rounded-full bg-secondary/25 blur-2xl" aria-hidden />

      <div className="relative flex flex-1 flex-col p-5 sm:p-6 md:p-8">
        <div className="mb-6 min-w-0 space-y-1">
          <h2 className="font-heading text-lg font-bold uppercase tracking-wide text-foreground sm:text-xl">
            {t('createStatek')}
          </h2>
          <p className="text-xs text-muted-foreground sm:text-sm">{t('createStatekCardLead')}</p>
        </div>

        <CreateShipCostBanner />

        <CreateShipAlerts errorMessage={errorMessage} successMessage={successMessage} />

        <CreateShipFields
          createTitle={createTitle}
          createDescription={createDescription}
          onTitleChange={onTitleChange}
          onDescriptionChange={onDescriptionChange}
          canSubmit={canSubmit}
          actionLoading={actionLoading}
          onSubmit={onSubmit}
        />
      </div>
    </article>
  );
}
