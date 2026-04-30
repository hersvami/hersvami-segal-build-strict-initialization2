import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { Variation } from '../../types/domain';
import { formatCurrency } from '../helpers';

export function drawPricingSummary(doc: jsPDF, variation: Variation, yPos: number, pageWidth: number): number {
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(41, 98, 255);
  doc.text('Price Summary', 14, yPos);
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
    styles: { fontSize: 10, cellPadding: 2 },
    margin: { left: 14, right: 14 },
    columnStyles: { 1: { fontStyle: 'bold', halign: 'right' } },
  });

  yPos = (doc as any).lastAutoTable.finalY + 10;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(41, 98, 255);
  doc.text(`Total payable (incl. GST): ${formatCurrency(variation.pricing.total)}`, pageWidth - 14, yPos, { align: 'right' });
  return yPos;
}