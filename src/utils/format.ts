export const formatPKR = (amount: number) => `PKR ${Math.round(amount).toLocaleString('en-PK')}`;

export const discountPercent = (price: number, original?: number) =>
  original && original > price ? Math.round(((original - price) / original) * 100) : 0;

export const formatDateTime = (iso: string) =>
  new Date(iso).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
