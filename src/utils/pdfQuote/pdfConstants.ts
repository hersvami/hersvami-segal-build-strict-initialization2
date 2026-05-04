export const BLUE = [29, 78, 216] as const;
export const INK = [15, 23, 42] as const;
export const MUTED = [71, 85, 105] as const;
export const LINE = [203, 213, 225] as const;

export const PDF_MARGIN = 14;

export function formatMoney(value: number): string {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value || 0);
}

export function formatDate(value: Date): string {
  return value.toLocaleDateString('en-AU');
}