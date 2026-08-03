import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

type ShopOptimisticCurrencyContextValue = {
  goldOffset: number;
  bumpGold: (delta: number) => void;
  resetGoldOffset: () => void;
};

const ShopOptimisticCurrencyContext = createContext<ShopOptimisticCurrencyContextValue | null>(null);

export function ShopOptimisticCurrencyProvider({ children }: { children: ReactNode }) {
  const [goldOffset, setGoldOffset] = useState(0);
  const bumpGold = useCallback((delta: number) => {
    setGoldOffset((o) => o + delta);
  }, []);
  const resetGoldOffset = useCallback(() => {
    setGoldOffset(0);
  }, []);
  const value = useMemo(
    () => ({ goldOffset, bumpGold, resetGoldOffset }),
    [goldOffset, bumpGold, resetGoldOffset]
  );
  return (
    <ShopOptimisticCurrencyContext.Provider value={value}>{children}</ShopOptimisticCurrencyContext.Provider>
  );
}

export function useShopOptimisticCurrency(): ShopOptimisticCurrencyContextValue {
  const ctx = useContext(ShopOptimisticCurrencyContext);
  if (!ctx) {
    return {
      goldOffset: 0,
      bumpGold: () => {},
      resetGoldOffset: () => {},
    };
  }
  return ctx;
}
