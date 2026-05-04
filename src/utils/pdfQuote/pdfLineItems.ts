import type { jsPDF } from 'jspdf';
import type { JobStage, Variation } from '../../types/domain';
import { INK, formatMoney } from './pdfConstants';
import { ensureSpace, paragraph, sectionTitle } from './pdfLayout';

type LineItem = { description: string; quantity: number; unit: string; unitPrice: number; amount: number; detail?: string };

export function drawLineItems(doc: jsPDF, variation: Variation, y: number, margin: number, pageWidth: number, pageHeight: number) {
  const rows = buildLineItems(variation);
  y = ensureSpace(doc, y, 24, pageHeight);
  sectionTitle(doc, 'Line Schedule', margin, y);
  y += 7;
  drawTableHeader(doc, margin, y, pageWidth);
  y += 7;
  for (const row of rows) y = drawLineItem(doc, row, y, margin, pageWidth, pageHeight);
  return y + 2;
}

function drawLineItem(doc: jsPDF, row: LineItem, y: number, margin: number, pageWidth: number, pageHeight: number) {
  y = ensureSpace(doc, y, row.detail ? 15 : 9, pageHeight);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...INK);
  doc.text(doc.splitTextToSize(row.description, 70), margin, y);
  doc.text(row.quantity.toFixed(2), pageWidth - 88, y, { align: 'right' });
  doc.text(row.unit, pageWidth - 78, y, { align: 'left' });
  doc.text(formatMoney(row.unitPrice), pageWidth - 48, y, { align: 'right' });
  doc.text('GST Sales', pageWidth - 30, y, { align: 'center' });
  doc.text(formatMoney(row.amount), pageWidth - margin, y, { align: 'right' });
  y += 5;
  if (row.detail) y = paragraph(doc, row.detail, margin + 3, y, 70, pageHeight, 7.5, 3.2);
  doc.setDrawColor(241, 245, 249);
  doc.line(margin, y, pageWidth - margin, y);
  return y + 3;
}

function buildLineItems(variation: Variation): LineItem[] {
  return variation.scopes.flatMap((scope) => {
    const stageRows = scope.stages.map((stage: JobStage) => ({
      description: `${scope.categoryLabel} - ${stage.name}`,
      quantity: 1,
      unit: 'Units',
      unitPrice: stage.cost || 0,
      amount: stage.cost || 0,
      detail: stage.description,
    }));
    const boqRows = (scope.parametricItems || []).map((item) => ({
      description: `${scope.categoryLabel} - ${item.label}`,
      quantity: item.quantity || 0,
      unit: item.unit,
      unitPrice: item.rate || 0,
      amount: (item.quantity || 0) * (item.rate || 0),
      detail: item.notes,
    }));
    return [...stageRows, ...boqRows];
  });
}

function drawTableHeader(doc: jsPDF, margin: number, y: number, pageWidth: number) {
  doc.setFillColor(241, 245, 249);
  doc.rect(margin, y - 5, pageWidth - margin * 2, 7, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...INK);
  doc.text('DESCRIPTION', margin + 1, y);
  doc.text('QUANTITY', pageWidth - 88, y, { align: 'right' });
  doc.text('UNIT', pageWidth - 78, y);
  doc.text('UNIT PRICE', pageWidth - 48, y, { align: 'right' });
  doc.text('GST', pageWidth - 30, y, { align: 'center' });
  doc.text('AMOUNT', pageWidth - margin, y, { align: 'right' });
}