import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export type Currency = 'GHS' | 'USD' | 'EUR' | 'GBP';

const RATES: Record<Currency, number> = {
  GHS: 1,
  USD: 0.067,
  EUR: 0.062,
  GBP: 0.053,
};

const SYMBOLS: Record<Currency, string> = {
  GHS: 'GHS',
  USD: '$',
  EUR: '€',
  GBP: '£',
};

type CurrencyContextValue = {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  format: (amountInGhs: number) => string;
  symbol: string;
};

const CurrencyContext = createContext<CurrencyContextValue | undefined>(undefined);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('currency') : null;
    return (saved as Currency) || 'GHS';
  });

  useEffect(() => {
    localStorage.setItem('currency', currency);
  }, [currency]);

  const setCurrency = (c: Currency) => setCurrencyState(c);

  const format = (amountInGhs: number) => {
    const converted = amountInGhs * RATES[currency];
    const sym = SYMBOLS[currency];
    const rounded = currency === 'GHS' ? Math.round(converted) : Math.round(converted * 100) / 100;
    const formatted = rounded.toLocaleString(undefined, {
      minimumFractionDigits: currency === 'GHS' ? 0 : 2,
      maximumFractionDigits: currency === 'GHS' ? 0 : 2,
    });
    return currency === 'GHS' ? `GHS ${formatted}` : `${sym}${formatted}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, format, symbol: SYMBOLS[currency] }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error('useCurrency must be used within CurrencyProvider');
  return ctx;
}
