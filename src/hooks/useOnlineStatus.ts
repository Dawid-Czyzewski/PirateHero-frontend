import { useSyncExternalStore } from 'react';

function subscribeOnline(cb: () => void) {
  window.addEventListener('online', cb);
  window.addEventListener('offline', cb);
  return () => {
    window.removeEventListener('online', cb);
    window.removeEventListener('offline', cb);
  };
}

function getOnlineSnapshot() {
  return navigator.onLine;
}

function getServerSnapshot() {
  return true;
}


export function useOnlineStatus(): boolean {
  return useSyncExternalStore(
    subscribeOnline,
    getOnlineSnapshot,
    getServerSnapshot
  );
}
