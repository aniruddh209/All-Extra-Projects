import React from 'react';
import { cn } from '../../utils/cn';

/**
 * Semantic Badge Component
 * Used for status, roles, tags, and metrics
 */
export const Badge = ({
  children,
  variant = 'neutral',
  size = 'md',
  className = '',
  dot = false,
  ...props
}) => {
  const variantStyles = {
    neutral:
      'bg-[#11141A] dark:bg-[#11141A] light:bg-[#F4F5F7] text-[#A1A8B3] dark:text-[#A1A8B3] light:text-[#52525B] border-[#20242D] dark:border-[#20242D] light:border-[#E4E7EC]',
    primary:
      'bg-[#6366F1]/10 text-[#818CF8] dark:text-[#818CF8] light:text-[#6366F1] border-[#6366F1]/20',
    success:
      'bg-[#22C55E]/10 text-[#22C55E] dark:text-[#22C55E] light:text-[#16A34A] border-[#22C55E]/20',
    warning:
      'bg-[#F59E0B]/10 text-[#F59E0B] dark:text-[#F59E0B] light:text-[#D97706] border-[#F59E0B]/20',
    danger:
      'bg-[#EF4444]/10 text-[#EF4444] dark:text-[#EF4444] light:text-[#DC2626] border-[#EF4444]/20',
    info:
      'bg-[#3B82F6]/10 text-[#60A5FA] dark:text-[#60A5FA] light:text-[#2563EB] border-[#3B82F6]/20',
  };

  const dotColors = {
    neutral: 'bg-[#6F7785]',
    primary: 'bg-[#6366F1]',
    success: 'bg-[#22C55E]',
    warning: 'bg-[#F59E0B]',
    danger: 'bg-[#EF4444]',
    info: 'bg-[#3B82F6]',
  };

  const sizeStyles = {
    sm: 'text-[10px] px-2 py-0.5 rounded',
    md: 'text-xs px-2.5 py-0.5 rounded-full',
    lg: 'text-xs px-3 py-1 rounded-full font-medium',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-medium border select-none',
        variantStyles[variant] || variantStyles.neutral,
        sizeStyles[size] || sizeStyles.md,
        className
      )}
      {...props}
    >
      {dot && <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', dotColors[variant] || dotColors.neutral)} />}
      {children}
    </span>
  );
};

export default Badge;
