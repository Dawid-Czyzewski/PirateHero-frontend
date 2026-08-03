import { useTranslation } from 'react-i18next';
import { Anchor, Loader2 } from 'lucide-react';
import { Button } from '@/features/game/ship/ShipUi';

type Props = {
  onJoin: () => void;
  loading: boolean;
  error: string | null;
};

export default function ShipJoinButton({ onJoin, loading, error }: Props) {
  const { t } = useTranslation();

  return (
    <div className="flex w-full flex-col items-start gap-2 text-left">
      {error ? (
        <div
          role="alert"
          className="max-w-lg rounded border border-destructive/30 bg-destructive/5 px-2 py-1 text-left text-xs leading-snug text-destructive"
        >
          {error}
        </div>
      ) : null}
      <Button
        type="button"
        size="sm"
        onClick={onJoin}
        disabled={loading}
        className="h-auto min-h-8 items-start gap-1.5 self-start whitespace-normal bg-primary py-1.5 text-left font-heading text-xs font-semibold shadow-sm shadow-primary/20 hover:opacity-[0.92] disabled:shadow-none [&>svg]:mt-0.5"
      >
        {loading ? (
          <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin" aria-hidden />
        ) : (
          <Anchor className="h-3.5 w-3.5 shrink-0" aria-hidden />
        )}
        {loading ? t('joining') : t('joinStatek')}
      </Button>
    </div>
  );
}
