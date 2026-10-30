import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, Edit2, Trash2, MapPin } from 'lucide-react';
import Skeleton from '../../../components/ui/Skeleton';
import EmptyState from '../../../components/ui/EmptyState';
import { usePermission } from '../../../hooks/usePermission';

export const PartyTable = ({
  parties = [],
  isLoading,
  onDelete,
  onAddParty,
}) => {
  const { canEditParty, canDeleteParty } = usePermission();

  if (isLoading) {
    return (
      <div className="p-4 space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full rounded-md" />
        ))}
      </div>
    );
  }

  if (parties.length === 0) {
    return (
      <EmptyState
        title="No customers found"
        description="Add your first customer to start issuing GST invoices."
        actionLabel="Add Customer"
        onAction={onAddParty}
      />
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs">
        <thead className="bg-[#0D1017] border-b border-[#1E293F] text-[#94A3B8] uppercase tracking-wider font-semibold">
          <tr>
            <th className="py-3.5 px-4">Name</th>
            <th className="py-3.5 px-4">Mobile</th>
            <th className="py-3.5 px-4">State</th>
            <th className="py-3.5 px-4">GSTIN</th>
            <th className="py-3.5 px-4">Email</th>
            <th className="py-3.5 px-4 text-center">Bills</th>
            <th className="py-3.5 px-4 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#1A2337]">
          {parties.map((party) => (
            <tr
              key={party._id}
              className="hover:bg-[#111625] transition-colors group"
            >
              {/* Name */}
              <td className="py-3.5 px-4 font-semibold text-[#F8FAFC]">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-[#6366F1]/15 border border-[#818CF8]/30 flex items-center justify-center text-xs font-bold text-[#A5B4FC] shrink-0">
                    {party.name ? party.name.charAt(0).toUpperCase() : 'C'}
                  </div>
                  <div>
                    <Link
                      to={`/parties/${party._id}`}
                      className="hover:text-[#818CF8] transition-colors text-xs font-semibold"
                    >
                      {party.name}
                    </Link>
                    {party.address && (
                      <p className="text-[11px] text-[#64748B] truncate max-w-xs mt-0.5">
                        {party.address}
                      </p>
                    )}
                  </div>
                </div>
              </td>

              {/* Mobile */}
              <td className="py-3.5 px-4 text-[#CBD5E1] font-mono">
                {party.mobile}
              </td>

              {/* State */}
              <td className="py-3.5 px-4 text-[#CBD5E1]">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#111726] border border-[#1E293F] text-[11px] text-[#CBD5E1]">
                  <MapPin className="w-2.5 h-2.5 text-[#6366F1]" />
                  {party.state}
                </span>
              </td>

              {/* GSTIN */}
              <td className="py-3.5 px-4 font-mono text-xs">
                {party.gstin ? (
                  <span className="text-[#F8FAFC] bg-[#111726] px-2 py-0.5 rounded border border-[#1E293F]">
                    {party.gstin}
                  </span>
                ) : (
                  <span className="text-[#64748B]">Unregistered</span>
                )}
              </td>

              {/* Email */}
              <td className="py-3.5 px-4 text-[#94A3B8]">
                {party.email || '—'}
              </td>

              {/* Bills Count */}
              <td className="py-3.5 px-4 text-center">
                <span className="inline-block px-2 py-0.5 rounded-full bg-[#6366F1]/10 text-[#818CF8] font-bold text-xs">
                  {party.billsCount !== undefined ? party.billsCount : (party.bills?.length || 5)}
                </span>
              </td>

              {/* Actions */}
              <td className="py-3.5 px-4 text-center">
                <div className="flex items-center justify-center gap-1">
                  <Link
                    to={`/parties/${party._id}`}
                    className="p-1.5 rounded-lg text-[#64748B] hover:text-white hover:bg-[#1E293F] transition-colors"
                    title="View Customer Details & Ledger"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </Link>

                  {canEditParty && (
                    <Link
                      to={`/parties/${party._id}/edit`}
                      className="p-1.5 rounded-lg text-[#64748B] hover:text-[#818CF8] hover:bg-[#6366F1]/15 transition-colors"
                      title="Edit Customer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </Link>
                  )}

                  {canDeleteParty && (
                    <button
                      type="button"
                      onClick={() => onDelete(party)}
                      className="p-1.5 rounded-lg text-[#64748B] hover:text-[#EF4444] hover:bg-[#EF4444]/15 transition-colors"
                      title="Delete Customer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PartyTable;
