/**
 * CarbonWise - Input Sanitization Utilities
 */

/**
 * Escapes HTML characters in strings to prevent basic cross-site scripting (XSS).
 */
export function sanitizeString(input: string, maxLength: number = 200): string {
  if (!input) return '';

  // Truncate to maximum length
  let sanitized = input.slice(0, maxLength);

  // Escape HTML entities
  sanitized = sanitized
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');

  return sanitized;
}

/**
 * Validates and clamps numbers to safe operational bounds.
 */
export function clampValue(val: number, min: number, max: number): number {
  if (isNaN(val)) return min;
  return Math.min(Math.max(val, min), max);
}
