import { createContext, useContext, ReactNode } from 'react';

export type Currency = 'GHS';

type CurrencyContextValue = {
  currency: Currency;
  format: (amountInGhs: number) => string;
  symbol: string;
};

const CurrencyContext = createContext<CurrencyContextValue | undefined>(undefined);

const formatGhs = (amountInGhs: number) =>
  `GHS ${Math.round(amountInGhs).toLocaleString()}`;

export function CurrencyProvider({ children }: { children: ReactNode }) {
  return (
    <CurrencyContext.Provider
      value={{ currency: 'GHS', format: formatGhs, symbol: 'GHS' }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error('useCurrency must be used within CurrencyProvider');
  return ctx;
}
