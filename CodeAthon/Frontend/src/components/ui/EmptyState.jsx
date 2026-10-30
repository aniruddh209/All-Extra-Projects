import React from 'react';
import { Inbox, Plus } from 'lucide-react';
import Button from './Button';
import { cn } from '../../utils/cn';

/**
 * EmptyState Component
 * Displays helpful prompt when tables or data collections are empty.
 */
export const EmptyState = ({
  icon: Icon = Inbox,
  title = 'No records found',
  description = 'Get started by creating your first entry.',
  actionLabel,
  onAction,
  className,
}) => {
  return (
    <div
      className={cn(
        'min-h-[220px] max-h-[280px] p-6 sm:p-8 rounded-xl bg-[#0D0F13] dark:bg-[#0D0F13] light:bg-[#FFFFFF] border border-[#20242D] dark:border-[#20242D] light:border-[#E4E7EC] flex flex-col items-center justify-center text-center space-y-3.5',
        className
      )}
    >
      <div className="w-10 h-10 rounded-full bg-[#11141A] dark:bg-[#11141A] light:bg-[#F4F5F7] border border-[#20242D] dark:border-[#20242D] light:border-[#E4E7EC] flex items-center justify-center text-[#6F7785] dark:text-[#6F7785] light:text-[#71717A]">
        <Icon className="w-5 h-5 stroke-[1.75]" />
      </div>

      <div className="space-y-1 max-w-sm">
        <h3 className="text-sm font-semibold text-[#F5F7FA] dark:text-[#F5F7FA] light:text-[#18181B]">{title}</h3>
        <p className="text-xs text-[#A1A8B3] dark:text-[#A1A8B3] light:text-[#52525B] leading-relaxed">
          {description}
        </p>
      </div>

      {actionLabel && onAction && (
        <div className="pt-1">
          <Button variant="primary" size="sm" onClick={onAction} leftIcon={Plus}>
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
};

export default EmptyState;
