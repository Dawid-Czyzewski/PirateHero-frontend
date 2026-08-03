export function formatBestiaryDefeatedAt(
  value: string | null,
  locale: string,
  unknownLabel: string
): string {
  if (!value) return unknownLabel;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return unknownLabel;
  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
