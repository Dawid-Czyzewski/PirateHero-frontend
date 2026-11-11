export type ApiViolation = { propertyPath: string; code: string | null; message: string };

export const NOT_BLANK_CODE = "c1051bb4-d103-4f74-8988-acbcafc7fdc3";

function isViolation(value: unknown): value is ApiViolation {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.propertyPath === "string" &&
    typeof candidate.message === "string" &&
    (typeof candidate.code === "string" || candidate.code === null || candidate.code === undefined)
  );
}

export function violationsOf(body: unknown): ApiViolation[] {
  if (typeof body !== "object" || body === null) return [];
  const list = (body as { violations?: unknown }).violations;
  return Array.isArray(list) ? list.filter(isViolation) : [];
}
