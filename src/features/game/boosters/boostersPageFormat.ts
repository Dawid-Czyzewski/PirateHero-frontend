import type { TFunction } from 'i18next';

export function resolveDateLocale(lang: string): string {
  if (lang.startsWith('pl')) return 'pl-PL';
  if (lang.startsWith('en')) return 'en-US';
  return lang;
}

export function formatShopBoosterDurationHours(hours: number, t: TFunction): string {
  if (hours > 0 && hours % 24 === 0) {
    const days = hours / 24;
    return t('boostersPage.durationDays', { count: days });
  }
  return t('boostersPage.durationHours', { count: hours });
}

export function formatBoosterActiveLabels(
  expiresAtMs: number,
  nowMs: number,
  dateLocale: string
): { until: string; countdown: string } | null {
  const remainingMs = expiresAtMs - nowMs;
  if (remainingMs <= 0) return null;
  const until = new Date(expiresAtMs).toLocaleString(dateLocale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
  const totalSec = Math.floor(remainingMs / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  const countdown = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return { until, countdown };
}
