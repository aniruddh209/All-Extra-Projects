import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Plus, Tag, Hash, Check } from 'lucide-react';
import itemService from '../../../services/item.service';
import { formatCurrency } from '../../../utils/formatCurrency';
import Button from '../../../components/ui/Button';

export const ItemSelector = ({ onSelectItem }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['items', { search, limit: 20 }],
    queryFn: () => itemService.getItems({ search: search.trim() || undefined, limit: 20 }),
    enabled: isOpen,
  });

  const items = Array.isArray(data?.data?.items)
    ? data.data.items
    : Array.isArray(data?.items)
    ? data.items
    : Array.isArray(data?.data)
    ? data.data
    : Array.isArray(data)
    ? data
    : [];

  const handlePick = (item) => {
    onSelectItem({
      itemId: item._id,
      name: item.name,
      hsnCode: item.hsnCode || '',
      price: item.price,
      gstPercent: item.gstPercent,
      quantity: 1,
    });
    setIsOpen(false);
  };

  return (
    <>
      <Button
        type="button"
        variant="secondary"
        size="sm"
        onClick={() => setIsOpen(true)}
      >
        <Plus className="w-3.5 h-3.5 mr-1.5" />
        Add From Catalog
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-lg bg-[#0D1017] border border-[#1E293F] rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 border-b border-[#1E293F] flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#F8FAFC]">
                Select Catalog Product / Service
              </h3>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-xs text-[#94A3B8] hover:text-white"
              >
                Close
              </button>
            </div>

            <div className="p-3 border-b border-[#1E293F]">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" />
                <input
                  type="text"
                  placeholder="Search catalog by name or HSN code..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  autoFocus
                  className="w-full pl-9 pr-4 py-2 rounded-lg bg-[#141B2D] border border-[#222E48] text-xs text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[#6366F1]"
                />
              </div>
            </div>

            <div className="max-h-72 overflow-y-auto divide-y divide-[#1A2337]">
              {isLoading ? (
                <div className="p-4 text-center text-xs text-[#94A3B8]">
                  Loading catalog items...
                </div>
              ) : items.length === 0 ? (
                <div className="p-6 text-center text-xs text-[#94A3B8]">
                  No items found in catalog.
                </div>
              ) : (
                items.map((item) => (
                  <div
                    key={item._id}
                    onClick={() => handlePick(item)}
                    className="p-3 hover:bg-[#111625] cursor-pointer transition-colors flex items-center justify-between group"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs text-[#F8FAFC] group-hover:text-[#818CF8] transition-colors">
                          {item.name}
                        </span>
                        {item.hsnCode && (
                          <span className="text-[10px] text-[#94A3B8] px-1.5 py-0.5 rounded bg-[#141B2D] border border-[#222E48] font-mono">
                            HSN: {item.hsnCode}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-[#34D399] font-bold mt-0.5 block">
                        {item.gstPercent}% GST
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-mono font-bold text-[#F8FAFC]">
                        {formatCurrency(item.price)}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-3 bg-[#080B11] border-t border-[#1E293F] text-right">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
              >
                Done
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ItemSelector;
