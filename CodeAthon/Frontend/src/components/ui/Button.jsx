import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn';

/**
 * Ultra-Premium Pro Button Component matching reference design
 */
export const Button = React.forwardRef(
  (
    {
      children,
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled = false,
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-semibold select-none transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1] focus-visible:ring-offset-1 focus-visible:ring-offset-[#08090C] disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none active:scale-[0.98] cursor-pointer';

    const variants = {
      primary:
        'bg-[#6366F1] hover:bg-[#4F46E5] text-white shadow-xs border border-transparent',
      secondary:
        'bg-[#0D0F13] dark:bg-[#0D0F13] light:bg-[#FFFFFF] text-[#F5F7FA] dark:text-[#F5F7FA] light:text-[#18181B] border border-[#20242D] dark:border-[#20242D] light:border-[#E4E7EC] hover:bg-[#151922] dark:hover:bg-[#151922] light:hover:bg-[#F4F5F7] shadow-xs',
      ghost:
        'bg-transparent text-[#A1A8B3] dark:text-[#A1A8B3] light:text-[#52525B] hover:text-[#F5F7FA] dark:hover:text-[#F5F7FA] light:hover:text-[#18181B] hover:bg-[#151922] dark:hover:bg-[#151922] light:hover:bg-[#F4F5F7]',
      danger:
        'bg-[#EF4444] hover:bg-[#DC2626] text-white border border-transparent shadow-xs',
      dangerOutline:
        'bg-transparent text-[#EF4444] border border-[#EF4444]/30 hover:bg-[#EF4444]/10 hover:border-[#EF4444]/50',
      outline:
        'bg-transparent text-[#A1A8B3] dark:text-[#A1A8B3] light:text-[#52525B] border border-[#20242D] dark:border-[#20242D] light:border-[#E4E7EC] hover:bg-[#151922] dark:hover:bg-[#151922] light:hover:bg-[#F4F5F7] hover:text-[#F5F7FA] dark:hover:text-[#F5F7FA] light:hover:text-[#18181B]',
    };

    const sizes = {
      sm: 'h-8 px-3 rounded-lg text-xs gap-1.5',
      md: 'h-[42px] px-4 rounded-lg text-sm gap-2',
      lg: 'h-11 px-5 rounded-lg text-sm gap-2.5',
      icon: 'h-10 w-10 p-0 rounded-lg',
      iconSm: 'h-8 w-8 p-0 rounded-lg',
    };

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin text-current" />
        ) : LeftIcon ? (
          <LeftIcon className="w-3.5 h-3.5 shrink-0" />
        ) : null}

        {children && <span className="truncate">{children}</span>}

        {!isLoading && RightIcon && <RightIcon className="w-3.5 h-3.5 shrink-0" />}
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;
