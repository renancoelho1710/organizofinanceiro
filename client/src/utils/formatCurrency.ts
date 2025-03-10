type FormatOptions = {
  locale?: string;
  currency?: string;
  notation?: 'standard' | 'scientific' | 'engineering' | 'compact';
};

/**
 * Format a number as currency (BRL by default)
 * 
 * @param value - Number value to format
 * @param options - Formatting options
 * @returns Formatted currency string
 */
export function formatCurrency(
  value: number | string | null | undefined,
  options: FormatOptions = {}
): string {
  // Default options
  const {
    locale = 'pt-BR',
    currency = 'BRL',
    notation = 'standard'
  } = options;
  
  // Handle null, undefined, or non-numeric values
  if (value === null || value === undefined || value === '') {
    return 'R$ 0,00';
  }
  
  // Convert to number if it's a string
  const numericValue = typeof value === 'string' ? parseFloat(value) : value;
  
  // Check if it's a valid number
  if (isNaN(numericValue)) {
    return 'R$ 0,00';
  }
  
  try {
    // Format with Intl.NumberFormat
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      notation,
      maximumFractionDigits: 2,
      minimumFractionDigits: 2
    }).format(numericValue);
  } catch (error) {
    // Fallback for older browsers or if Intl is not available
    const absValue = Math.abs(numericValue);
    const formatted = absValue.toFixed(2).replace('.', ',');
    return numericValue < 0 ? `-R$ ${formatted}` : `R$ ${formatted}`;
  }
}
