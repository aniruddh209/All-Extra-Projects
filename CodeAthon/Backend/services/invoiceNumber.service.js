import Counter from '../models/Counter.js';

/**
 * Generate sequential invoice number atomically per shop.
 * Example format: INV-2026-000123
 */
export const generateNextInvoiceNumber = async (shopId, prefix = 'INV') => {
  const currentYear = new Date().getFullYear();
  const cleanPrefix = (prefix || 'INV').replace(/-$/, '');

  const counter = await Counter.findOneAndUpdate(
    { shopId },
    { $inc: { sequence: 1 } },
    { new: true, upsert: true }
  );

  const paddedSeq = String(counter.sequence).padStart(6, '0');
  return `${cleanPrefix}-${currentYear}-${paddedSeq}`;
};

export default {
  generateNextInvoiceNumber,
};
