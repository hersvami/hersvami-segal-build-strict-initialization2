export function getTradeCategoryId(trade: string): string {
  return `trade${trade.replace(/[^a-zA-Z0-9]+/g, ' ').trim().split(' ').map(capitalise).join('')}`;
}

function capitalise(value: string): string {
  if (!value) return '';
  return value.charAt(0).toUpperCase() + value.slice(1);
}