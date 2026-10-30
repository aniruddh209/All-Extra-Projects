import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Plus, RefreshCw, FileText, Download, Mail, Eye, Calendar, ArrowUpDown, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

import billService from '../../services/bill.service';
import PageHeader from '../../components/ui/PageHeader';
import Button from '../../components/ui/Button';
import SearchInput from '../../components/ui/SearchInput';
import Pagination from '../../components/ui/Pagination';
import Skeleton from '../../components/ui/Skeleton';
import EmptyState from '../../components/ui/EmptyState';
import ErrorState from '../../components/ui/ErrorState';
import EmailInvoiceModal from '../../features/bills/components/EmailInvoiceModal';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';
import { usePermission } from '../../hooks/usePermission';
import { useAuth } from '../../hooks/useAuth';
import ROUTES from '../../constants/routes';

export const BillsPage = () => {
  const navigate = useNavigate();
  const { shop } = useAuth();
  const { canCreateBill, canDownloadPdf, canEmailInvoice } = usePermission();

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [emailModalBill, setEmailModalBill] = useState(null);
  const [isDownloadingId, setIsDownloadingId] = useState(null);

  const {
    data,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ['bills', { search, page, limit: 10 }],
    queryFn: () =>
      billService.getBills({
        search: search.trim() || undefined,
        page,
        limit: 10,
      }),
    keepPreviousData: true,
  });

  const bills = data?.data?.bills || data?.bills || (Array.isArray(data?.data) ? data.data : []);
  const pagination = data?.data?.pagination || data?.pagination || {
    page: 1,
    totalPages: 1,
    total: bills.length,
    limit: 10,
  };

  const handleDownloadPdf = async (e, bill) => {
    e.stopPropagation();
    try {
      setIsDownloadingId(bill._id);
      await billService.downloadPdf(bill._id, `${bill.invoiceNumber || 'invoice'}.pdf`);
      toast.success(`Downloaded ${bill.invoiceNumber}`);
    } catch (err) {
      toast.error('Failed to download invoice PDF from server');
    } finally {
      setIsDownloadingId(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <PageHeader
        title="Tax Invoices"
        description="View, manage, and download GST compliant tax invoices."
        breadcrumbs={[
          { label: 'Dashboard', href: ROUTES.DASHBOARD },
          { label: 'Invoices' },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => refetch()}
              disabled={isFetching}
              leftIcon={RefreshCw}
            >
              Refresh
            </Button>
            {canCreateBill && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate(ROUTES.CREATE_BILL)}
                leftIcon={Plus}
              >
                Create Invoice
              </Button>
            )}
          </div>
        }
      />

      {/* Filter / Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-[#0D1118] border border-[#222A38] shadow-sm">
        <div className="w-full sm:w-80">
          <SearchInput
            placeholder="Search invoice number or customer name..."
            value={search}
            onChange={(val) => {
              setSearch(val);
              setPage(1);
            }}
          />
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#111722] border border-[#222A38] text-xs text-[#94A3B8]">
          <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
          <span>Sequential numbering enforced</span>
        </div>
      </div>

      {/* Main Invoices Table */}
      <div className="rounded-xl bg-[#0D1118] border border-[#222A38] overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="p-4 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full rounded-md" />
            ))}
          </div>
        ) : isError ? (
          <div className="p-8">
            <ErrorState
              title="Unable to load invoices"
              message="An error occurred while fetching invoice records."
              onRetry={() => refetch()}
            />
          </div>
        ) : bills.length === 0 ? (
          <EmptyState
            title="No invoices generated yet"
            description="Create your first GST invoice with automated tax calculations."
            actionLabel="Create Invoice"
            onAction={() => navigate(ROUTES.CREATE_BILL)}
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0D1017] border-b border-[#1E293F] text-[#94A3B8] uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="py-3.5 px-4">Invoice #</th>
                    <th className="py-3.5 px-4">Customer</th>
                    <th className="py-3.5 px-4">Date</th>
                    <th className="py-3.5 px-4 text-right">Taxable</th>
                    <th className="py-3.5 px-4 text-right">Total Tax</th>
                    <th className="py-3.5 px-4 text-right">Grand Total</th>
                    <th className="py-3.5 px-4 text-center">Status</th>
                    <th className="py-3.5 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1A2337]">
                  {bills.map((bill) => (
                    <tr
                      key={bill._id}
                      className="hover:bg-[#111625] transition-colors group cursor-pointer"
                      onClick={() => navigate(`/bills/${bill._id}`)}
                    >
                      {/* Invoice Number */}
                      <td className="py-3.5 px-4 font-mono font-semibold text-[#F8FAFC]">
                        <div className="flex items-center gap-2">
                          <FileText className="w-3.5 h-3.5 text-[#6366F1]" />
                          <span className="hover:text-[#818CF8] transition-colors">
                            {bill.invoiceNumber}
                          </span>
                        </div>
                      </td>

                      {/* Customer */}
                      <td className="py-3.5 px-4 font-semibold text-[#F8FAFC]">
                        <span>{bill.partySnapshot?.name || bill.party?.name || bill.partyName || 'Customer'}</span>
                        {(bill.partySnapshot?.gstin || bill.party?.gstin) && (
                          <span className="block text-[10px] font-mono text-[#64748B]">
                            {bill.partySnapshot?.gstin || bill.party?.gstin}
                          </span>
                        )}
                      </td>

                      {/* Date */}
                      <td className="py-3.5 px-4 text-[#CBD5E1]">
                        {formatDate(bill.invoiceDate || bill.createdAt)}
                      </td>

                      {/* Taxable */}
                      <td className="py-3.5 px-4 text-right font-mono text-[#94A3B8]">
                        {formatCurrency(bill.subtotal ?? bill.taxableAmount ?? 0)}
                      </td>

                      {/* Total Tax */}
                      <td className="py-3.5 px-4 text-right font-mono text-[#818CF8]">
                        {formatCurrency(bill.totalTax ?? 0)}
                      </td>

                      {/* Grand Total */}
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-[#F8FAFC]">
                        {formatCurrency(bill.grandTotal ?? 0)}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 text-center">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#10B981]/15 text-[#34D399] border border-[#10B981]/30 uppercase tracking-wide">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                          Finalized
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-center">
                        <div
                          className="flex items-center justify-center gap-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Link
                            to={`/bills/${bill._id}`}
                            className="p-1.5 rounded-lg text-[#64748B] hover:text-white hover:bg-[#1E293F] transition-colors"
                            title="View Invoice Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Link>

                          {canDownloadPdf && (
                            <button
                              type="button"
                              onClick={(e) => handleDownloadPdf(e, bill)}
                              disabled={isDownloadingId === bill._id}
                              className="p-1.5 rounded-lg text-[#64748B] hover:text-[#818CF8] hover:bg-[#6366F1]/15 transition-colors"
                              title="Download PDF"
                            >
                              <Download
                                className={`w-3.5 h-3.5 ${
                                  isDownloadingId === bill._id ? 'animate-bounce' : ''
                                }`}
                              />
                            </button>
                          )}

                          {canEmailInvoice && (
                            <button
                              type="button"
                              onClick={() => setEmailModalBill(bill)}
                              className="p-1.5 rounded-lg text-[#64748B] hover:text-[#34D399] hover:bg-[#10B981]/15 transition-colors"
                              title="Email Invoice"
                            >
                              <Mail className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {bills.length > 0 && pagination.totalPages > 1 && (
              <div className="p-3 border-t border-[#1E293F]">
                <Pagination
                  currentPage={pagination.page || page}
                  totalPages={pagination.totalPages || 1}
                  totalItems={pagination.total || bills.length}
                  onPageChange={(p) => setPage(p)}
                />
              </div>
            )}
          </>
        )}
      </div>

      {/* Email Invoice Modal */}
      {emailModalBill && (
        <EmailInvoiceModal
          isOpen={Boolean(emailModalBill)}
          onClose={() => setEmailModalBill(null)}
          bill={emailModalBill}
          shopName={shop?.name}
        />
      )}
    </div>
  );
};

export default BillsPage;
