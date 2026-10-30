import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import Button from './Button';
import { cn } from '../../utils/cn';

/**
 * ErrorState Component
 * Displays human-friendly error messages with an integrated retry action.
 */
export const ErrorState = ({
  title = 'Something went wrong',
  message = "We couldn't load this data. Please try again.",
  onRetry,
  className,
}) => {
  return (
    <div
      className={cn(
        'min-h-[220px] max-h-[280px] p-6 sm:p-8 rounded-xl bg-[#0D0F13] dark:bg-[#0D0F13] light:bg-[#FFFFFF] border border-[#20242D] dark:border-[#20242D] light:border-[#E4E7EC] flex flex-col items-center justify-center text-center space-y-3.5',
        className
      )}
    >
      <div className="w-10 h-10 rounded-full bg-[#EF4444]/10 border border-[#EF4444]/20 flex items-center justify-center text-[#EF4444]">
        <AlertTriangle className="w-5 h-5 stroke-[1.75]" />
      </div>

      <div className="space-y-1 max-w-sm">
        <h3 className="text-sm font-semibold text-[#F5F7FA] dark:text-[#F5F7FA] light:text-[#18181B]">{title}</h3>
        <p className="text-xs text-[#A1A8B3] dark:text-[#A1A8B3] light:text-[#52525B] leading-relaxed">
          {message}
        </p>
      </div>

      {onRetry && (
        <div className="pt-1">
          <Button variant="secondary" size="sm" onClick={onRetry} leftIcon={RefreshCw}>
            Try Again
          </Button>
        </div>
      )}
    </div>
  );
};

export default ErrorState;
