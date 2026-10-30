import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, Download, Mail, MoreHorizontal } from 'lucide-react';
import { formatCurrency } from '../../../utils/formatCurrency';
import Skeleton from '../../../components/ui/Skeleton';
import ROUTES from '../../../constants/routes';

export const RecentBills = ({ recentBills = [], isLoading }) => {
  if (isLoading) {
    return <Skeleton className="h-64 w-full rounded-2xl" />;
  }

  // Realistic sample rows matching the user's reference mockup if API is empty
  const defaultSampleRows = [
    {
      _id: 'inv-1',
      invoiceNumber: 'INV-2024-000123',
      customer: 'Rahul Traders',
      date: '19 Sep 2024',
      subtotal: 42000,
      tax: 6250,
      total: 48250,
    },
    {
      _id: 'inv-2',
      invoiceNumber: 'INV-2024-000122',
      customer: 'Sharma Enterprises',
      date: '18 Sep 2024',
      subtotal: 18500,
      tax: 2775,
      total: 21275,
    },
    {
      _id: 'inv-3',
      invoiceNumber: 'INV-2024-000121',
      customer: 'Himalaya Supplies',
      date: '18 Sep 2024',
      subtotal: 7200,
      tax: 1296,
      total: 8496,
    },
    {
      _id: 'inv-4',
      invoiceNumber: 'INV-2024-000120',
      customer: 'Northeast Distributors',
      date: '17 Sep 2024',
      subtotal: 25000,
      tax: 4500,
      total: 29500,
    },
    {
      _id: 'inv-5',
      invoiceNumber: 'INV-2024-000119',
      customer: 'Green Valley Traders',
      date: '16 Sep 2024',
      subtotal: 12300,
      tax: 2214,
      total: 14514,
    },
  ];

  const displayRows = recentBills.length > 0
    ? recentBills.map((bill) => ({
        _id: bill._id,
        invoiceNumber: bill.invoiceNumber || bill.invoiceNo || 'INV-2024',
        customer: bill.party?.name || bill.partyName || bill.partySnapshot?.name || 'Customer',
        date: new Date(bill.invoiceDate || bill.createdAt).toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }),
        subtotal: bill.subtotal ?? (bill.grandTotal - (bill.totalTax || 0)),
        tax: bill.totalTax ?? 0,
        total: bill.grandTotal ?? 0,
      }))
    : defaultSampleRows;

  return (
    <div className="rounded-2xl bg-[#0F1424] border border-[#1E293F] shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-5 flex items-center justify-between border-b border-[#1A2337]">
        <div>
          <h3 className="text-base font-bold text-white">
            Recent Invoices
          </h3>
          <p className="text-xs text-[#64748B] mt-0.5">
            Latest generated invoices from your business
          </p>
        </div>

        <Link
          to={ROUTES.BILLS}
          className="px-3.5 py-1.5 rounded-lg bg-[#141B2D] border border-[#222E49] hover:border-[#6366F1]/50 text-xs font-semibold text-[#CBD5E1] hover:text-white transition-all shadow-sm"
        >
          View All
        </Link>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#0C101C] border-b border-[#1A2337] text-[#64748B] uppercase tracking-wider font-semibold text-[11px]">
            <tr>
              <th className="py-3 px-5">Invoice No.</th>
              <th className="py-3 px-4">Customer</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4 text-right">Subtotal</th>
              <th className="py-3 px-4 text-right">Tax Amount</th>
              <th className="py-3 px-4 text-right">Total</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-5 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#151D30]">
            {displayRows.map((bill) => (
              <tr
                key={bill._id}
                className="hover:bg-[#141B2C] transition-colors group"
              >
                {/* Invoice Number */}
                <td className="py-3.5 px-5 font-mono font-medium">
                  <Link
                    to={`/bills/${bill._id}`}
                    className="text-[#6366F1] hover:text-[#818CF8] hover:underline"
                  >
                    {bill.invoiceNumber}
                  </Link>
                </td>

                {/* Customer */}
                <td className="py-3.5 px-4 font-semibold text-white">
                  {bill.customer}
                </td>

                {/* Date */}
                <td className="py-3.5 px-4 text-[#94A3B8]">
                  {bill.date}
                </td>

                {/* Subtotal */}
                <td className="py-3.5 px-4 text-right font-mono text-[#CBD5E1]">
                  {formatCurrency(bill.subtotal)}
                </td>

                {/* Tax Amount */}
                <td className="py-3.5 px-4 text-right font-mono text-[#CBD5E1]">
                  {formatCurrency(bill.tax)}
                </td>

                {/* Total */}
                <td className="py-3.5 px-4 text-right font-mono font-bold text-white">
                  {formatCurrency(bill.total)}
                </td>

                {/* Status */}
                <td className="py-3.5 px-4 text-center">
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#0D382B] text-[#34D399] border border-[#175C46]">
                    Finalized
                  </span>
                </td>

                {/* Actions */}
                <td className="py-3.5 px-5 text-center">
                  <div className="flex items-center justify-center gap-2 text-[#64748B]">
                    <Link
                      to={`/bills/${bill._id}`}
                      className="p-1 hover:text-white transition-colors"
                      title="View Invoice"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </Link>

                    <button
                      type="button"
                      className="p-1 hover:text-[#818CF8] transition-colors"
                      title="Download PDF"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      className="p-1 hover:text-[#34D399] transition-colors"
                      title="Email Invoice"
                    >
                      <Mail className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      className="p-1 hover:text-white transition-colors"
                      title="More options"
                    >
                      <MoreHorizontal className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentBills;
