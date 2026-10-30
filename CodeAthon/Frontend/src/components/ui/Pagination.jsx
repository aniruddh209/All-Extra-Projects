import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from './Button';
import { cn } from '../../utils/cn';

/**
 * Server-Side Pagination Component
 */
export const Pagination = ({
  page = 1,
  totalPages = 1,
  totalItems = 0,
  limit = 10,
  onPageChange,
  className,
}) => {
  if (totalPages <= 1 && totalItems === 0) return null;

  const start = Math.min((page - 1) * limit + 1, totalItems);
  const end = Math.min(page * limit, totalItems);

  return (
    <div
      className={cn(
        'px-4 py-3 bg-[#0A0A0A] border-t border-[#1C1C1C] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#A1A1AA]',
        className
      )}
    >
      <div>
        {totalItems > 0 ? (
          <span>
            Showing <span className="text-[#F5F5F5] font-medium">{start}</span>–
            <span className="text-[#F5F5F5] font-medium">{end}</span> of{' '}
            <span className="text-[#F5F5F5] font-medium">{totalItems}</span> records
          </span>
        ) : (
          <span>Page {page} of {totalPages}</span>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="secondary"
          size="sm"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          leftIcon={ChevronLeft}
        >
          Previous
        </Button>

        <span className="px-2 text-xs font-medium text-[#F5F5F5]">
          {page} / {Math.max(totalPages, 1)}
        </span>

        <Button
          variant="secondary"
          size="sm"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          rightIcon={ChevronRight}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default Pagination;
