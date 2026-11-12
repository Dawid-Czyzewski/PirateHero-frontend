const AMOUNT = new Intl.NumberFormat("pl-PL");

export function formatAmount(value: number): string {
  return AMOUNT.format(value);
}
