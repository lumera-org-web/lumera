/**
 * Formats a numeric price into the standard Saudi Riyal (SAR) currency format
 * e.g., formatPrice(219) => "SAR 219"
 */
export function formatPrice(price: number | string | null | undefined): string {
  if (price === null || price === undefined || isNaN(Number(price))) {
    return 'SAR 0';
  }
  const numeric = typeof price === 'string' ? parseFloat(price) : price;
  return `SAR ${numeric.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
}

/**
 * Validates a Saudi phone number (+966 5X XXX XXXX or 05X XXX XXXX)
 */
export function isValidSaudiPhone(phone: string): boolean {
  const cleaned = phone.replace(/[\s-]/g, '');
  return /^((\+966)|0)?5[0-9]{8}$/.test(cleaned);
}

/**
 * Formats a Saudi phone number for clean presentation
 */
export function formatSaudiPhone(phone: string): string {
  const cleaned = phone.replace(/[\s-]/g, '');
  if (cleaned.startsWith('+966')) {
    return cleaned;
  }
  if (cleaned.startsWith('966')) {
    return `+${cleaned}`;
  }
  if (cleaned.startsWith('05')) {
    return `+966 ${cleaned.slice(1)}`;
  }
  return phone;
}
