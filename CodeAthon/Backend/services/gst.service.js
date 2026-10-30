/**
 * Indian GST Calculation Engine
 *
 * Implements statutory GST rules:
 * - Intra-State: Seller state === Buyer state -> Split into CGST (50%) + SGST (50%)
 * - Inter-State: Seller state !== Buyer state -> Entire GST charged as IGST (100%)
 * - Slabs supported: 0%, 5%, 12%, 18%, 28%
 * - IEEE 754 precision rounding
 */

const round2 = (num) => Math.round((num + Number.EPSILON) * 100) / 100;

export const calculateLineItemTax = (item, isIntraState) => {
  const quantity = Number(item.quantity) || 1;
  const price = Number(item.price) || 0;
  const gstPercent = Number(item.gstPercent) || 0;

  const taxableAmount = round2(quantity * price);
  const totalTax = round2((taxableAmount * gstPercent) / 100);

  let cgstAmount = 0;
  let sgstAmount = 0;
  let igstAmount = 0;

  if (isIntraState) {
    cgstAmount = round2(totalTax / 2);
    sgstAmount = round2(totalTax - cgstAmount); // Prevent 1-paisa rounding drift
    igstAmount = 0;
  } else {
    igstAmount = totalTax;
    cgstAmount = 0;
    sgstAmount = 0;
  }

  const totalAmount = round2(taxableAmount + totalTax);

  return {
    itemId: item.itemId,
    name: item.name,
    hsnCode: item.hsnCode || '',
    quantity,
    price,
    gstPercent,
    taxableAmount,
    cgstAmount,
    sgstAmount,
    igstAmount,
    totalTax,
    totalAmount,
  };
};

export const calculateInvoiceTotals = (sellerState, buyerState, rawItems = []) => {
  const sState = (sellerState || '').trim().toLowerCase();
  const bState = (buyerState || '').trim().toLowerCase();
  const intraState = sState === bState;

  const computedItems = rawItems.map((item) => calculateLineItemTax(item, intraState));

  const subtotal = round2(computedItems.reduce((sum, item) => sum + item.taxableAmount, 0));
  const totalCgst = round2(computedItems.reduce((sum, item) => sum + item.cgstAmount, 0));
  const totalSgst = round2(computedItems.reduce((sum, item) => sum + item.sgstAmount, 0));
  const totalIgst = round2(computedItems.reduce((sum, item) => sum + item.igstAmount, 0));
  const totalTax = round2(totalCgst + totalSgst + totalIgst);
  const grandTotal = round2(subtotal + totalTax);

  return {
    intraState,
    items: computedItems,
    subtotal,
    totalCgst,
    totalSgst,
    totalIgst,
    totalTax,
    grandTotal,
  };
};

export default {
  calculateLineItemTax,
  calculateInvoiceTotals,
};
