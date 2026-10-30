import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Download, Mail, Printer, ArrowLeft, Building2, MapPin, Phone, Hash, Calendar, CheckCircle2, FileText } from 'lucide-react';
import { toast } from 'sonner';

import billService from '../../services/bill.service';
import PageHeader from '../../components/ui/PageHeader';
import Button from '../../components/ui/Button';
import Skeleton from '../../components/ui/Skeleton';
import ErrorState from '../../components/ui/ErrorState';
import EmailInvoiceModal from '../../features/bills/components/EmailInvoiceModal';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';
import { numberToWords } from '../../utils/numberToWords';
import { usePermission } from '../../hooks/usePermission';
import ROUTES from '../../constants/routes';

export const BillDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { canDownloadPdf, canEmailInvoice } = usePermission();

  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['bill', id],
    queryFn: () => billService.getBillById(id),
    enabled: Boolean(id),
  });

  const bill = data?.data?.bill || data?.bill || data?.data;

  const handleDownload = async () => {
    if (!bill?._id) return;
    try {
      setIsDownloading(true);
      await billService.downloadPdf(bill._id, `${bill.invoiceNumber || 'invoice'}.pdf`);
      toast.success('Invoice PDF downloaded');
    } catch (err) {
      toast.error('Failed to download invoice PDF from server');
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Skeleton className="h-10 w-48 rounded-xl" />
        <Skeleton className="h-[600px] w-full rounded-2xl" />
      </div>
    );
  }

  if (isError || !bill) {
    return (
      <div className="max-w-4xl mx-auto py-12">
        <ErrorState
          title="Invoice not found"
          message="Unable to retrieve the requested tax invoice details."
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  const shop = bill.shopSnapshot || bill.shop || {};
  const party = bill.partySnapshot || bill.party || {};
  const items = bill.items || [];
  const isIntraState = bill.intraState !== undefined
    ? bill.intraState
    : (shop.state && party.state && shop.state.trim().toLowerCase() === party.state.trim().toLowerCase());

  const words = numberToWords(bill.grandTotal || 0);

  return (
    <div className="max-w-[1000px] mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(ROUTES.BILLS)}
          leftIcon={ArrowLeft}
          className="self-start"
        >
          Back to Invoices
        </Button>

        <div className="flex items-center gap-2.5 self-end sm:self-auto">
          {canDownloadPdf && (
            <Button
              variant="secondary"
              size="sm"
              onClick={handleDownload}
              isLoading={isDownloading}
              leftIcon={Download}
            >
              Download PDF
            </Button>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={handlePrint}
            leftIcon={Printer}
          >
            Print
          </Button>

          {canEmailInvoice && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsEmailModalOpen(true)}
              leftIcon={Mail}
            >
              Email Invoice
            </Button>
          )}
        </div>
      </div>

      {/* Official Tax Invoice Container (Printable) */}
      <div className="rounded-2xl bg-[#0D1017] border border-[#1E293F] p-8 space-y-8 shadow-2xl print:bg-white print:text-black print:border-none print:shadow-none print:p-0">
        {/* Document Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-b border-[#1E293F] pb-6 print:border-b-2 print:border-black">
          <div>
            <span className="text-[10px] font-bold tracking-widest text-[#818CF8] uppercase block mb-1">
              ORIGINAL FOR RECIPIENT
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#F8FAFC] print:text-black">
              TAX INVOICE
            </h1>
            <p className="text-xs text-[#94A3B8] mt-1">
              Issued under the Central Goods and Services Tax Act, 2017
            </p>
          </div>

          <div className="sm:text-right space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111726] border border-[#1E293F] print:border print:border-black">
              <span className="text-xs text-[#94A3B8]">Invoice No:</span>
              <span className="text-xs font-mono font-bold text-[#F8FAFC] print:text-black">
                {bill.invoiceNumber}
              </span>
            </div>
            <div className="text-xs text-[#94A3B8] flex items-center sm:justify-end gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#64748B]" />
              <span>Date: {formatDate(bill.invoiceDate || bill.createdAt)}</span>
            </div>
            <div className="text-[11px] text-[#34D399] font-bold flex items-center sm:justify-end gap-1">
              <CheckCircle2 className="w-3 h-3 text-[#10B981]" />
              <span>Status: Finalized</span>
            </div>
          </div>
        </div>

        {/* Parties Grid (Seller & Buyer) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-b border-[#1E293F] pb-8 print:border-b print:border-black">
          {/* Seller / Supplier Info */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#818CF8] block">
              Billed By (Supplier)
            </span>
            <h2 className="text-base font-bold text-[#F8FAFC] print:text-black">
              {shop.businessName || shop.name || 'Apex Tech Solutions'}
            </h2>
            <div className="text-xs text-[#94A3B8] space-y-1 leading-relaxed">
              {shop.address && <p>{shop.address}</p>}
              <p>State: <strong className="text-[#F8FAFC] print:text-black">{shop.state || 'Arunachal Pradesh'}</strong></p>
              {shop.gstin && (
                <p className="font-mono text-xs">
                  GSTIN: <span className="font-bold text-[#F8FAFC] print:text-black">{shop.gstin}</span>
                </p>
              )}
              {shop.phone && <p>Phone: {shop.phone}</p>}
              {shop.email && <p>Email: {shop.email}</p>}
            </div>
          </div>

          {/* Buyer / Recipient Info */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#94A3B8] block">
              Billed To (Recipient)
            </span>
            <h2 className="text-base font-bold text-[#F8FAFC] print:text-black">
              {party.name || bill.partyName || 'Customer'}
            </h2>
            <div className="text-xs text-[#94A3B8] space-y-1 leading-relaxed">
              {party.address && <p>{party.address}</p>}
              <p>State: <strong className="text-[#F8FAFC] print:text-black">{party.state || '—'}</strong></p>
              {party.gstin ? (
                <p className="font-mono text-xs">
                  GSTIN: <span className="font-bold text-[#F8FAFC] print:text-black">{party.gstin}</span>
                </p>
              ) : (
                <p className="text-[#64748B]">GSTIN: Unregistered Consumer</p>
              )}
              {party.mobile && <p>Mobile: {party.mobile}</p>}
              {party.email && <p>Email: {party.email}</p>}
            </div>
          </div>
        </div>

        {/* Itemized Goods/Services Table */}
        <div className="space-y-3">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#111726] border-b border-[#1E293F] text-[#94A3B8] uppercase tracking-wider font-semibold print:bg-gray-100 print:text-black">
                <tr>
                  <th className="py-2.5 px-3">#</th>
                  <th className="py-2.5 px-3">Item Description</th>
                  <th className="py-2.5 px-3 text-center">HSN/SAC</th>
                  <th className="py-2.5 px-3 text-center">Qty</th>
                  <th className="py-2.5 px-3 text-right">Rate</th>
                  <th className="py-2.5 px-3 text-right">Taxable</th>
                  <th className="py-2.5 px-3 text-center">GST %</th>
                  <th className="py-2.5 px-3 text-right">
                    {isIntraState ? 'CGST + SGST' : 'IGST'}
                  </th>
                  <th className="py-2.5 px-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1A2337] print:divide-gray-300">
                {items.map((item, idx) => {
                  const qty = item.quantity || 1;
                  const price = item.price || 0;
                  const taxable = item.taxableAmount ?? (qty * price);
                  const gst = item.gstPercent || 0;
                  const cgst = item.cgstAmount ?? 0;
                  const sgst = item.sgstAmount ?? 0;
                  const igst = item.igstAmount ?? 0;
                  const totalTax = item.totalTax ?? (cgst + sgst + igst);
                  const itemTotal = item.totalAmount ?? (taxable + totalTax);

                  return (
                    <tr key={idx} className="hover:bg-[#111625] print:hover:bg-transparent">
                      <td className="py-3 px-3 text-[#64748B] font-mono">{idx + 1}</td>
                      <td className="py-3 px-3 font-semibold text-[#F8FAFC] print:text-black">
                        {item.name}
                      </td>
                      <td className="py-3 px-3 text-center font-mono text-[#CBD5E1] print:text-black">
                        {item.hsnCode || '—'}
                      </td>
                      <td className="py-3 px-3 text-center font-mono font-semibold text-[#F8FAFC] print:text-black">
                        {qty}
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-[#CBD5E1] print:text-black">
                        {formatCurrency(price)}
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-[#CBD5E1] print:text-black">
                        {formatCurrency(taxable)}
                      </td>
                      <td className="py-3 px-3 text-center font-bold text-[#818CF8] print:text-black">
                        {gst}%
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-[#CBD5E1] print:text-black">
                        {isIntraState ? (
                          <span>{formatCurrency(cgst + sgst)}</span>
                        ) : (
                          <span>{formatCurrency(igst)}</span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-[#F8FAFC] print:text-black">
                        {formatCurrency(itemTotal)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Amount in Words Box */}
        <div className="p-3.5 rounded-xl bg-[#111726] border border-[#1E293F] flex items-center justify-between">
          <div className="text-xs">
            <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block">
              Amount in Words
            </span>
            <span className="font-semibold text-[#818CF8] text-xs mt-0.5">
              {words}
            </span>
          </div>
        </div>

        {/* Tax Summary & Grand Total Split */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-8 pt-4 border-t border-[#1E293F] print:border-t-2 print:border-black">
          {/* Notes & Terms */}
          <div className="w-full sm:w-1/2 space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#94A3B8] block">
              Terms & Conditions
            </span>
            <p className="text-xs text-[#64748B] leading-relaxed">
              {bill.notes || '1. Goods once sold will not be taken back or exchanged.\n2. Invoices are computer generated and statutory under GST provisions.'}
            </p>
          </div>

          {/* Totals Table */}
          <div className="w-full sm:w-72 space-y-2 text-xs">
            <div className="flex justify-between text-[#94A3B8] print:text-black">
              <span>Subtotal (Taxable):</span>
              <span className="font-mono font-semibold text-[#F8FAFC] print:text-black">
                {formatCurrency(bill.subtotal ?? bill.taxableAmount ?? 0)}
              </span>
            </div>

            {isIntraState ? (
              <>
                <div className="flex justify-between text-[#94A3B8] print:text-black">
                  <span>Central GST (CGST):</span>
                  <span className="font-mono text-[#818CF8] print:text-black">
                    {formatCurrency(bill.totalCgst ?? 0)}
                  </span>
                </div>
                <div className="flex justify-between text-[#94A3B8] print:text-black">
                  <span>State GST (SGST):</span>
                  <span className="font-mono text-[#818CF8] print:text-black">
                    {formatCurrency(bill.totalSgst ?? 0)}
                  </span>
                </div>
              </>
            ) : (
              <div className="flex justify-between text-[#94A3B8] print:text-black">
                <span>Integrated GST (IGST):</span>
                <span className="font-mono text-[#FBBF24] print:text-black">
                  {formatCurrency(bill.totalIgst ?? 0)}
                </span>
              </div>
            )}

            <div className="flex justify-between text-[#94A3B8] pt-1.5 border-t border-[#1E293F] print:border-black print:text-black">
              <span>Total Tax:</span>
              <span className="font-mono font-bold text-[#818CF8] print:text-black">
                {formatCurrency(bill.totalTax ?? 0)}
              </span>
            </div>

            <div className="flex justify-between text-sm font-extrabold text-[#F8FAFC] pt-2.5 border-t-2 border-[#1E293F] print:border-black print:text-black">
              <span>Grand Total:</span>
              <span className="font-mono text-base font-black text-[#38BDF8] print:text-black">
                {formatCurrency(bill.grandTotal ?? 0)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Email Invoice Modal */}
      {isEmailModalOpen && (
        <EmailInvoiceModal
          isOpen={isEmailModalOpen}
          onClose={() => setIsEmailModalOpen(false)}
          bill={bill}
          shopName={shop.name || shop.businessName}
        />
      )}
    </div>
  );
};

export default BillDetailsPage;
