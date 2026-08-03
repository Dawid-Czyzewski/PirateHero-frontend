import { ArrowDown, ArrowUp, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';

type Props = {
  sortBy: string;
  sortOrder: string;
  onSort: (column: string) => void;
};

export default function ShipsTableHeader({ sortBy, sortOrder, onSort }: Props) {
  const { t } = useTranslation();

  const sortIcon = (column: string) => {
    if (sortBy !== column) return null;
    return sortOrder === 'ASC' ? (
      <ArrowUp className="ml-1 inline h-4 w-4" />
    ) : (
      <ArrowDown className="ml-1 inline h-4 w-4" />
    );
  };

  return (
    <thead>
        <tr className="border-b border-border">
        <th className="px-4 py-3 text-left font-heading text-xs font-bold uppercase tracking-wider text-muted-foreground">
          {String(t('rankingPage.colRank'))}
        </th>
        <th
          className="cursor-pointer px-4 py-3 text-left font-heading text-xs font-bold uppercase tracking-wider text-muted-foreground select-none hover:text-foreground"
          onClick={() => onSort('title')}
        >
          {String(t('rankingPage.colShip'))}
          {sortIcon('title')}
        </th>
        <th className="px-4 py-3 text-left font-heading text-xs font-bold uppercase tracking-wider text-muted-foreground">
          {String(t('rankingPage.colCaptain'))}
        </th>
        <th
          className="cursor-pointer px-4 py-3 text-center font-heading text-xs font-bold uppercase tracking-wider text-muted-foreground select-none hover:text-foreground"
          onClick={() => onSort('memberCount')}
        >
          {String(t('rankingPage.colCrew'))}
          {sortIcon('memberCount')}
        </th>
        <th
          className="cursor-pointer px-4 py-3 text-right font-heading text-xs font-bold uppercase tracking-wider text-muted-foreground select-none hover:text-foreground"
          onClick={() => onSort('totalFamePoints')}
        >
          <span className="inline-flex items-center justify-end gap-1">
            <Star className="h-3 w-3 shrink-0" aria-hidden />
            {String(t('rankingPage.colFame'))}
            {sortIcon('totalFamePoints')}
          </span>
        </th>
      </tr>
    </thead>
  );
}
