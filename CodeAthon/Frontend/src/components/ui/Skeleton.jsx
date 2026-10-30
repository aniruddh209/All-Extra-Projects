import React from 'react';
import { cn } from '../../utils/cn';

/**
 * Skeleton Component for shimmer loading state
 */
export const Skeleton = ({ className, ...props }) => {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-[#1C1C1C]',
        className
      )}
      {...props}
    />
  );
};

export default Skeleton;
