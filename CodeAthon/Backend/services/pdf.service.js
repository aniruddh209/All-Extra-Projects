import PDFDocument from 'pdfkit';
import numberToWords from '../utils/numberToWords.js';

/**
 * Professional PDFKit Invoice Generator
 * Generates statutory Indian GST Tax Invoices.
 */
export const generateInvoicePdf = (bill) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 40, size: 'A4' });
      const buffers = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });

      const shop = bill.shopSnapshot || bill.shop || {};
      const party = bill.partySnapshot || bill.party || {};
      const items = bill.items || [];
      const isIntraState = bill.intraState;

      // Primary colors
      const primaryColor = '#4F46E5';
      const textColor = '#1E293B';
      const mutedColor = '#64748B';

      // ─── Header ───
      doc.fillColor(primaryColor).fontSize(20).font('Helvetica-Bold').text('TAX INVOICE', 40, 40);
      doc.fillColor(mutedColor).fontSize(8).font('Helvetica').text('Original for Recipient', 40, 65);

      // Invoice Details (Right Side)
      doc.fillColor(textColor).fontSize(9).font('Helvetica-Bold').text(`Invoice #: ${bill.invoiceNumber}`, 350, 40, { align: 'right' });
      const invoiceDateStr = new Date(bill.invoiceDate || bill.createdAt).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
      doc.fillColor(mutedColor).fontSize(9).font('Helvetica').text(`Date: ${invoiceDateStr}`, 350, 55, { align: 'right' });
      doc.text(`Status: ${bill.status || 'FINALIZED'}`, 350, 70, { align: 'right' });

      doc.moveTo(40, 90).lineTo(555, 90).strokeColor('#E2E8F0').stroke();

      // ─── Seller & Buyer Details ───
      // Supplier (Left)
      doc.fillColor(primaryColor).fontSize(9).font('Helvetica-Bold').text('BILLED BY (SUPPLIER)', 40, 105);
      doc.fillColor(textColor).fontSize(10).font('Helvetica-Bold').text(shop.businessName || shop.name || 'GST Billing Entity', 40, 120);
      doc.fillColor(mutedColor).fontSize(8).font('Helvetica');
      doc.text(shop.address || '', 40, 135, { width: 230 });
      doc.text(`State: ${shop.state || 'Arunachal Pradesh'}`, 40, 160);
      if (shop.gstin) {
        doc.font('Helvetica-Bold').fillColor(textColor).text(`GSTIN: ${shop.gstin}`, 40, 172);
      }

      // Recipient (Right)
      doc.fillColor(primaryColor).fontSize(9).font('Helvetica-Bold').text('BILLED TO (RECIPIENT)', 300, 105);
      doc.fillColor(textColor).fontSize(10).font('Helvetica-Bold').text(party.name || 'Customer', 300, 120);
      doc.fillColor(mutedColor).fontSize(8).font('Helvetica');
      doc.text(party.address || '', 300, 135, { width: 230 });
      doc.text(`State: ${party.state || '—'}`, 300, 160);
      doc.font('Helvetica-Bold').fillColor(textColor).text(`GSTIN: ${party.gstin || 'Unregistered'}`, 300, 172);

      doc.moveTo(40, 195).lineTo(555, 195).strokeColor('#E2E8F0').stroke();

      // ─── Item Table Header ───
      let y = 210;
      doc.rect(40, y, 515, 20).fill('#F8FAFC');
      doc.fillColor('#475569').fontSize(8).font('Helvetica-Bold');
      doc.text('#', 45, y + 6);
      doc.text('Item Description', 65, y + 6);
      doc.text('HSN/SAC', 230, y + 6);
      doc.text('Qty', 285, y + 6, { width: 30, align: 'right' });
      doc.text('Rate (₹)', 325, y + 6, { width: 50, align: 'right' });
      doc.text('GST %', 385, y + 6, { width: 40, align: 'right' });
      doc.text(isIntraState ? 'Tax (₹)' : 'IGST (₹)', 435, y + 6, { width: 50, align: 'right' });
      doc.text('Total (₹)', 495, y + 6, { width: 55, align: 'right' });

      y += 26;

      // ─── Table Rows ───
      items.forEach((item, index) => {
        doc.fillColor(textColor).fontSize(8).font('Helvetica');
        doc.text(String(index + 1), 45, y);
        doc.text(item.name || '', 65, y, { width: 160 });
        doc.text(item.hsnCode || '—', 230, y);
        doc.text(String(item.quantity || 1), 285, y, { width: 30, align: 'right' });
        doc.text(Number(item.price || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 }), 325, y, { width: 50, align: 'right' });
        doc.text(`${item.gstPercent || 0}%`, 385, y, { width: 40, align: 'right' });
        doc.text(Number(item.totalTax || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 }), 435, y, { width: 50, align: 'right' });
        doc.font('Helvetica-Bold').text(Number(item.totalAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 }), 495, y, { width: 55, align: 'right' });

        y += 20;
        if (y > 680) {
          doc.addPage();
          y = 40;
        }
      });

      doc.moveTo(40, y + 5).lineTo(555, y + 5).strokeColor('#E2E8F0').stroke();
      y += 15;

      // ─── Amount in Words & Totals ───
      const grandTotal = Number(bill.grandTotal || 0);
      const words = numberToWords(grandTotal);

      // Amount in words (Left)
      doc.fillColor(mutedColor).fontSize(8).font('Helvetica-Bold').text('AMOUNT IN WORDS', 40, y);
      doc.fillColor(textColor).fontSize(8).font('Helvetica').text(words, 40, y + 12, { width: 280 });

      // Tax & Grand Total Table (Right)
      const totalsX = 350;
      doc.fontSize(8).font('Helvetica');
      doc.text('Taxable Subtotal:', totalsX, y);
      doc.text(`₹ ${Number(bill.subtotal || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, 460, y, { width: 90, align: 'right' });

      if (isIntraState) {
        y += 14;
        doc.text('Central GST (CGST):', totalsX, y);
        doc.text(`₹ ${Number(bill.totalCgst || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, 460, y, { width: 90, align: 'right' });
        y += 14;
        doc.text('State GST (SGST):', totalsX, y);
        doc.text(`₹ ${Number(bill.totalSgst || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, 460, y, { width: 90, align: 'right' });
      } else {
        y += 14;
        doc.text('Integrated GST (IGST):', totalsX, y);
        doc.text(`₹ ${Number(bill.totalIgst || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, 460, y, { width: 90, align: 'right' });
      }

      y += 14;
      doc.text('Total Tax:', totalsX, y);
      doc.text(`₹ ${Number(bill.totalTax || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, 460, y, { width: 90, align: 'right' });

      y += 18;
      doc.rect(totalsX - 5, y - 4, 215, 24).fill('#F1F5F9');
      doc.fillColor(primaryColor).fontSize(10).font('Helvetica-Bold');
      doc.text('GRAND TOTAL:', totalsX, y + 3);
      doc.text(`₹ ${grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, 460, y + 3, { width: 90, align: 'right' });

      // ─── Footer Terms ───
      const footerY = 740;
      doc.fillColor(mutedColor).fontSize(7).font('Helvetica');
      doc.text('Terms & Conditions: 1. Goods once sold will not be returned or exchanged. 2. This is a computer-generated tax invoice valid without signature.', 40, footerY, { width: 515, align: 'center' });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

export default {
  generateInvoicePdf,
};
