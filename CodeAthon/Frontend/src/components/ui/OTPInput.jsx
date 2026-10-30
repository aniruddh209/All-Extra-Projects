import React, { useRef, useEffect } from 'react';
import { cn } from '../../utils/cn';

/**
 * 6-Digit OTP Input
 *
 * Supports:
 * - Automatic focus to next input on digit entry
 * - Backspace jumps to previous box and clears
 * - Arrow navigation (Left/Right)
 * - Clipboard paste (extracts first 6 digits automatically)
 * - Numeric-only input restriction
 */
export const OTPInput = ({
  value = '',
  onChange,
  length = 6,
  disabled = false,
  error = false,
  className,
}) => {
  const inputsRef = useRef([]);

  // Ensure value is padded array of single characters
  const digits = value.padEnd(length, ' ').slice(0, length).split('');

  useEffect(() => {
    // Focus first empty box on mount
    if (!disabled && inputsRef.current[0]) {
      const firstEmptyIndex = digits.findIndex((d) => d === ' ');
      const focusIndex = firstEmptyIndex === -1 ? length - 1 : firstEmptyIndex;
      inputsRef.current[focusIndex]?.focus();
    }
  }, []);

  const handleChange = (e, index) => {
    const rawVal = e.target.value;
    // Take the last character typed
    const char = rawVal.replace(/\D/g, '').slice(-1);

    const newDigits = [...digits];
    newDigits[index] = char || ' ';
    const nextString = newDigits.join('').trimEnd();
    onChange(nextString);

    // If character entered, move focus forward
    if (char && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      if (!digits[index] || digits[index] === ' ') {
        // Current is already empty, jump backward and delete
        if (index > 0) {
          e.preventDefault();
          const newDigits = [...digits];
          newDigits[index - 1] = ' ';
          onChange(newDigits.join('').trimEnd());
          inputsRef.current[index - 1]?.focus();
        }
      } else {
        // Clear current digit
        const newDigits = [...digits];
        newDigits[index] = ' ';
        onChange(newDigits.join('').trimEnd());
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault();
      inputsRef.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      e.preventDefault();
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text/plain').replace(/\D/g, '').slice(0, length);
    if (pasted) {
      onChange(pasted);
      const nextFocus = Math.min(pasted.length, length - 1);
      inputsRef.current[nextFocus]?.focus();
    }
  };

  return (
    <div className={cn('flex items-center justify-center gap-2 sm:gap-3', className)}>
      {Array.from({ length }).map((_, index) => {
        const digit = digits[index] && digits[index] !== ' ' ? digits[index] : '';
        const isFilled = Boolean(digit);

        return (
          <input
            key={index}
            ref={(el) => (inputsRef.current[index] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            disabled={disabled}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onPaste={handlePaste}
            className={cn(
              'w-11 h-12 sm:w-12 sm:h-14 text-center text-lg sm:text-xl font-bold rounded-lg bg-[#0D0D0D] border transition-all duration-150',
              'text-[#F5F5F5] select-all',
              isFilled
                ? 'border-[#6366F1] bg-[#121212] shadow-[0_0_12px_rgba(99,102,241,0.15)]'
                : 'border-[#252525] focus:border-[#6366F1]',
              error && 'border-[#EF4444] text-[#EF4444]',
              'focus:outline-none focus:ring-1 focus:ring-[#6366F1]',
              'disabled:opacity-40 disabled:cursor-not-allowed'
            )}
          />
        );
      })}
    </div>
  );
};

export default OTPInput;
