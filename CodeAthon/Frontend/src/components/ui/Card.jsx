import React from 'react';
import { cn } from '../../utils/cn';

/**
 * Master Enterprise Card Component
 * - Radius: 12px (rounded-xl)
 * - Dark: bg-[#0D0F13], border-[#20242D]
 * - Light: bg-[#FFFFFF], border-[#E4E7EC]
 * - Restrained, clean shadow, no neon glow
 */
export const Card = ({
  children,
  className = '',
  padding = 'normal', // 'none', 'sm' (16px), 'normal' (20px), 'lg' (24px)
  interactive = false,
  ...props
}) => {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    normal: 'p-5',
    lg: 'p-6',
  };

  return (
    <div
      className={cn(
        'rounded-xl bg-[#0D0F13] dark:bg-[#0D0F13] light:bg-[#FFFFFF] border border-[#20242D] dark:border-[#20242D] light:border-[#E4E7EC] text-[#F5F7FA] dark:text-[#F5F7FA] light:text-[#18181B] shadow-xs transition-all duration-150',
        paddingClasses[padding] || paddingClasses.normal,
        interactive && 'hover:border-[#2B303A] dark:hover:border-[#2B303A] light:hover:border-[#D0D5DD] hover:bg-[#11141A] dark:hover:bg-[#11141A] light:hover:bg-[#FAFAFB] cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
