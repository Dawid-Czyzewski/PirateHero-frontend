import { Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';

type Props = {
  createTitle: string;
  createDescription: string;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  canSubmit: boolean;
  actionLoading: boolean;
  onSubmit: () => void;
};

export function CreateShipFields({
  createTitle,
  createDescription,
  onTitleChange,
  onDescriptionChange,
  canSubmit,
  actionLoading,
  onSubmit,
}: Props) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-1 flex-col space-y-4">
      <div>
        <label
          htmlFor="ship-create-name"
          className="mb-2 block text-xs font-semibold text-muted-foreground"
        >
          {t('shipName')} *
        </label>
        <input
          id="ship-create-name"
          type="text"
          value={createTitle}
          onChange={(e) => onTitleChange(e.target.value)}
          maxLength={100}
          autoComplete="off"
          className="min-h-11 w-full rounded-lg border border-border bg-muted/50 px-4 py-3 font-[family-name:var(--font-body)] text-sm normal-case text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25"
          placeholder={t('shipNamePlaceholder')}
        />
      </div>
      <div className="flex flex-1 flex-col">
        <label
          htmlFor="ship-create-desc"
          className="mb-2 block text-xs font-semibold text-muted-foreground"
        >
          {t('statekDescription')}
        </label>
        <textarea
          id="ship-create-desc"
          value={createDescription}
          onChange={(e) => onDescriptionChange(e.target.value)}
          rows={4}
          className="min-h-[7rem] w-full flex-1 resize-y rounded-lg border border-border bg-muted/50 px-4 py-3 font-[family-name:var(--font-body)] text-sm normal-case text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25"
          placeholder={t('statekDescriptionPlaceholder')}
        />
      </div>
      <button
        type="button"
        onClick={() => void onSubmit()}
        disabled={!canSubmit}
        className="mt-auto flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-primary to-amber-600 px-6 font-display text-sm font-bold uppercase tracking-wide text-primary-foreground shadow-md transition hover:from-primary/90 hover:to-amber-500 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {actionLoading ? (
          t('creatingStatek')
        ) : (
          <>
            <Sparkles className="h-4 w-4 shrink-0" aria-hidden />
            {t('create')}
          </>
        )}
      </button>
    </div>
  );
}
