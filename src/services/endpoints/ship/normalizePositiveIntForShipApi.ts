export function normalizePositiveIntForShipApi(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) {
    const t = Math.trunc(value);
    return t >= 1 ? t : null;
  }
  const n = Number.parseInt(String(value), 10);
  return Number.isFinite(n) && n >= 1 ? n : null;
}
