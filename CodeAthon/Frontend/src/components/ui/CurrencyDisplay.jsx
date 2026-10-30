import React from 'react';
import { formatCurrency } from '../../utils/formatCurrency';
import { cn } from '../../utils/cn';

/**
 * CurrencyDisplay Component
 * Displays formatted Indian Rupee (₹) amount with proper integer and decimal separation.
 */
export const CurrencyDisplay = ({ amount = 0, className, showSymbol = true }) => {
  const formatted = formatCurrency(amount);

  return (
    <span className={cn('font-mono tracking-tight font-medium text-[#F5F5F5]', className)}>
      {showSymbol ? formatted : formatted.replace('₹', '')}
    </span>
  );
};

export default CurrencyDisplay;
