import { Coins } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function CreateShipCostBanner() {
  const { t } = useTranslation();
  return (
    <div className="mb-5 flex flex-wrap items-center gap-2 rounded-lg border border-primary/20 bg-muted/30 px-3 py-2.5">
      <Coins className="h-4 w-4 shrink-0 text-primary" aria-hidden />
      <span className="text-sm font-medium text-foreground/90">{t('createStatekCost')}</span>
    </div>
  );
}
