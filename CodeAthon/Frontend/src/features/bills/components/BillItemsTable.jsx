import React from 'react';
import { Trash2, Plus } from 'lucide-react';
import { GST_RATES } from '../../../constants/gstRates';
import { calculateLineItemTaxes } from '../../../utils/gstCalculator';
import { formatCurrency } from '../../../utils/formatCurrency';
import ItemSelector from './ItemSelector';
import Button from '../../../components/ui/Button';

export const BillItemsTable = ({
  items = [],
  onChangeItems,
  intraState = true,
}) => {
  const handleUpdateItem = (index, field, value) => {
    const next = [...items];
    next[index] = {
      ...next[index],
      [field]: value,
    };
    onChangeItems(next);
  };

  const handleRemoveItem = (index) => {
    const next = items.filter((_, i) => i !== index);
    onChangeItems(next);
  };

  const handleAddCustomItem = () => {
    onChangeItems([
      ...items,
      {
        name: '',
        hsnCode: '',
        quantity: 1,
        price: 0,
        gstPercent: 18,
      },
    ]);
  };

  const handleSelectCatalogItem = (catalogItem) => {
    onChangeItems([...items, catalogItem]);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-[#D4D4D8] uppercase tracking-wider">
            Line Items ({items.length})
          </label>
          <span className="text-[11px] text-[#71717A]">
            {intraState ? '• Intra-State (CGST + SGST applied)' : '• Inter-State (IGST applied)'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <ItemSelector onSelectItem={handleSelectCatalogItem} />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleAddCustomItem}
          >
            <Plus className="w-3.5 h-3.5 mr-1" />
            Add Row
          </Button>
        </div>
      </div>

      <div className="rounded-xl bg-[#0D1017] border border-[#1E293F] shadow-sm overflow-x-auto">
        <table className="w-full text-left text-xs min-w-[700px]">
          <thead className="bg-[#080B11] border-b border-[#1E293F] text-[#94A3B8] uppercase tracking-wider font-semibold">
            <tr>
              <th className="py-3 px-3.5 min-w-[200px]">Item Description *</th>
              <th className="py-3 px-3.5 w-24">HSN/SAC</th>
              <th className="py-3 px-3.5 w-20 text-center">Qty *</th>
              <th className="py-3 px-3.5 w-28 text-right">Price (₹) *</th>
              <th className="py-3 px-3.5 w-24 text-center">GST %</th>
              <th className="py-3 px-3.5 w-28 text-right">Taxable (₹)</th>
              <th className="py-3 px-3.5 w-28 text-right">
                {intraState ? 'CGST + SGST' : 'IGST'}
              </th>
              <th className="py-3 px-3.5 w-28 text-right">Total (₹)</th>
              <th className="py-3 px-2 w-10 text-center"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1A2337]">
            {items.length === 0 ? (
              <tr>
                <td colSpan="9" className="py-8 text-center text-[#64748B]">
                  No items added yet. Click &quot;Add From Catalog&quot; or &quot;Add Row&quot; to begin.
                </td>
              </tr>
            ) : (
              items.map((item, index) => {
                const tax = calculateLineItemTaxes({
                  quantity: item.quantity,
                  price: item.price,
                  gstPercent: item.gstPercent,
                  intraState,
                });

                return (
                  <tr key={index} className="hover:bg-[#111625] transition-colors">
                    {/* Item Name */}
                    <td className="py-2.5 px-3">
                      <input
                        type="text"
                        placeholder="Item name / Description"
                        value={item.name}
                        onChange={(e) => handleUpdateItem(index, 'name', e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-[#141B2D] border border-[#222E48] text-xs text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[#6366F1]"
                      />
                    </td>

                    {/* HSN Code */}
                    <td className="py-2.5 px-3">
                      <input
                        type="text"
                        placeholder="HSN"
                        value={item.hsnCode || ''}
                        onChange={(e) => handleUpdateItem(index, 'hsnCode', e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-[#141B2D] border border-[#222E48] text-xs font-mono text-[#CBD5E1] placeholder-[#64748B] focus:outline-none focus:border-[#6366F1]"
                      />
                    </td>

                    {/* Quantity */}
                    <td className="py-2.5 px-3">
                      <input
                        type="number"
                        min="1"
                        step="1"
                        placeholder="1"
                        value={item.quantity === '' || item.quantity === undefined ? '' : item.quantity}
                        onChange={(e) => handleUpdateItem(index, 'quantity', e.target.value === '' ? '' : e.target.value)}
                        onBlur={(e) => {
                          const num = Number(e.target.value);
                          if (!e.target.value || isNaN(num) || num < 1) {
                            handleUpdateItem(index, 'quantity', 1);
                          } else {
                            handleUpdateItem(index, 'quantity', num);
                          }
                        }}
                        className="w-full px-2 py-1.5 rounded-lg bg-[#141B2D] border border-[#222E48] text-xs text-center font-mono text-[#F8FAFC] focus:outline-none focus:border-[#6366F1] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                    </td>

                    {/* Unit Price */}
                    <td className="py-2.5 px-3">
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        value={item.price === '' || item.price === undefined ? '' : item.price}
                        onChange={(e) => handleUpdateItem(index, 'price', e.target.value === '' ? '' : e.target.value)}
                        onBlur={(e) => {
                          const num = Number(e.target.value);
                          if (e.target.value === '' || isNaN(num) || num < 0) {
                            handleUpdateItem(index, 'price', 0);
                          } else {
                            handleUpdateItem(index, 'price', num);
                          }
                        }}
                        className="w-full px-2 py-1.5 rounded-lg bg-[#141B2D] border border-[#222E48] text-xs text-right font-mono text-[#F8FAFC] focus:outline-none focus:border-[#6366F1] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                    </td>

                    {/* GST Rate */}
                    <td className="py-2.5 px-3">
                      <select
                        value={item.gstPercent}
                        onChange={(e) => handleUpdateItem(index, 'gstPercent', Number(e.target.value))}
                        className="w-full px-2 py-1.5 rounded-lg bg-[#141B2D] border border-[#222E48] text-xs text-center text-[#F8FAFC] focus:outline-none focus:border-[#6366F1]"
                      >
                        {GST_RATES.map((rate) => (
                          <option key={rate} value={rate}>
                            {rate}%
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Taxable Amount */}
                    <td className="py-2.5 px-3 text-right font-mono text-[#94A3B8]">
                      {formatCurrency(tax.taxableAmount)}
                    </td>

                    {/* Tax Amount */}
                    <td className="py-2.5 px-3 text-right font-mono text-[#818CF8]">
                      {intraState ? (
                        <div className="text-[11px] leading-tight">
                          <span className="font-semibold">{formatCurrency(tax.totalTax)}</span>
                          <span className="block text-[10px] text-[#64748B]">
                            (C:{formatCurrency(tax.cgstAmount)} + S:{formatCurrency(tax.sgstAmount)})
                          </span>
                        </div>
                      ) : (
                        <span className="font-semibold">{formatCurrency(tax.igstAmount)}</span>
                      )}
                    </td>

                    {/* Total Amount */}
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-[#F8FAFC]">
                      {formatCurrency(tax.totalAmount)}
                    </td>

                    {/* Remove Action */}
                    <td className="py-2.5 px-2 text-center">
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(index)}
                        className="p-1 rounded text-[#64748B] hover:text-[#EF4444] hover:bg-[#EF4444]/15 transition-colors"
                        title="Delete line item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BillItemsTable;
