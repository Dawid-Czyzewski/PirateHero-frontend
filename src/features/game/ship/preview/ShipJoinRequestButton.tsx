import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Loader2, UserPlus, XCircle } from 'lucide-react';
import { Button } from '@/features/game/ship/ShipUi';

type Props = {
  hasPendingRequest: boolean;
  isOwner: boolean;
  isFull: boolean;
  blockedByOtherCrew?: boolean;
  onSendRequest: () => void;
  onCancelRequest: () => void;
  loading: boolean;
  error: string | null;
  success: string | null;
};

function InlineNotice({
  tone,
  children,
}: {
  tone: 'error' | 'success' | 'warning';
  children: ReactNode;
}) {
  const styles =
    tone === 'error'
      ? 'border-destructive/30 bg-destructive/5 text-destructive'
      : tone === 'success'
        ? 'border-emerald-500/25 bg-emerald-500/5 text-emerald-200/90'
        : 'border-amber-500/25 bg-amber-500/5 text-amber-100/90';

  return (
    <div
      role={tone === 'error' ? 'alert' : undefined}
      className={`max-w-lg rounded border px-2 py-1 text-left text-xs leading-snug ${styles}`}
    >
      {children}
    </div>
  );
}

export default function ShipJoinRequestButton({
  hasPendingRequest,
  isOwner,
  isFull,
  blockedByOtherCrew = false,
  onSendRequest,
  onCancelRequest,
  loading,
  error,
  success,
}: Props) {
  const { t } = useTranslation();

  const sendDisabled = loading || isOwner || isFull || blockedByOtherCrew;

  return (
    <div className="flex w-full flex-col items-start gap-2 text-left">
      {error ? <InlineNotice tone="error">{error}</InlineNotice> : null}
      {success ? <InlineNotice tone="success">{success}</InlineNotice> : null}
      {isFull && !hasPendingRequest ? <InlineNotice tone="warning">{t('statekIsFull')}</InlineNotice> : null}
      {blockedByOtherCrew && !hasPendingRequest ? (
        <p className="max-w-lg text-left text-[11px] leading-snug text-muted-foreground">
          {String(t('shipPage.joinRequestBlockedOtherCrew'))}
        </p>
      ) : null}

      {hasPendingRequest ? (
        <div className="flex flex-col items-start gap-1.5">
          <p className="max-w-lg text-left text-[11px] leading-snug text-muted-foreground">
            {String(t('shipPage.joinRequestPendingLabel'))}
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={loading}
            onClick={onCancelRequest}
            className="h-auto min-h-8 max-w-full items-start gap-1.5 whitespace-normal border-destructive/35 py-1.5 text-left text-destructive hover:bg-destructive/10 hover:text-destructive [&>svg]:mt-0.5"
          >
            {loading ? (
              <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin" aria-hidden />
            ) : (
              <XCircle className="h-3.5 w-3.5 shrink-0" aria-hidden />
            )}
            <span className="font-heading text-xs font-semibold">
              {loading ? t('cancelling') : t('cancelJoinRequest')}
            </span>
          </Button>
        </div>
      ) : (
        <Button
          type="button"
          variant="default"
          size="sm"
          disabled={sendDisabled}
          onClick={onSendRequest}
          className="h-auto min-h-8 max-w-full items-start gap-1.5 self-start whitespace-normal bg-primary py-1.5 text-left font-heading text-xs font-semibold shadow-sm shadow-primary/20 hover:opacity-[0.92] disabled:shadow-none [&>svg]:mt-0.5"
        >
          {loading ? (
            <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin" aria-hidden />
          ) : (
            <UserPlus className="h-3.5 w-3.5 shrink-0" aria-hidden />
          )}
          {loading ? t('sending') : t('sendJoinRequest')}
        </Button>
      )}
    </div>
  );
}
