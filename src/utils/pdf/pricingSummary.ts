import type { jsPDF } from 'jspdf';
import { autoTable } from 'jspdf-autotable';
import type { Variation } from '../../types/domain';
import { formatCurrency } from '../helpers';

export function drawPricingSummary(doc: jsPDF, variation: Variation, yPos: number, pageWidth: number): number {
  if (yPos > 220) {
    doc.addPage();
    yPos = 18;
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text('Investment Summary', 14, yPos);
  yPos += 6;

  autoTable(doc, {
    startY: yPos,
    body: [
      ['Direct construction cost', formatCurrency(variation.pricing.tradeCost)],
      [`Builder overhead (${variation.pricing.overheadPercent}%)`, formatCurrency(variation.pricing.overhead)],
      [`Builder margin (${variation.pricing.profitPercent}%)`, formatCurrency(variation.pricing.profit)],
      [`Risk and contingency allowance (${variation.pricing.contingencyPercent}%)`, formatCurrency(variation.pricing.contingency)],
      ['Subtotal (excl. GST)', formatCurrency(variation.pricing.subtotalExclGst)],
      ['GST (10%)', formatCurrency(variation.pricing.gst)],
    ],
    theme: 'plain',
    styles: { fontSize: 9.5, cellPadding: 2.5, textColor: [51, 65, 85] },
    margin: { left: 14, right: 14 },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    columnStyles: { 1: { fontStyle: 'bold', halign: 'right', textColor: [15, 23, 42] } },
  });

  yPos = (doc as any).lastAutoTable.finalY + 6;
  doc.setFillColor(29, 78, 216);
  doc.roundedRect(14, yPos, pageWidth - 28, 14, 2, 2, 'F');
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('Total payable (incl. GST)', 18, yPos + 9);
  doc.text(formatCurrency(variation.pricing.total), pageWidth - 18, yPos + 9, { align: 'right' });
  return yPos + 18;
}
