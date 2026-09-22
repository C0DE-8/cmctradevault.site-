export const money = (value, symbol = "$") => {
  const numericValue = Number(value) || 0;
  const amount = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Math.abs(numericValue));
  return `${numericValue < 0 ? "-" : ""}${symbol || "$"}${amount}`;
};
