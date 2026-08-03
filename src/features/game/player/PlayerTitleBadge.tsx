import { useTranslation } from 'react-i18next';
import type { EquippedTitleDto } from '@/types/playerTitle';

type Props = {
  title?: EquippedTitleDto | null;
  className?: string;
};

export function PlayerTitleBadge({ title, className = '' }: Props) {
  const { t } = useTranslation();

  if (!title?.nameKey) {
    return null;
  }

  return (
    <span
      className={`inline-block text-xs font-semibold tracking-wide text-primary/90 ${className}`.trim()}
    >
      [{t(title.nameKey)}]
    </span>
  );
}
