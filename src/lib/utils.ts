/**
 * CarbonWise - UI & Format Utilities
 */

/**
 * Combines CSS class names dynamically
 */
export function cn(...inputs: (string | undefined | null | boolean | number)[]): string {
  return inputs.filter(Boolean).join(' ');
}

/**
 * Formats a metric weight into standard, localized labels
 * (e.g. 5.123 -> "5.1 kg CO2e")
 */
export function formatCO2(kgValue: number): string {
  return `${kgValue.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })} kg CO2e`;
}

/**
 * Standard colors by category
 */
export const CATEGORY_COLORS = {
  transport: {
    bg: 'bg-emerald-50 dark:bg-emerald-950/30',
    border: 'border-emerald-200 dark:border-emerald-800',
    text: 'text-emerald-700 dark:text-emerald-300',
    accent: 'emerald',
    rawBg: '#10b981',
  },
  energy: {
    bg: 'bg-amber-50 dark:bg-amber-950/30',
    border: 'border-amber-200 dark:border-amber-800',
    text: 'text-amber-700 dark:text-amber-300',
    accent: 'amber',
    rawBg: '#f59e0b',
  },
  food: {
    bg: 'bg-pink-50 dark:bg-pink-950/30',
    border: 'border-pink-200 dark:border-pink-800',
    text: 'text-pink-700 dark:text-pink-300',
    accent: 'pink',
    rawBg: '#ec4899',
  },
  consumption: {
    bg: 'bg-indigo-50 dark:bg-indigo-950/30',
    border: 'border-indigo-200 dark:border-indigo-800',
    text: 'text-indigo-700 dark:text-indigo-300',
    accent: 'indigo',
    rawBg: '#6366f1',
  },
} as const;
