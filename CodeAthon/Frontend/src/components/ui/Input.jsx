import React from 'react';
import { AlertCircle } from 'lucide-react';
import { cn } from '../../utils/cn';

/**
 * Premium Dark Input Component
 * Features label, prefix icon, suffix action, error display, and accessible focus ring.
 */
export const Input = React.forwardRef(
  (
    {
      label,
      error,
      helperText,
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      className,
      id,
      type = 'text',
      required = false,
      disabled = false,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    const renderIcon = (icon) => {
      if (!icon) return null;
      if (React.isValidElement(icon)) return icon;
      if (typeof icon === 'function' || (typeof icon === 'object' && icon.$$typeof)) {
        const IconComponent = icon;
        return <IconComponent className="w-4 h-4" />;
      }
      return icon;
    };

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-semibold text-[#A1A8B3] dark:text-[#A1A8B3] light:text-[#52525B] uppercase tracking-wider select-none mb-1.5"
          >
            {label}
            {required && <span className="text-[#EF4444] ml-1">*</span>}
          </label>
        )}

        <div className="relative flex items-center">
          {LeftIcon && (
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6F7785] dark:text-[#6F7785] light:text-[#71717A] pointer-events-none flex items-center justify-center z-10">
              {renderIcon(LeftIcon)}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            type={type}
            disabled={disabled}
            className={cn(
              'w-full h-11 bg-[#08090C] dark:bg-[#08090C] light:bg-[#FAFAFB] border border-[#20242D] dark:border-[#20242D] light:border-[#E4E7EC] rounded-lg text-sm text-[#F5F7FA] dark:text-[#F5F7FA] light:text-[#18181B] placeholder:text-[#6F7785] dark:placeholder:text-[#6F7785] light:placeholder:text-[#71717A] transition-all duration-150',
              'focus:outline-none focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1]',
              'disabled:opacity-40 disabled:cursor-not-allowed',
              LeftIcon ? '!pl-11' : 'pl-3.5',
              RightIcon ? '!pr-11' : 'pr-3.5',
              error && 'border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444]/20',
              className
            )}
            {...props}
          />

          {RightIcon && (
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#6F7785] dark:text-[#6F7785] light:text-[#71717A] flex items-center justify-center z-10">
              {renderIcon(RightIcon)}
            </div>
          )}
        </div>

        {error && (
          <p className="flex items-center gap-1.5 text-xs text-[#EF4444] pt-0.5 animate-in fade-in duration-150">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{error}</span>
          </p>
        )}

        {!error && helperText && (
          <p className="text-xs text-[#71717A] pt-0.5">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
