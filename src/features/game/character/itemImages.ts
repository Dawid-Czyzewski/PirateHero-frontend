const itemIconModules = import.meta.glob<string>('@/assets/items/*.png', {
  eager: true,
  import: 'default',
});

const BY_KEY: Record<string, string> = {};
for (const [path, url] of Object.entries(itemIconModules)) {
  const match = path.match(/\/([^/]+)\.png$/);
  if (match?.[1]) {
    BY_KEY[match[1]] = url;
  }
}

const FALLBACK_KEY = 'helm_01';

export function resolveItemImageUrl(imageKey: string | undefined | null): string {
  if (!imageKey) {
    return BY_KEY[FALLBACK_KEY] ?? '';
  }
  return BY_KEY[imageKey] ?? BY_KEY[FALLBACK_KEY] ?? '';
}

export const ITEM_IMAGE_KEYS = Object.keys(BY_KEY).sort();
