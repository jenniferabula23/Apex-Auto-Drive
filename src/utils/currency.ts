export const formatCurrency = (amountInGhs: number) =>
  `GHS ${Math.round(amountInGhs).toLocaleString()}`;
