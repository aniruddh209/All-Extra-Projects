import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { MoreVertical, Info, ArrowRight } from 'lucide-react';
import { formatCurrency } from '../../../utils/formatCurrency';

export const TaxBreakdownChart = () => {
  const taxData = [
    { name: 'CGST', value: 17413, percent: '33%', color: '#6366F1' },
    { name: 'SGST', value: 17413, percent: '33%', color: '#10B981' },
    { name: 'IGST', value: 17414, percent: '34%', color: '#F97316' },
  ];

  const totalTax = 52240;

  return (
    <div className="p-5 rounded-2xl bg-[#0F1424] border border-[#1E293F] space-y-4 shadow-sm flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-white">
          Tax Breakdown (This Month)
        </h3>
        <button type="button" className="p-1 text-[#64748B] hover:text-white transition-colors">
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>

      {/* Donut Chart with Centered Total + Legend */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Donut Circle */}
        <div className="relative w-44 h-44 shrink-0 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={taxData}
                cx="50%"
                cy="50%"
                innerRadius={52}
                outerRadius={72}
                paddingAngle={4}
                dataKey="value"
                strokeWidth={0}
              >
                {taxData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Centered Numbers */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
            <span className="text-xl font-extrabold text-white font-mono tracking-tight leading-tight">
              {formatCurrency(totalTax).replace('.00', '')}
            </span>
            <span className="text-[11px] text-[#64748B] font-medium leading-tight">
              Total Tax
            </span>
          </div>
        </div>

        {/* Legend List */}
        <div className="flex-1 space-y-2.5 w-full text-xs">
          {taxData.map((item) => (
            <div key={item.name} className="flex items-center justify-between text-[#94A3B8]">
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="font-semibold text-white">{item.name}</span>
              </div>
              <div className="flex items-center gap-2 font-mono">
                <span className="text-[#CBD5E1]">{formatCurrency(item.value).replace('.00', '')}</span>
                <span className="text-[11px] text-[#64748B]">{item.percent}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Info Banner */}
      <div className="p-3 rounded-xl bg-[#11182B] border border-[#1E293F] flex items-start gap-2.5 text-xs text-[#94A3B8]">
        <Info className="w-4 h-4 text-[#6366F1] shrink-0 mt-0.5" />
        <div className="flex-1 text-[11px] leading-relaxed">
          <span>GST is calculated automatically based on your business state and customer state. </span>
          <a
            href="/settings/shop"
            className="text-[#818CF8] hover:underline font-medium inline-flex items-center gap-0.5 ml-1"
          >
            Learn More <ArrowRight className="w-2.5 h-2.5" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default TaxBreakdownChart;
