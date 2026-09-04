export const productStatus = (variant: any) => {
  if (variant?.is_available) return 'available';
  if (variant?.zero_price === 'call') return 'call';
  return 'notify';
};