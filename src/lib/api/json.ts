export type JsonObject = Record<string, unknown>;

export function isObject(value: unknown): value is JsonObject {
  return typeof value === "object" && value !== null;
}

export function isCount(value: unknown): value is number {
  return Number.isInteger(value) && (value as number) >= 0;
}

export function countsOf<K extends string>(value: unknown, keys: readonly K[]): Record<K, number> | null {
  if (!isObject(value) || !keys.every((key) => isCount(value[key]))) return null;
  return Object.fromEntries(keys.map((key) => [key, value[key]])) as Record<K, number>;
}
