/**
 * Format a number as Indian Rupee currency.
 * Uses the Indian numbering system (e.g., ₹1,23,456.78).
 * @param {number} amount
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined || isNaN(amount)) return '₹0.00';

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Format a number without currency symbol (useful in tables).
 * @param {number} amount
 * @returns {string}
 */
export const formatNumber = (amount) => {
  if (amount === null || amount === undefined || isNaN(amount)) return '0.00';

  return new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export default formatCurrency;
