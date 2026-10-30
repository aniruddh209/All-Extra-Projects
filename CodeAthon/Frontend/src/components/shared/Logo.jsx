import React from 'react';
import { Link } from 'react-router-dom';
import { FileText } from 'lucide-react';
import { cn } from '../../utils/cn';

/**
 * Premium Brand Logo Component
 * Displays the refined icon badge with crisp geometric typography.
 */
export const Logo = ({ className, showText = true, to = '/' }) => {
  const content = (
    <div className={cn('inline-flex items-center gap-2.5 select-none group', className)}>
      {/* Icon Badge */}
      <div className="w-8 h-8 rounded-md bg-[#6366F1] flex items-center justify-center text-white shadow-[0_2px_8px_rgba(99,102,241,0.35)] border border-[#818CF8]/30 group-hover:bg-[#4F46E5] transition-colors">
        <FileText className="w-4 h-4 text-white stroke-[2.2]" />
      </div>

      {/* Brand Typography */}
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-sm tracking-tight text-[#F5F5F5]">
              GST<span className="text-[#6366F1]">Billing</span>
            </span>
            <span className="text-[9px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded bg-[#1A1A1A] text-[#A1A1AA] border border-[#252525]">
              Pro
            </span>
          </div>
          <span className="text-[10px] text-[#71717A] tracking-tight -mt-0.5">
            Enterprise Invoicing
          </span>
        </div>
      )}
    </div>
  );

  if (to) {
    return (
      <Link to={to} className="inline-block focus-visible:outline-none">
        {content}
      </Link>
    );
  }

  return content;
};

export default Logo;
