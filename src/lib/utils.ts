/**
 * CarbonWise - UI & Format Utilities
 */

/**
 * Combines CSS class names dynamically
 */
export function cn(...inputs: (string | undefined | null | boolean)[]): string {
  return inputs.filter(Boolean).join(' ');
}

/**
 * Formats a metric weight into standard, localized labels
 * (e.g. 5.123 -> "5.1 kg CO2e")
 */
export function formatCO2(kgValue: number): string {
  if (isNaN(kgValue)) return '0.0 kg CO2e';
  return `${kgValue.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })} kg CO2e`;
}

