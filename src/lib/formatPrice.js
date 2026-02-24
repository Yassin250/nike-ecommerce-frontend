/**
 * Format a numeric price into a localized currency string.
 *
 * Expects the price in main currency units (e.g. 150, 139.99),
 * not in cents. Adjust the currency/locale if you need a different region.
 *
 * @param {number} price - Price in main currency units.
 * @param {string} currency - ISO currency code (default: "USD").
 * @param {string} locale - BCP 47 locale string (default: "en-US").
 * @returns {string} Formatted price string.
 */
export const formatPrice = (price, currency = "USD", locale = "en-US") => {
  if (typeof price !== "number" || Number.isNaN(price)) return "";

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(price); 
};