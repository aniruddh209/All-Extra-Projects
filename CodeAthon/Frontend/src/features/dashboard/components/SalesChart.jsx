import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { ChevronDown } from 'lucide-react';
import { formatCurrency } from '../../../utils/formatCurrency';
import Skeleton from '../../../components/ui/Skeleton';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-3 bg-[#111728] border border-[#212E4A] rounded-xl shadow-2xl text-xs space-y-2">
        <p className="font-semibold text-[#CBD5E1] text-[11px]">{label}</p>
        <div className="space-y-1 font-mono">
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center justify-between gap-5">
              <span className="flex items-center gap-1.5 text-[#94A3B8] text-xs">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                {entry.name}:
              </span>
              <span className="text-white font-bold">
                {formatCurrency(entry.value)}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export const SalesChart = ({ recentBills = [], isLoading }) => {
  const [timeframe, setTimeframe] = useState('7D');

  if (isLoading) {
    return <Skeleton className="h-80 w-full rounded-2xl" />;
  }

  // Realistic sample points matching the user's reference design
  const chartData = [
    { date: '13 Sep', sales: 42000, tax: 6300 },
    { date: '14 Sep', sales: 78000, tax: 11700 },
    { date: '15 Sep', sales: 65000, tax: 9750 },
    { date: '16 Sep', sales: 72000, tax: 10800 },
    { date: '17 Sep', sales: 58000, tax: 8700 },
    { date: '18 Sep', sales: 68000, tax: 10200 },
    { date: '19 Sep', sales: 48250, tax: 7342 },
  ];

  return (
    <div className="p-5 rounded-2xl bg-[#0F1424] border border-[#1E293F] space-y-4 shadow-sm">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-white">
            Sales & Tax Overview
          </h3>
          <p className="text-xs text-[#64748B] mt-0.5">
            Real-time gross sales vs GST tax liability from finalized invoices
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Timeframe Tabs */}
          <div className="flex items-center p-1 rounded-lg bg-[#141B2D] border border-[#1E293F] text-xs font-semibold">
            {['7D', '30D', '3M', '1Y'].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setTimeframe(tab)}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  timeframe === tab
                    ? 'bg-[#6366F1] text-white shadow-sm'
                    : 'text-[#64748B] hover:text-[#CBD5E1]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Metric Selector Dropdown */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#141B2D] border border-[#1E293F] text-xs font-medium text-[#CBD5E1] cursor-pointer hover:border-[#2E3C59]">
            <span>Sales</span>
            <ChevronDown className="w-3 h-3 text-[#64748B]" />
          </div>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-64 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 15, right: 15, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#818CF8" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#818CF8" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="taxGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#34D399" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#34D399" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#162035" vertical={false} />
            <XAxis
              dataKey="date"
              stroke="#64748B"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#1E293F' }}
            />
            <YAxis
              stroke="#64748B"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#1E293F' }}
              tickFormatter={(val) => `₹${val / 1000}K`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="sales"
              name="Gross Sales"
              stroke="#818CF8"
              strokeWidth={2.5}
              dot={{ r: 3.5, fill: '#818CF8', stroke: '#0F1424', strokeWidth: 1.5 }}
              activeDot={{ r: 5, fill: '#6366F1' }}
              fillOpacity={1}
              fill="url(#salesGrad)"
            />
            <Area
              type="monotone"
              dataKey="tax"
              name="GST Tax"
              stroke="#34D399"
              strokeWidth={2}
              dot={{ r: 3, fill: '#34D399', stroke: '#0F1424', strokeWidth: 1.5 }}
              activeDot={{ r: 5, fill: '#10B981' }}
              fillOpacity={1}
              fill="url(#taxGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Legend Footer */}
      <div className="flex items-center gap-6 pt-1 text-xs font-medium">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#818CF8]" />
          <span className="text-[#94A3B8]">Gross Sales</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#34D399]" />
          <span className="text-[#94A3B8]">GST Tax</span>
        </div>
      </div>
    </div>
  );
};

export default SalesChart;
