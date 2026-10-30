import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Plus, User, MapPin, Check, Building } from 'lucide-react';
import partyService from '../../../services/party.service';
import QuickAddPartyModal from '../../parties/components/QuickAddPartyModal';
import Button from '../../../components/ui/Button';

export const CustomerSelector = ({
  selectedParty = null,
  onSelectParty,
  sellerState = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['parties', { search, limit: 100 }],
    queryFn: () => partyService.getParties({ search: search.trim() || undefined, limit: 100 }),
    keepPreviousData: true,
  });

  const parties = Array.isArray(data?.data?.parties)
    ? data.data.parties
    : Array.isArray(data?.parties)
    ? data.parties
    : Array.isArray(data?.data)
    ? data.data
    : Array.isArray(data)
    ? data
    : [];

  const handleSelect = (party) => {
    onSelectParty(party);
    setIsOpen(false);
  };

  const handleQuickAddSuccess = (newParty) => {
    setIsQuickAddOpen(false);
    const partyObj = newParty?.party || newParty?.data?.party || newParty;
    if (partyObj) {
      onSelectParty(partyObj);
    }
  };

  const isSameState = selectedParty && sellerState
    ? selectedParty.state?.trim().toLowerCase() === sellerState.trim().toLowerCase()
    : true;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-[#D4D4D8] uppercase tracking-wider">
          Billed To / Customer *
        </label>
        <button
          type="button"
          onClick={() => setIsQuickAddOpen(true)}
          className="inline-flex items-center gap-1 text-xs text-[#6366F1] hover:text-[#818CF8] font-medium transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Quick Add Customer
        </button>
      </div>

      {selectedParty ? (
        <div className="p-4 rounded-xl bg-[#0D1017] border border-[#1E293F] flex items-start justify-between gap-4 shadow-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-[#F8FAFC]">
                {selectedParty.name}
              </span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                  isSameState
                    ? 'bg-[#10B981]/15 text-[#34D399] border-[#10B981]/30'
                    : 'bg-[#F59E0B]/15 text-[#FBBF24] border-[#F59E0B]/30'
                }`}
              >
                {isSameState ? 'Intra-State (CGST + SGST)' : 'Inter-State (IGST)'}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#94A3B8]">
              <span>Phone: {selectedParty.mobile}</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#64748B]" />
                {selectedParty.state}
              </span>
              {selectedParty.gstin && (
                <span className="font-mono text-[11px] text-[#A5B4FC]">
                  GSTIN: {selectedParty.gstin}
                </span>
              )}
            </div>

            {selectedParty.address && (
              <p className="text-[11px] text-[#64748B] mt-0.5">
                {selectedParty.address}
              </p>
            )}
          </div>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(true)}
          >
            Change
          </Button>
        </div>
      ) : (
        <div
          onClick={() => setIsOpen(true)}
          className="p-6 rounded-xl bg-[#0D1118] border border-dashed border-[#222A38] hover:border-[#6366F1] cursor-pointer transition-colors text-center py-7 group"
        >
          <User className="w-6 h-6 text-[#64748B] group-hover:text-[#818CF8] mx-auto mb-2 transition-colors" />
          <p className="text-sm font-semibold text-[#F8FAFC]">
            Select Customer / Billed Party
          </p>
          <p className="text-xs text-[#94A3B8] mt-0.5">
            Click to search existing parties or quick-add a new client.
          </p>
        </div>
      )}

      {/* Dropdown / Customer Search Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-lg bg-[#0D1118] border border-[#222A38] rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 border-b border-[#222A38] flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#F8FAFC]">
                Select Customer
              </h3>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-xs text-[#94A3B8] hover:text-white"
              >
                Close
              </button>
            </div>

            <div className="p-3 border-b border-[#222A38]">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B]" />
                <input
                  type="text"
                  placeholder="Search by customer name, mobile, or GSTIN..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  autoFocus
                  className="w-full h-10 pl-10 pr-4 rounded-xl bg-[#090C12] border border-[#222A38] text-xs text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[#6366F1]"
                />
              </div>
            </div>

            <div className="max-h-72 overflow-y-auto divide-y divide-[#1A2337]">
              {isLoading ? (
                <div className="p-4 text-center text-xs text-[#94A3B8]">
                  Loading customers...
                </div>
              ) : parties.length === 0 ? (
                <div className="p-6 text-center space-y-2">
                  <p className="text-xs text-[#94A3B8]">No customers match your search.</p>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setIsOpen(false);
                      setIsQuickAddOpen(true);
                    }}
                  >
                    <Plus className="w-3.5 h-3.5 mr-1" />
                    Add "{search}" as Customer
                  </Button>
                </div>
              ) : (
                parties.map((party) => (
                  <div
                    key={party._id}
                    onClick={() => handleSelect(party)}
                    className="p-3 hover:bg-[#111625] cursor-pointer transition-colors flex items-center justify-between group"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs text-[#F8FAFC] group-hover:text-[#818CF8] transition-colors">
                          {party.name}
                        </span>
                        <span className="text-[10px] text-[#94A3B8] px-1.5 py-0.5 rounded bg-[#141B2D] border border-[#222E48]">
                          {party.state}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#64748B] mt-0.5">
                        {party.mobile} {party.gstin ? `• ${party.gstin}` : ''}
                      </p>
                    </div>
                    {selectedParty?._id === party._id && (
                      <Check className="w-4 h-4 text-[#818CF8]" />
                    )}
                  </div>
                ))
              )}
            </div>

            <div className="p-3 bg-[#080B11] border-t border-[#1E293F] flex items-center justify-between">
              <span className="text-[11px] text-[#94A3B8]">
                {parties.length} customer(s) available
              </span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsOpen(false);
                  setIsQuickAddOpen(true);
                }}
              >
                + New Customer
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Add Party Modal */}
      <QuickAddPartyModal
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
        onSuccess={handleQuickAddSuccess}
      />
    </div>
  );
};

export default CustomerSelector;
