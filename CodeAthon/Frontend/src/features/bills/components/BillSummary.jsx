import React from 'react';
import { formatCurrency } from '../../../utils/formatCurrency';
import Button from '../../../components/ui/Button';
import { Receipt, FileText, CheckCircle2, ArrowRight } from 'lucide-react';

export const BillSummary = ({
  summary = {
    subtotal: 0,
    totalCgst: 0,
    totalSgst: 0,
    totalIgst: 0,
    totalTax: 0,
    grandTotal: 0,
    intraState: true,
  },
  notes = '',
  onChangeNotes,
  isSubmitting = false,
  onSubmit,
  hasParty = false,
  hasItems = false,
}) => {
  const canSubmit = hasParty && hasItems && !isSubmitting;

  return (
    <div className="space-y-5">
      {/* Summary Card */}
      <div className="p-5 rounded-2xl bg-[#0D1017] border border-[#1E293F] space-y-4 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-[#1E293F]">
          <h3 className="text-xs font-bold text-[#CBD5E1] uppercase tracking-wider flex items-center gap-2">
            <Receipt className="w-4 h-4 text-[#6366F1]" />
            Invoice Summary
          </h3>
          <span
            className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
              summary.intraState
                ? 'bg-[#10B981]/15 text-[#34D399] border border-[#10B981]/30'
                : 'bg-[#F59E0B]/15 text-[#FBBF24] border border-[#F59E0B]/30'
            }`}
          >
            {summary.intraState ? 'Intra-State (CGST+SGST)' : 'Inter-State (IGST)'}
          </span>
        </div>

        {/* Breakdown */}
        <div className="space-y-2.5 text-xs">
          <div className="flex justify-between text-[#94A3B8]">
            <span>Subtotal (Taxable)</span>
            <span className="font-mono text-[#F8FAFC]">
              {formatCurrency(summary.subtotal)}
            </span>
          </div>

          {summary.intraState ? (
            <>
              <div className="flex justify-between text-[#94A3B8]">
                <span>CGST</span>
                <span className="font-mono text-[#818CF8]">
                  {formatCurrency(summary.totalCgst)}
                </span>
              </div>
              <div className="flex justify-between text-[#94A3B8]">
                <span>SGST</span>
                <span className="font-mono text-[#818CF8]">
                  {formatCurrency(summary.totalSgst)}
                </span>
              </div>
            </>
          ) : (
            <div className="flex justify-between text-[#94A3B8]">
              <span>IGST</span>
              <span className="font-mono text-[#FBBF24]">
                {formatCurrency(summary.totalIgst)}
              </span>
            </div>
          )}

          <div className="flex justify-between text-[#94A3B8] pt-2 border-t border-[#1E293F]">
            <span className="font-medium">Total Tax</span>
            <span className="font-mono font-bold text-[#818CF8]">
              {formatCurrency(summary.totalTax)}
            </span>
          </div>
        </div>

        {/* Grand Total Highlight */}
        <div className="p-4 rounded-xl bg-[#111625] border border-[#1E293F] flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-[#94A3B8] font-bold block">
              Grand Total
            </span>
            <span className="text-[10px] text-[#64748B]">
              (Includes statutory GST)
            </span>
          </div>
          <div className="text-right">
            <span className="text-xl font-black font-mono text-[#38BDF8]">
              {formatCurrency(summary.grandTotal)}
            </span>
          </div>
        </div>

        {/* Invoice Notes */}
        <div className="space-y-1.5 pt-1">
          <label className="text-xs font-semibold text-[#CBD5E1] flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-[#64748B]" />
            Invoice Notes / Terms
          </label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => onChangeNotes && onChangeNotes(e.target.value)}
            placeholder="e.g. Payment due within 15 days of invoice date."
            className="w-full p-2.5 rounded-xl bg-[#080B11] border border-[#1E293F] text-xs text-[#F8FAFC] placeholder-[#475569] focus:outline-none focus:border-[#6366F1] resize-none transition-colors"
          />
        </div>

        {/* Submit Button */}
        <button
          type="button"
          onClick={onSubmit}
          disabled={!canSubmit}
          className="w-full h-11 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#4F46E5] hover:from-[#4F46E5] hover:to-[#4338CA] text-white font-bold text-xs shadow-[0_4px_14px_rgba(99,102,241,0.4)] flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>Generate Invoice</span>
            </>
          )}
        </button>

        {!hasParty && (
          <p className="text-[11px] text-[#EF4444] text-center font-medium">
            * Please select a customer first
          </p>
        )}
        {hasParty && !hasItems && (
          <p className="text-[11px] text-[#EF4444] text-center font-medium">
            * Please enter line item details
          </p>
        )}
      </div>
    </div>
  );
};

export default BillSummary;
