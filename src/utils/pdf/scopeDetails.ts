import type { jsPDF } from 'jspdf';
import type { QuoteScope, Variation } from '../../types/domain';

export function drawScopeDetails(doc: jsPDF, variation: Variation, yPos: number, pageWidth: number): number {
  if (variation.scopes.length > 0) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42);
    doc.text('Detailed Scope of Works', 14, yPos);
    yPos += 8;
  }

  for (const scope of variation.scopes) {
    yPos = maybeNewPage(doc, yPos, 50);
    doc.setDrawColor(226, 232, 240);
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(14, yPos - 5, pageWidth - 28, 9, 1.5, 1.5, 'FD');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text(scope.categoryLabel, 18, yPos);
    yPos += 8;
    yPos = drawScopeText(doc, scope, yPos, pageWidth);
  }
  return yPos + 2;
}

function drawScopeText(doc: jsPDF, scope: QuoteScope, yPos: number, pageWidth: number): number {
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(70, 70, 70);
  if (scope.description) {
    const lines = doc.splitTextToSize(scope.description, pageWidth - 28);
    doc.text(lines, 14, yPos);
    yPos += lines.length * 4 + 4;
  }

  yPos = drawList(doc, 'Included', scope.inclusions.map((item) => item.text), yPos, pageWidth);
  yPos = drawList(doc, 'Excluded', scope.exclusions.map((item) => item.text), yPos, pageWidth);
  return yPos + 3;
}

function drawList(doc: jsPDF, title: string, items: string[], yPos: number, pageWidth: number): number {
  if (items.length === 0) return yPos;
  doc.setFont('helvetica', 'bold');
  doc.text(`${title}:`, 14, yPos);
  yPos += 4;
  doc.setFont('helvetica', 'normal');
  for (const item of items.slice(0, 6)) {
    const lines = doc.splitTextToSize(`- ${item}`, pageWidth - 32);
    doc.text(lines, 18, yPos);
    yPos += lines.length * 3.8;
  }
  if (items.length > 6) {
    doc.text(`- Plus ${items.length - 6} additional item(s) listed in project records.`, 18, yPos);
    yPos += 4;
  }
  return yPos + 2;
}

function maybeNewPage(doc: jsPDF, yPos: number, needed: number): number {
  const pageHeight = doc.internal.pageSize.height;
  if (yPos + needed < pageHeight - 28) return yPos;
  doc.addPage();
  return 18;
}
