import { Bird } from 'lucide-react';
import { useTranslation } from 'react-i18next';

type Props = {
  equippedCompanionCode: string | null | undefined;
};

export function CompanionShoulderBadge({ equippedCompanionCode }: Props) {
  const { t } = useTranslation();

  if (!equippedCompanionCode) return null;

  return (
    <div
      className="pointer-events-none absolute right-0 top-0 z-10 flex h-7 w-7 translate-x-1/4 -translate-y-1/4 items-center justify-center rounded-full border border-primary/40 bg-[hsl(220,25%,12%)] text-primary shadow-md sm:h-8 sm:w-8"
      title={t('companionPage.equippedBadge')}
      aria-label={t('companionPage.equippedBadge')}
    >
      <Bird className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden />
    </div>
  );
}
