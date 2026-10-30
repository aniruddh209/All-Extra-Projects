import React from 'react';
import { cn } from '../../utils/cn';

/**
 * Standard Global Page Container
 * - Desktop: width: 100%, max-width: 1440px, margin-inline: auto, padding-inline: 32px, padding-block: 28px 40px
 * - Large screens: max-width: 1440px (never stretches endlessly across 1920px)
 * - Mobile: padding-inline: 16px
 */
export const PageContainer = ({
  children,
  className = '',
  maxWidth = 'max-w-[1440px]',
  noPadding = false,
}) => {
  return (
    <div
      className={cn(
        'w-full mx-auto',
        maxWidth,
        !noPadding && 'px-4 sm:px-6 lg:px-8 pt-7 pb-10',
        className
      )}
    >
      {children}
    </div>
  );
};

export default PageContainer;
