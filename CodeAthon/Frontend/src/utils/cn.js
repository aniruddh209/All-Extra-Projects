/**
 * Tailwind CSS class merging utility.
 * Combines class names and handles conditional classes.
 *
 * Usage:
 *   cn('px-4 py-2', isActive && 'bg-primary-500', className)
 *
 * Filters out falsy values (false, null, undefined, '').
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default cn;
