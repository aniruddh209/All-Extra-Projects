import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';

import SummaryCards from '../../features/dashboard/components/SummaryCards';
import SalesChart from '../../features/dashboard/components/SalesChart';
import TaxBreakdownChart from '../../features/dashboard/components/TaxBreakdownChart';
import RecentBills from '../../features/dashboard/components/RecentBills';
import dashboardService from '../../services/dashboard.service';
import { useAuth } from '../../hooks/useAuth';
import ROUTES from '../../constants/routes';

export const DashboardPage = () => {
  const { user } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ['dashboard', 'summary'],
    queryFn: dashboardService.getSummary,
    staleTime: 60 * 1000,
  });

  const summary = data?.data || data || {};
  const firstName = user?.name ? user.name.split(' ')[0] : 'Anirudh';

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* ─── Top Welcome & Primary Action Header ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
            <span>Good morning, {firstName}</span>
            <span className="text-2xl">👋</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#94A3B8]">
            Here's what's happening with your GST billing business today.
          </p>
        </div>

        <div>
          <Link to={ROUTES.CREATE_BILL}>
            <button
              type="button"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#4F46E5] hover:from-[#4F46E5] hover:to-[#4338CA] text-white font-semibold text-xs shadow-[0_4px_14px_rgba(99,102,241,0.4)] transition-all active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              <span>Create Invoice</span>
            </button>
          </Link>
        </div>
      </div>

      {/* ─── Top 4 KPI Metrics Row ─── */}
      <SummaryCards data={summary} isLoading={isLoading} />

      {/* ─── Middle Section: Sales Trend (8 cols) + Tax Donut Breakdown (4 cols) ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-8">
          <SalesChart
            recentBills={summary.recentBills || []}
            isLoading={isLoading}
          />
        </div>

        <div className="lg:col-span-4">
          <TaxBreakdownChart />
        </div>
      </div>

      {/* ─── Bottom Section: Recent Invoices Table ─── */}
      <RecentBills
        recentBills={summary.recentBills || []}
        isLoading={isLoading}
      />
    </div>
  );
};

export default DashboardPage;
