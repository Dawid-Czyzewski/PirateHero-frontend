export function gameViewFromPath(pathname: string): string {
  const parts = pathname.split('/').filter(Boolean);
  if (parts[0] !== 'game') return 'menu';
  const a = parts[1];
  if (a === 'user' && parts[2]) return 'userPreview';
  if (a === 'ship' && parts[2]) return 'shipPreview';
  return a || 'menu';
}
