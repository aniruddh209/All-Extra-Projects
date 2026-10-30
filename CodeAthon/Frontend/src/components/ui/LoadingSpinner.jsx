import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn';

export const LoadingSpinner = ({ size = 'md', className }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <Loader2
      className={cn(
        'animate-spin text-[#6366F1]',
        sizes[size] || sizes.md,
        className
      )}
    />
  );
};

export default LoadingSpinner;
