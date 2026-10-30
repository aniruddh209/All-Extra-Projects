import Bill from '../models/Bill.js';
import Shop from '../models/Shop.js';
import Party from '../models/Party.js';
import gstService from '../services/gst.service.js';
import invoiceNumberService from '../services/invoiceNumber.service.js';
import pdfService from '../services/pdf.service.js';
import emailService from '../services/email.service.js';
import asyncHandler from '../utils/asyncHandler.js';
import apiResponse from '../utils/apiResponse.js';

/**
 * List tax invoices with search and pagination
 */
export const getBills = asyncHandler(async (req, res) => {
  const { search = '', page = 1, limit = 10 } = req.query;
  const pageNum = Math.max(1, parseInt(page, 10));
  const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10)));
  const skip = (pageNum - 1) * limitNum;

  const query = { shopId: req.user.shopId };

  if (search && search.trim()) {
    const q = search.trim();
    query.$or = [
      { invoiceNumber: { $regex: q, $options: 'i' } },
      { 'partySnapshot.name': { $regex: q, $options: 'i' } },
      { 'partySnapshot.mobile': { $regex: q, $options: 'i' } },
      { 'partySnapshot.gstin': { $regex: q, $options: 'i' } },
    ];
  }

  const [bills, total] = await Promise.all([
    Bill.find(query).sort({ invoiceDate: -1, createdAt: -1 }).skip(skip).limit(limitNum),
    Bill.countDocuments(query),
  ]);

  return apiResponse.success(res, 'Invoices retrieved successfully', {
    bills,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum) || 1,
      pages: Math.ceil(total / limitNum) || 1,
    },
  });
});

/**
 * Get bill by ID
 */
export const getBillById = asyncHandler(async (req, res) => {
  const bill = await Bill.findOne({ _id: req.params.id, shopId: req.user.shopId });
  if (!bill) {
    return apiResponse.notFound(res, 'Invoice not found');
  }
  return apiResponse.success(res, 'Invoice retrieved', { bill });
});

/**
 * Create a new finalized tax invoice
 */
export const createBill = asyncHandler(async (req, res) => {
  const { partyId, items = [], notes = '' } = req.body;

  if (!partyId) {
    return apiResponse.badRequest(res, 'Customer selection is required');
  }

  if (!items || items.length === 0) {
    return apiResponse.badRequest(res, 'Invoice must contain at least one line item');
  }

  const [shop, party] = await Promise.all([
    Shop.findById(req.user.shopId),
    Party.findOne({ _id: partyId, shopId: req.user.shopId }),
  ]);

  if (!shop) {
    return apiResponse.badRequest(res, 'Shop profile not configured');
  }

  if (!party) {
    return apiResponse.notFound(res, 'Selected customer record not found');
  }

  // Backend authoritative calculation
  const totals = gstService.calculateInvoiceTotals(shop.state, party.state, items);

  // Generate atomic sequential invoice number
  const invoiceNumber = await invoiceNumberService.generateNextInvoiceNumber(
    shop._id,
    shop.invoicePrefix || 'INV'
  );

  // Frozen snapshots
  const bill = await Bill.create({
    shopId: shop._id,
    invoiceNumber,
    invoiceDate: new Date(),
    partyId: party._id,
    partySnapshot: {
      name: party.name,
      mobile: party.mobile,
      email: party.email,
      address: party.address,
      state: party.state,
      gstin: party.gstin,
    },
    shopSnapshot: {
      name: shop.businessName || shop.name,
      businessName: shop.businessName,
      ownerName: shop.ownerName,
      address: shop.address,
      state: shop.state,
      gstin: shop.gstin,
      phone: shop.phone,
      email: shop.email,
    },
    items: totals.items,
    intraState: totals.intraState,
    subtotal: totals.subtotal,
    totalCgst: totals.totalCgst,
    totalSgst: totals.totalSgst,
    totalIgst: totals.totalIgst,
    totalTax: totals.totalTax,
    grandTotal: totals.grandTotal,
    notes: notes ? notes.trim() : '',
    status: 'FINALIZED',
    createdBy: req.user._id,
  });

  return apiResponse.created(res, `Invoice ${invoiceNumber} created successfully`, { bill });
});

/**
 * Generate and stream PDF
 */
export const downloadPdf = asyncHandler(async (req, res) => {
  const bill = await Bill.findOne({ _id: req.params.id, shopId: req.user.shopId });
  if (!bill) {
    return apiResponse.notFound(res, 'Invoice not found');
  }

  const pdfBuffer = await pdfService.generateInvoicePdf(bill);

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${bill.invoiceNumber || 'invoice'}.pdf"`);
  res.setHeader('Content-Length', pdfBuffer.length);

  return res.end(pdfBuffer);
});

/**
 * Email invoice PDF to recipient
 */
export const emailBill = asyncHandler(async (req, res) => {
  const { recipientEmail, subject, message } = req.body;

  const bill = await Bill.findOne({ _id: req.params.id, shopId: req.user.shopId });
  if (!bill) {
    return apiResponse.notFound(res, 'Invoice not found');
  }

  const toEmail = recipientEmail || bill.partySnapshot?.email;
  if (!toEmail) {
    return apiResponse.badRequest(res, 'Recipient email address is required');
  }

  const pdfBuffer = await pdfService.generateInvoicePdf(bill);

  const mailSubject = subject || `Tax Invoice ${bill.invoiceNumber} from ${bill.shopSnapshot?.name || 'GSTBilling PRO'}`;
  const mailText =
    message ||
    `Dear ${bill.partySnapshot?.name || 'Customer'},\n\nPlease find attached your tax invoice ${bill.invoiceNumber} for ₹${bill.grandTotal}.\n\nThank you for your business!`;

  await emailService.sendEmail({
    to: toEmail,
    subject: mailSubject,
    text: mailText,
    attachments: [
      {
        filename: `${bill.invoiceNumber}.pdf`,
        content: pdfBuffer,
        contentType: 'application/pdf',
      },
    ],
  });

  return apiResponse.success(res, `Invoice emailed successfully to ${toEmail}`);
});

export default {
  getBills,
  getBillById,
  createBill,
  downloadPdf,
  emailBill,
};
