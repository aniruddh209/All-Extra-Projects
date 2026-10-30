/**
 * Pure GST Calculation Engine
 * 
 * Rules:
 * - Taxable amount = Rate * Quantity
 * - Intra-state (buyerState === sellerState): CGST = Taxable * (Rate/2), SGST = Taxable * (Rate/2), IGST = 0
 * - Inter-state (buyerState !== sellerState): IGST = Taxable * Rate, CGST = 0, SGST = 0
 */

/**
 * Standardize state names for case-insensitive comparison
 */
export const normalizeState = (state) => {
  if (!state) return '';
  return state.trim().toLowerCase();
};

/**
 * Check if the transaction is intra-state (within same state)
 */
export const isIntraState = (sellerState, buyerState) => {
  if (!sellerState || !buyerState) return true; // default to intra-state if undefined
  return normalizeState(sellerState) === normalizeState(buyerState);
};

/**
 * Calculate tax breakdown for a single invoice line item
 */
export const calculateLineItemTaxes = ({
  quantity = 1,
  price = 0,
  gstPercent = 18,
  intraState = true,
}) => {
  const qty = Math.max(0, Number(quantity) || 0);
  const rate = Math.max(0, Number(price) || 0);
  const taxRate = Math.max(0, Number(gstPercent) || 0);

  const taxableAmount = Math.round(qty * rate * 100) / 100;

  let cgstRate = 0;
  let sgstRate = 0;
  let igstRate = 0;

  let cgstAmount = 0;
  let sgstAmount = 0;
  let igstAmount = 0;

  if (intraState) {
    cgstRate = taxRate / 2;
    sgstRate = taxRate / 2;
    cgstAmount = Math.round((taxableAmount * (cgstRate / 100)) * 100) / 100;
    sgstAmount = Math.round((taxableAmount * (sgstRate / 100)) * 100) / 100;
  } else {
    igstRate = taxRate;
    igstAmount = Math.round((taxableAmount * (igstRate / 100)) * 100) / 100;
  }

  const totalTax = Math.round((cgstAmount + sgstAmount + igstAmount) * 100) / 100;
  const totalAmount = Math.round((taxableAmount + totalTax) * 100) / 100;

  return {
    quantity: qty,
    price: rate,
    gstPercent: taxRate,
    taxableAmount,
    cgstRate,
    sgstRate,
    igstRate,
    cgstAmount,
    sgstAmount,
    igstAmount,
    totalTax,
    totalAmount,
  };
};

/**
 * Aggregate entire invoice totals from line items
 */
export const calculateInvoiceSummary = (items = [], sellerState = '', buyerState = '') => {
  const intraState = isIntraState(sellerState, buyerState);

  let subtotal = 0;
  let totalCgst = 0;
  let totalSgst = 0;
  let totalIgst = 0;

  const calculatedItems = items.map((item) => {
    const calc = calculateLineItemTaxes({
      quantity: item.quantity,
      price: item.price,
      gstPercent: item.gstPercent,
      intraState,
    });

    subtotal += calc.taxableAmount;
    totalCgst += calc.cgstAmount;
    totalSgst += calc.sgstAmount;
    totalIgst += calc.igstAmount;

    return {
      ...item,
      ...calc,
    };
  });

  subtotal = Math.round(subtotal * 100) / 100;
  totalCgst = Math.round(totalCgst * 100) / 100;
  totalSgst = Math.round(totalSgst * 100) / 100;
  totalIgst = Math.round(totalIgst * 100) / 100;
  const totalTax = Math.round((totalCgst + totalSgst + totalIgst) * 100) / 100;
  const grandTotal = Math.round((subtotal + totalTax) * 100) / 100;

  return {
    intraState,
    subtotal,
    totalCgst,
    totalSgst,
    totalIgst,
    totalTax,
    grandTotal,
    items: calculatedItems,
  };
};

export default {
  isIntraState,
  calculateLineItemTaxes,
  calculateInvoiceSummary,
};
