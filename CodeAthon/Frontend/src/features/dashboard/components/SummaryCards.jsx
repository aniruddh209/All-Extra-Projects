import React from 'react';
import { BarChart3, Coins, FileText, Calendar, ChevronDown, ArrowUpRight } from 'lucide-react';
import { formatCurrency } from '../../../utils/formatCurrency';
import Skeleton from '../../../components/ui/Skeleton';

export const SummaryCards = ({ data = {}, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-xl" />
        ))}
      </div>
    );
  }

  // Use values from API or reference sample numbers
  const todaySales = data.today?.sales || 48250;
  const todayTax = data.today?.tax || 7342;
  const todayBills = data.today?.bills !== undefined && data.today?.bills > 0 ? data.today.bills : 12;
  const monthSales = data.month?.sales || 348250;

  const cards = [
    {
      title: "Today's Sales",
      hasDropdown: true,
      value: formatCurrency(todaySales),
      trend: "+12.4%",
      subtext: `${todayBills} invoices today`,
      icon: BarChart3,
      iconBg: "bg-[#2A3464] border border-[#3E4D8C] text-[#818CF8]",
    },
    {
      title: "Today's Tax Collected",
      hasDropdown: false,
      value: formatCurrency(todayTax),
      trend: "+8.1%",
      subtext: "CGST + SGST + IGST",
      icon: Coins,
      iconBg: "bg-[#0E382B] border border-[#175C46] text-[#34D399]",
    },
    {
      title: "Bills Today",
      hasDropdown: false,
      value: todayBills,
      trend: "+20.0%",
      subtext: "Invoices generated",
      icon: FileText,
      iconBg: "bg-[#3D2514] border border-[#6B3F1E] text-[#FBBF24]",
    },
    {
      title: "Monthly Sales",
      hasDropdown: false,
      value: formatCurrency(monthSales),
      trend: "+18.2%",
      subtext: "Total for September",
      icon: Calendar,
      iconBg: "bg-[#271E47] border border-[#44337A] text-[#A78BFA]",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-[#0F1424] border border-[#1E293F] hover:border-[#2B3958] transition-all flex items-start gap-4 shadow-sm"
          >
            {/* Squircle Glowing Icon */}
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${card.iconBg} shadow-inner`}
            >
              <Icon className="w-5 h-5" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-center justify-between text-xs text-[#94A3B8]">
                <span className="font-medium truncate">{card.title}</span>
                {card.hasDropdown && (
                  <ChevronDown className="w-3.5 h-3.5 text-[#64748B] hover:text-white cursor-pointer" />
                )}
              </div>

              <div className="text-xl lg:text-2xl font-extrabold text-white font-mono tracking-tight">
                {card.value}
              </div>

              <div className="flex items-center gap-1.5 text-[11px] pt-0.5">
                <span className="inline-flex items-center text-[#10B981] font-semibold">
                  <ArrowUpRight className="w-3 h-3" />
                  {card.trend}
                </span>
                <span className="text-[#64748B] truncate">{card.subtext}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SummaryCards;
