/**
 * Format a date string or Date object for display.
 * @param {string|Date} date
 * @param {object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date string
 */
export const formatDate = (date, options = {}) => {
  if (!date) return '';

  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options,
  };

  return new Intl.DateTimeFormat('en-IN', defaultOptions).format(new Date(date));
};

/**
 * Format a date with time.
 * @param {string|Date} date
 * @returns {string}
 */
export const formatDateTime = (date) => {
  return formatDate(date, {
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Format a date as DD/MM/YYYY (common Indian format).
 * @param {string|Date} date
 * @returns {string}
 */
export const formatDateShort = (date) => {
  if (!date) return '';
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

export default formatDate;
