const TRAILING_SLASHES = /\/+$/;

export function apiBaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_API_URL;
  if (!url) {
    throw new Error("Brak NEXT_PUBLIC_API_URL — ustaw adres API w .env.local");
  }
  return url.replace(TRAILING_SLASHES, "");
}
