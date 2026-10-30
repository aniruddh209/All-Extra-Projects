import React from 'react';
import { Link } from 'react-router-dom';
import { Edit2, Trash2, Tag, Hash } from 'lucide-react';
import Skeleton from '../../../components/ui/Skeleton';
import EmptyState from '../../../components/ui/EmptyState';
import { formatCurrency } from '../../../utils/formatCurrency';
import { usePermission } from '../../../hooks/usePermission';

export const ItemTable = ({
  items = [],
  isLoading,
  onDelete,
  onAddItem,
}) => {
  const { canEditItem, canDeleteItem } = usePermission();

  if (isLoading) {
    return (
      <div className="p-4 space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full rounded-md" />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <EmptyState
        title="No items in catalog"
        description="Add products or services with HSN codes and GST rates to start billing."
        actionLabel="Add Item"
        onAction={onAddItem}
      />
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs">
        <thead className="bg-[#0D1017] border-b border-[#1E293F] text-[#94A3B8] uppercase tracking-wider font-semibold">
          <tr>
            <th className="py-3.5 px-4">Item / Product</th>
            <th className="py-3.5 px-4">HSN / SAC</th>
            <th className="py-3.5 px-4 text-right">Unit Price</th>
            <th className="py-3.5 px-4 text-center">GST Slab</th>
            <th className="py-3.5 px-4 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#1A2337]">
          {items.map((item) => (
            <tr
              key={item._id}
              className="hover:bg-[#111625] transition-colors group"
            >
              {/* Item Name */}
              <td className="py-3.5 px-4 font-semibold text-[#F8FAFC]">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-[#6366F1]/15 border border-[#818CF8]/30 flex items-center justify-center text-xs font-bold text-[#A5B4FC] shrink-0">
                    <Tag className="w-3.5 h-3.5 text-[#818CF8]" />
                  </div>
                  <div>
                    <span className="font-semibold text-[#F8FAFC]">{item.name}</span>
                    {item.description && (
                      <p className="text-[11px] text-[#64748B] truncate max-w-xs mt-0.5">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
              </td>

              {/* HSN / SAC */}
              <td className="py-3.5 px-4 font-mono text-[#CBD5E1]">
                {item.hsnCode ? (
                  <span className="inline-flex items-center gap-1 bg-[#111726] px-2 py-0.5 rounded border border-[#1E293F] text-xs text-[#CBD5E1]">
                    <Hash className="w-3 h-3 text-[#64748B]" />
                    {item.hsnCode}
                  </span>
                ) : (
                  <span className="text-[#64748B]">—</span>
                )}
              </td>

              {/* Unit Price */}
              <td className="py-3.5 px-4 text-right font-mono font-bold text-[#F8FAFC]">
                {formatCurrency(item.price)}
              </td>

              {/* GST Rate */}
              <td className="py-3.5 px-4 text-center">
                <span
                  className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide ${
                    item.gstPercent === 0
                      ? 'bg-[#1E293B] text-[#94A3B8] border border-[#334155]'
                      : item.gstPercent === 18
                      ? 'bg-[#6366F1]/15 text-[#818CF8] border border-[#6366F1]/30'
                      : item.gstPercent === 28
                      ? 'bg-[#EF4444]/15 text-[#F87171] border border-[#EF4444]/30'
                      : 'bg-[#10B981]/15 text-[#34D399] border border-[#10B981]/30'
                  }`}
                >
                  {item.gstPercent}% GST
                </span>
              </td>

              {/* Actions */}
              <td className="py-3.5 px-4 text-center">
                <div className="flex items-center justify-center gap-1">
                  {canEditItem && (
                    <Link
                      to={`/items/${item._id}/edit`}
                      className="p-1.5 rounded-lg text-[#64748B] hover:text-[#818CF8] hover:bg-[#6366F1]/15 transition-colors"
                      title="Edit Item"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </Link>
                  )}

                  {canDeleteItem && (
                    <button
                      type="button"
                      onClick={() => onDelete(item)}
                      className="p-1.5 rounded-lg text-[#64748B] hover:text-[#EF4444] hover:bg-[#EF4444]/15 transition-colors"
                      title="Delete Item"
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

export default ItemTable;
