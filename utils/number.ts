export const separator = (value: number | string) => {
  return new Intl.NumberFormat("fa-IR").format(Number(value));
};