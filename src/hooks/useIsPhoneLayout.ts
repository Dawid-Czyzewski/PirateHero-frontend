import { useEffect, useState } from 'react';

export function useIsPhoneLayout(): boolean {
  const [isPhone, setIsPhone] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(max-width: 639px)').matches
  );

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 639px)');
    const sync = () => setIsPhone(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  return isPhone;
}
