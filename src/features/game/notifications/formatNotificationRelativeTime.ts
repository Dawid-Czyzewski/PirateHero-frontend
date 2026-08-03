export function formatNotificationRelativeTime(
  isoDate: string | undefined,
  locale: string,
  nowMs: number = Date.now()
): string {
  if (!isoDate) {
    return '';
  }
  const t = new Date(isoDate).getTime();
  if (!Number.isFinite(t)) {
    return '';
  }
  const diffSec = Math.round((t - nowMs) / 1000);
  const absSec = Math.abs(diffSec);
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

  if (absSec < 45) {
    return rtf.format(diffSec, 'second');
  }
  if (absSec < 3600) {
    return rtf.format(Math.round(diffSec / 60), 'minute');
  }
  if (absSec < 86400) {
    return rtf.format(Math.round(diffSec / 3600), 'hour');
  }
  if (absSec < 86400 * 7) {
    return rtf.format(Math.round(diffSec / 86400), 'day');
  }
  return rtf.format(Math.round(diffSec / (86400 * 7)), 'week');
}
