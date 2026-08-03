import type { ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { RankingPagination as RankingPaginationT } from '@/types/ranking';

type RankingPaginationProps = {
  pagination: RankingPaginationT;
  onPageChange: (page: number) => void;
};

export default function RankingPagination({
  pagination,
  onPageChange,
}: RankingPaginationProps) {
  const { t } = useTranslation();

  if (!pagination || pagination.totalPages === 0) {
    return null;
  }

  const renderPageNumbers = () => {
    const pages: number[] = [];
    const maxVisible = 5;

    if (pagination.totalPages <= maxVisible) {
      for (let i = 1; i <= pagination.totalPages; i++) {
        pages.push(i);
      }
    } else if (pagination.page <= 3) {
      for (let i = 1; i <= maxVisible; i++) {
        pages.push(i);
      }
    } else if (pagination.page >= pagination.totalPages - 2) {
      for (let i = pagination.totalPages - 4; i <= pagination.totalPages; i++) {
        pages.push(i);
      }
    } else {
      for (let i = pagination.page - 2; i <= pagination.page + 2; i++) {
        pages.push(i);
      }
    }

    return pages.map((pageNum) => (
      <button
        key={pageNum}
        type="button"
        onClick={() => onPageChange(pageNum)}
        className={`cursor-pointer rounded-md px-3 py-2 text-sm font-heading font-bold transition-colors ${
          pagination.page === pageNum
            ? 'bg-primary text-primary-foreground'
            : 'border border-border text-foreground hover:bg-muted/30'
        }`}
      >
        {pageNum}
      </button>
    ));
  };

  const navBtn = (disabled: boolean, onClick: () => void, children: ReactNode) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`rounded-md border border-border px-3 py-2 transition-colors ${
        disabled
          ? 'cursor-not-allowed opacity-40'
          : 'cursor-pointer hover:bg-muted/30'
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
      {navBtn(
        pagination.page === 1,
        () => onPageChange(pagination.page - 1),
        <ChevronLeft className="h-5 w-5" aria-hidden />
      )}

      <div className="flex flex-wrap items-center justify-center gap-2">{renderPageNumbers()}</div>

      {navBtn(
        pagination.page === pagination.totalPages,
        () => onPageChange(pagination.page + 1),
        <ChevronRight className="h-5 w-5" aria-hidden />
      )}

      <span className="w-full text-center text-sm text-muted-foreground sm:ml-2 sm:w-auto">
        {t('page')} {pagination.page} {t('of')} {pagination.totalPages}
      </span>
    </div>
  );
}
