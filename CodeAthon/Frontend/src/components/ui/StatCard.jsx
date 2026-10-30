import React from 'react';
import { cn } from '../../utils/cn';

/**
 * StatCard Component for Dashboard KPI telemetry
 */
export const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  className,
}) => {
  return (
    <div
      className={cn(
        'p-5 rounded-xl bg-[#101010] dark:bg-[#101010] light:bg-white border border-[#222222] dark:border-[#222222] light:border-[#E4E4E7] hover:border-[#333333] dark:hover:border-[#333333] light:hover:border-[#D4D4D8] shadow-sm transition-all duration-150',
        'flex flex-col justify-between space-y-3',
        className
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-[#71717A] dark:text-[#71717A] light:text-[#71717A] uppercase tracking-wider">
          {title}
        </span>
        {Icon && (
          <div className="w-8 h-8 rounded-lg bg-[#161616] dark:bg-[#161616] light:bg-[#F4F4F5] border border-[#262626] dark:border-[#262626] light:border-[#E4E4E7] flex items-center justify-center text-[#6366F1]">
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div>
        <div className="text-2xl font-extrabold tracking-tight text-[#F5F5F5] dark:text-[#F5F5F5] light:text-[#18181B] font-mono">
          {value}
        </div>
        {subtitle && (
          <div className="text-xs text-[#A1A1AA] dark:text-[#A1A1AA] light:text-[#52525B] mt-1 flex items-center gap-1.5">
            {subtitle}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
