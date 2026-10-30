import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  User,
  Phone,
  MapPin,
  Mail,
  Hash,
  FileText,
  Plus,
  Edit2,
  ArrowLeft,
  Calendar,
  Eye,
} from 'lucide-react';

import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/ui/Button';
import CurrencyDisplay from '../../components/ui/CurrencyDisplay';
import DateDisplay from '../../components/ui/DateDisplay';
import Skeleton from '../../components/ui/Skeleton';
import ErrorState from '../../components/ui/ErrorState';
import partyService from '../../services/party.service';
import ROUTES from '../../constants/routes';

export const PartyDetailsPage = () => {
  const { id } = useParams();

  // Load customer profile
  const {
    data: partyData,
    isLoading: isPartyLoading,
    isError: isPartyError,
    error: partyError,
    refetch: refetchParty,
  } = useQuery({
    queryKey: ['party', id],
    queryFn: () => partyService.getPartyById(id),
  });

  // Load customer bills
  const {
    data: billsData,
    isLoading: isBillsLoading,
  } = useQuery({
    queryKey: ['party-bills', id],
    queryFn: () => partyService.getPartyBills(id),
  });

  const party = partyData?.data?.party || partyData?.party || partyData?.data || partyData;
  const bills = billsData?.bills || billsData?.data?.bills || [];

  if (isPartyLoading) {
    return <Skeleton className="h-96 w-full rounded-xl" />;
  }

  if (isPartyError) {
    return (
      <ErrorState
        title="Failed to load customer profile"
        message={partyError?.message}
        onRetry={refetchParty}
      />
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <PageHeader
        title={party?.name || 'Customer Details'}
        description="Comprehensive customer record and transaction ledger."
        breadcrumbs={
          <div className="flex items-center gap-1.5">
            <Link to={ROUTES.PARTIES} className="hover:text-[#F5F5F5]">
              Customers
            </Link>
            <span>/</span>
            <span className="text-[#F5F5F5]">{party?.name}</span>
          </div>
        }
      >
        <div className="flex items-center gap-2">
          <Link to={`/parties/${id}/edit`}>
            <Button variant="secondary" size="sm" leftIcon={Edit2}>
              Edit Profile
            </Button>
          </Link>
          <Link to={`${ROUTES.CREATE_BILL}?partyId=${id}`}>
            <Button variant="primary" size="sm" leftIcon={Plus}>
              Create Invoice
            </Button>
          </Link>
        </div>
      </PageHeader>

      {/* Customer Info Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Mobile */}
        <div className="p-4 rounded-xl bg-[#0D1118] border border-[#222A38] space-y-1 shadow-sm">
          <span className="text-[11px] font-semibold text-[#71717A] uppercase flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-[#818CF8]" /> Mobile Number
          </span>
          <p className="text-sm font-mono font-medium text-[#F8FAFC]">
            {party?.mobile}
          </p>
        </div>

        {/* State */}
        <div className="p-4 rounded-xl bg-[#0D1118] border border-[#222A38] space-y-1 shadow-sm">
          <span className="text-[11px] font-semibold text-[#71717A] uppercase flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#818CF8]" /> Place of Supply
          </span>
          <p className="text-sm font-medium text-[#F8FAFC]">
            {party?.state}
          </p>
        </div>

        {/* GSTIN */}
        <div className="p-4 rounded-xl bg-[#0D1118] border border-[#222A38] space-y-1 shadow-sm">
          <span className="text-[11px] font-semibold text-[#71717A] uppercase flex items-center gap-1.5">
            <Hash className="w-3.5 h-3.5 text-[#818CF8]" /> GSTIN
          </span>
          <p className="text-sm font-mono font-medium text-[#A5B4FC]">
            {party?.gstin || 'Unregistered'}
          </p>
        </div>

        {/* Email */}
        <div className="p-4 rounded-xl bg-[#0D1118] border border-[#222A38] space-y-1 shadow-sm">
          <span className="text-[11px] font-semibold text-[#71717A] uppercase flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-[#818CF8]" /> Email Address
          </span>
          <p className="text-sm text-[#F8FAFC] truncate font-mono">
            {party?.email || '—'}
          </p>
        </div>
      </div>

      {/* Address */}
      <div className="p-4 rounded-xl bg-[#0D1118] border border-[#222A38] space-y-1 shadow-sm">
        <span className="text-[11px] font-semibold text-[#71717A] uppercase">
          Registered Billing Address
        </span>
        <p className="text-sm text-[#CBD5E1] leading-relaxed">
          {party?.address}
        </p>
      </div>

      {/* Bill History Section */}
      <div className="rounded-xl bg-[#0D1118] border border-[#222A38] shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-[#222A38] flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-[#F8FAFC]">
              Customer Invoicing Ledger
            </h3>
            <p className="text-xs text-[#94A3B8]">
              Historical billing transactions issued to this customer
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-[#111722] border border-[#222A38] text-[#CBD5E1]">
            {bills.length} Invoices
          </span>
        </div>

        {isBillsLoading ? (
          <div className="p-4 space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : bills.length === 0 ? (
          <div className="p-8 text-center text-xs text-[#71717A]">
            No invoices have been generated for this customer yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#080B11] border-b border-[#222A38] text-[#94A3B8] uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4">Invoice No</th>
                  <th className="py-3 px-4">Invoice Date</th>
                  <th className="py-3 px-4 text-right">Taxable</th>
                  <th className="py-3 px-4 text-right">Tax</th>
                  <th className="py-3 px-4 text-right">Grand Total</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1A2337]">
                {bills.map((bill) => (
                  <tr key={bill._id} className="hover:bg-[#111722] transition-colors">
                    <td className="py-3 px-4 font-mono font-medium text-[#F8FAFC]">
                      <div className="flex items-center gap-2">
                        <FileText className="w-3.5 h-3.5 text-[#818CF8]" />
                        <span>{bill.invoiceNumber || bill.invoiceNo}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-[#CBD5E1]">
                      <DateDisplay date={bill.invoiceDate || bill.createdAt} />
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-[#94A3B8]">
                      <CurrencyDisplay amount={bill.subtotal} />
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-[#34D399]">
                      <CurrencyDisplay amount={bill.totalTax} />
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-[#F8FAFC]">
                      <CurrencyDisplay amount={bill.grandTotal} />
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Link
                        to={`/bills/${bill._id}`}
                        className="p-1.5 rounded-lg text-[#71717A] hover:text-white hover:bg-[#1E293F] inline-block transition-colors"
                        title="View Invoice"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default PartyDetailsPage;
