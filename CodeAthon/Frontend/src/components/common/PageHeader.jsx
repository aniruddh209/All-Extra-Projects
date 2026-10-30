import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../utils/cn';

/**
 * Reusable PageHeader Component
 * Strictly implements Master Spacing & Typography:
 * - breadcrumb -> title: 8px
 * - title -> description: 4-8px
 * - header -> content: 24px (mb-6)
 * - title size: 30px (desktop), 28px (tablet), 24px (mobile)
 * - description max-width: 700px
 */
export const PageHeader = ({
  title,
  description,
  breadcrumbs,
  children,
  actions,
  className,
}) => {
  const actionSlot = actions || children;

  return (
    <div className={cn('mb-6', className)}>
      {/* 1. Breadcrumb Navigation (8px margin below) */}
      {Array.isArray(breadcrumbs) && breadcrumbs.length > 0 ? (
        <nav aria-label="Breadcrumb" className="mb-2">
          <ol className="flex items-center gap-1.5 text-xs text-[#71717A] font-medium">
            {breadcrumbs.map((crumb, idx) => (
              <li key={idx} className="flex items-center gap-1.5">
                {idx > 0 && <span className="text-[#3F3F46]">/</span>}
                {crumb.href ? (
                  <Link
                    to={crumb.href}
                    className="hover:text-[#F8FAFC] transition-colors"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-[#A1A1AA] font-semibold">
                    {crumb.label}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      ) : breadcrumbs ? (
        <div className="mb-2 text-xs text-[#71717A] font-medium">
          {breadcrumbs}
        </div>
      ) : null}

      {/* 2. Main Title Row with Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <h1 className="text-[24px] sm:text-[28px] lg:text-[30px] leading-[30px] sm:leading-[34px] lg:leading-[36px] font-bold tracking-tight text-[#F8FAFC]">
            {title}
          </h1>
          {description && (
            <p className="text-[14px] sm:text-[15px] leading-[22px] text-[#A1A1AA] max-w-[700px]">
              {description}
            </p>
          )}
        </div>

        {actionSlot && (
          <div className="flex items-center gap-3 shrink-0">
            {actionSlot}
          </div>
        )}
      </div>
    </div>
  );
};

export default PageHeader;
