export const GAME_SERVER_STORAGE_KEY = 'server';
export const DEFAULT_GAME_SERVER_ID = 'PL1';

const SERVER_CHANGED_EVENT = 'famegame-server-changed';

export function setStoredGameServerId(id: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(GAME_SERVER_STORAGE_KEY, id);
  window.dispatchEvent(new Event(SERVER_CHANGED_EVENT));
}

export function subscribeStoredGameServerId(onChange: () => void): () => void {
  if (typeof window === 'undefined') return () => {};
  const onCustom = () => onChange();
  const onStorage = (e: StorageEvent) => {
    if (e.key === GAME_SERVER_STORAGE_KEY || e.key === null) onChange();
  };
  window.addEventListener(SERVER_CHANGED_EVENT, onCustom);
  window.addEventListener('storage', onStorage);
  return () => {
    window.removeEventListener(SERVER_CHANGED_EVENT, onCustom);
    window.removeEventListener('storage', onStorage);
  };
}

export type GameServerOption = {
  id: string;
  nameKey: string;
  flag: string;
  players: number;
};

export const GAME_SERVER_OPTIONS: GameServerOption[] = [
  { id: 'PL1', nameKey: 'settingsPage.servers.PL1', flag: '🇵🇱', players: 1243 },
];

export function getStoredGameServerId(): string {
  if (typeof window === 'undefined') {
    return '';
  }
  const raw = localStorage.getItem(GAME_SERVER_STORAGE_KEY)?.trim();
  if (!raw) {
    return DEFAULT_GAME_SERVER_ID;
  }
  return GAME_SERVER_OPTIONS.some((o) => o.id === raw) ? raw : DEFAULT_GAME_SERVER_ID;
}
