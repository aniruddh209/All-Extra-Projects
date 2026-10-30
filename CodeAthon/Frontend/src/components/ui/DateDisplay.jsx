import React from 'react';
import { formatDate } from '../../utils/formatDate';
import { cn } from '../../utils/cn';

/**
 * DateDisplay Component
 * Displays standardized date strings (e.g. 19 Sep 2026).
 */
export const DateDisplay = ({ date, className, showTime = false }) => {
  if (!date) return <span className="text-[#71717A]">—</span>;

  const formatted = formatDate(date, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    ...(showTime && { hour: '2-digit', minute: '2-digit' }),
  });

  return (
    <span className={cn('text-sm text-[#A1A1AA] tabular-nums', className)}>
      {formatted}
    </span>
  );
};

export default DateDisplay;
