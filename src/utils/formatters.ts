/**
 * Formats a number as Australian Currency (AUD)
 * Example: 1234.5 -> "$1,234.50"
 */
export const formatCurrency = (value: number): string => {
  if (value === undefined || value === null || isNaN(value)) {
    return '$0.00';
  }
  
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

/**
 * Formats a number with commas for readability
 * Example: 10000 -> "10,000"
 */
export const formatNumber = (value: number): string => {
  if (value === undefined || value === null || isNaN(value)) {
    return '0';
  }

  return new Intl.NumberFormat('en-AU').format(value);
};

/**
 * Formats dimensions to 2 decimal places
 */
export const formatDimension = (value: number): string => {
  if (value === undefined || value === null || isNaN(value)) {
    return '0.00';
  }
  return value.toFixed(2);
};
