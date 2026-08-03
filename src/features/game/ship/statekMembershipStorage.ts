const storageKey = (userId: string) => `ffg_userHasStatek_${userId}`;

export function persistUserHasStatek(userId: string, has: boolean): void {
  try {
    localStorage.setItem(storageKey(userId), has ? '1' : '0');
  } catch {

  }
}

export function readUserHasStatek(userId: string): boolean | null {
  try {
    const v = localStorage.getItem(storageKey(userId));
    if (v === null) return null;
    return v === '1';
  } catch {
    return null;
  }
}

const lastShipStorageKey = (userId: string) => `ffg_lastShipId_${userId}`;

export function persistLastShipId(userId: string, shipId: string | number): void {
  try {
    localStorage.setItem(lastShipStorageKey(userId), String(shipId));
  } catch {

  }
}

export function readLastShipId(userId: string): string | undefined {
  try {
    const v = localStorage.getItem(lastShipStorageKey(userId));
    return v != null && v !== '' ? v : undefined;
  } catch {
    return undefined;
  }
}

export function clearLastShipId(userId: string): void {
  try {
    localStorage.removeItem(lastShipStorageKey(userId));
  } catch {
    
  }
}
