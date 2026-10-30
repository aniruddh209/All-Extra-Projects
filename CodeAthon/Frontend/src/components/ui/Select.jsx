import React from 'react';
import { ChevronDown, AlertCircle } from 'lucide-react';
import { cn } from '../../utils/cn';

/**
 * Styled Dark Select Dropdown
 */
export const Select = React.forwardRef(
  (
    {
      label,
      error,
      helperText,
      options = [],
      placeholder = 'Select an option',
      leftIcon: LeftIcon,
      className,
      id,
      required = false,
      disabled = false,
      children,
      ...props
    },
    ref
  ) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

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
            htmlFor={selectId}
            className="block text-xs font-semibold text-[#CBD5E1] dark:text-[#CBD5E1] light:text-[#334155] uppercase tracking-wider select-none mb-1.5"
          >
            {label}
            {required && <span className="text-[#EF4444] ml-1">*</span>}
          </label>
        )}

        <div className="relative flex items-center">
          {LeftIcon && (
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B] dark:text-[#64748B] light:text-[#64748B] pointer-events-none flex items-center justify-center z-10">
              {renderIcon(LeftIcon)}
            </div>
          )}

          <select
            ref={ref}
            id={selectId}
            disabled={disabled}
            className={cn(
              'w-full h-11 px-3.5 pr-11 bg-[#0F121C] dark:bg-[#0F121C] light:bg-[#F8FAFC] border border-[#262B3F] dark:border-[#262B3F] light:border-[#CBD5E1] rounded-xl text-sm text-[#F8FAFC] dark:text-[#F8FAFC] light:text-[#0F172A] transition-all duration-150 appearance-none cursor-pointer',
              'focus:outline-none focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1]',
              'disabled:opacity-40 disabled:cursor-not-allowed',
              LeftIcon ? '!pl-11' : 'pl-3.5',
              error && 'border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444]/20',
              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled className="bg-[#0F121C] text-[#64748B]">
                {placeholder}
              </option>
            )}

            {options.map((opt) => {
              const value = typeof opt === 'object' ? opt.value : opt;
              const text = typeof opt === 'object' ? opt.label : opt;
              return (
                <option key={value} value={value} className="bg-[#0F121C] text-[#F8FAFC]">
                  {text}
                </option>
              );
            })}

            {children}
          </select>

          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#64748B] pointer-events-none flex items-center justify-center">
            <ChevronDown className="w-4 h-4" />
          </div>
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

Select.displayName = 'Select';
export default Select;
