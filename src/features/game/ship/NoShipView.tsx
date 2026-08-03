import { Coins, Search, Ship } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { gamePageTitleH1ClassCenter } from '@/features/game/layout/gamePageTitleClasses';
import { Button, Input, Textarea } from '@/features/game/ship/ShipUi';

type NoShipViewProps = {
  newName: string;
  newDesc: string;
  onNameChange: (value: string) => void;
  onDescChange: (value: string) => void;
  onCreateShip: () => Promise<void>;
  onNavigateToRanking: () => void;
  errorMessage?: string | null;
  successMessage?: string | null;
  actionLoading?: boolean;
};

export default function NoShipView({
  newName,
  newDesc,
  onNameChange,
  onDescChange,
  onCreateShip,
  onNavigateToRanking,
  errorMessage,
  successMessage,
  actionLoading,
}: NoShipViewProps) {
  const { t } = useTranslation();

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <h1 className={gamePageTitleH1ClassCenter}>{t('shipPage.title')}</h1>
      <p className="text-center text-base sm:text-lg text-muted-foreground">
        {t('shipPage.noShipDescription')}
      </p>

      {errorMessage ? (
        <p className="rounded-md border border-destructive/40 bg-destructive/10 px-4 py-2 text-center text-sm text-destructive">
          {errorMessage}
        </p>
      ) : null}
      {successMessage ? (
        <p className="rounded-md border border-green-500/40 bg-green-500/10 px-4 py-2 text-center text-sm text-green-700 dark:text-green-400">
          {successMessage}
        </p>
      ) : null}

      <div className="grid gap-8 md:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-8 sm:p-10 space-y-5 min-h-[360px]">
          <div className="flex items-center gap-2 text-primary">
            <Ship className="h-7 w-7" />
            <h2 className="font-heading text-xl font-bold text-foreground">{t('shipPage.buildShipTitle')}</h2>
          </div>
          <p className="text-base text-muted-foreground">{t('shipPage.buildShipCost')}</p>
          <Input
            placeholder={t('shipPage.shipNamePlaceholder')}
            value={newName}
            onChange={(e) => onNameChange(e.target.value)}
          />
          <Textarea
            placeholder={t('shipPage.shipDescriptionPlaceholder')}
            value={newDesc}
            onChange={(e) => onDescChange(e.target.value)}
            rows={4}
          />
          <Button
            className="w-full"
            onClick={() => void onCreateShip()}
            disabled={!newName.trim() || actionLoading}
          >
            <Coins className="h-4 w-4 mr-1" />{' '}
            {actionLoading ? t('shipPage.creatingShip') : t('shipPage.buildShipButton')}
          </Button>
        </div>

        <div className="rounded-xl border border-border bg-card p-8 sm:p-10 space-y-5 min-h-[360px] flex flex-col">
          <div className="flex items-center gap-2 text-primary">
            <Search className="h-7 w-7" />
            <h2 className="font-heading text-xl font-bold text-foreground">{t('shipPage.joinShipTitle')}</h2>
          </div>
          <p className="text-base text-muted-foreground flex-1">{t('shipPage.joinShipDescription')}</p>
          <Button variant="outline" className="w-full" onClick={onNavigateToRanking}>
            <Search className="h-4 w-4 mr-1" /> {t('shipPage.rankingButton')}
          </Button>
        </div>
      </div>
    </div>
  );
}
