import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '../../utils/cn';

/**
 * SearchInput with debounce and clear functionality
 */
export const SearchInput = ({
  value: controlledValue,
  onChange,
  onDebounce,
  debounceMs = 300,
  placeholder = 'Search...',
  className,
}) => {
  const [internalValue, setInternalValue] = useState(controlledValue || '');

  useEffect(() => {
    if (controlledValue !== undefined) {
      setInternalValue(controlledValue);
    }
  }, [controlledValue]);

  useEffect(() => {
    if (!onDebounce) return;
    const handler = setTimeout(() => {
      onDebounce(internalValue);
    }, debounceMs);

    return () => clearTimeout(handler);
  }, [internalValue, onDebounce, debounceMs]);

  const handleChange = (e) => {
    const val = e.target.value;
    setInternalValue(val);
    if (onChange) onChange(val);
  };

  const handleClear = () => {
    setInternalValue('');
    if (onChange) onChange('');
    if (onDebounce) onDebounce('');
  };

  return (
    <div className={cn('relative flex items-center w-full sm:w-72', className)}>
      <div className="absolute left-3 text-[#71717A] pointer-events-none flex items-center justify-center">
        <Search className="w-4 h-4" />
      </div>

      <input
        type="text"
        value={internalValue}
        onChange={handleChange}
        placeholder={placeholder}
        className={cn(
          'w-full h-9 pl-9 pr-8 bg-[#0D0D0D] border border-[#272727] rounded-md text-xs sm:text-sm text-[#F5F5F5] placeholder:text-[#52525B]',
          'focus:outline-none focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1] transition-all'
        )}
      />

      {internalValue && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-2.5 p-0.5 rounded text-[#71717A] hover:text-[#F5F5F5] transition-colors"
          title="Clear search"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};

export default SearchInput;
