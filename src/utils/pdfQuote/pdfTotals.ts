import type { jsPDF } from 'jspdf';
import type { Variation } from '../../types/domain';
import { BLUE, INK, formatMoney } from './pdfConstants';
import { ensureSpace, paragraph, sectionTitle } from './pdfLayout';

export function drawTotals(doc: jsPDF, variation: Variation, y: number, margin: number, pageWidth: number, pageHeight: number) {
  y = ensureSpace(doc, y, 42, pageHeight);
  const x = pageWidth - 82;
  const rows: Array<[string, number, boolean?]> = [
    ['Subtotal', variation.pricing.tradeCost],
    ['Preliminaries', variation.pricing.preliminariesAmountExGst || 0],
    ['Untaxed Amount', variation.pricing.subtotalExclGst],
    ['GST 10%', variation.pricing.gstAmount],
    ['Total', variation.pricing.total, true],
  ];
  for (const [label, value, strong] of rows) {
    doc.setFont('helvetica', strong ? 'bold' : 'normal');
    doc.setFontSize(strong ? 12 : 9);
    if (strong) doc.setTextColor(...BLUE);
    else doc.setTextColor(...INK);
    doc.text(label, x, y);
    doc.text(formatMoney(value), pageWidth - margin, y, { align: 'right' });
    y += strong ? 8 : 6;
  }
  return y + 2;
}

export function drawPaymentTerms(doc: jsPDF, y: number, margin: number, pageWidth: number, pageHeight: number) {
  y = ensureSpace(doc, y, 42, pageHeight);
  sectionTitle(doc, 'Payment Terms', margin, y);
  y += 7;
  const lines = ['Payment Due on Invoice', 'Account Name: Segal Build Pty. Ltd.', 'BSB: 083004', 'Account No.: 971236454', 'This invoice is issued pursuant to the Building and Construction Industry Security of Payment Act 2002 (VIC).'];
  return paragraph(doc, lines.join('\n'), margin, y, pageWidth - margin * 2, pageHeight, 9, 4);
}

export function drawAcceptance(doc: jsPDF, y: number, margin: number, pageWidth: number, pageHeight: number) {
  y = ensureSpace(doc, y + 6, 40, pageHeight);
  sectionTitle(doc, 'Acceptance', margin, y);
  y += 10;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text('I/we accept this quotation and authorise Segal Build to proceed with the works described above.', margin, y);
  y += 20;
  doc.line(margin, y, margin + 75, y);
  doc.line(pageWidth - margin - 55, y, pageWidth - margin, y);
  doc.setFontSize(8);
  doc.text('Client Signature', margin, y + 5);
  doc.text('Date', pageWidth - margin - 55, y + 5);
  return y + 10;
}