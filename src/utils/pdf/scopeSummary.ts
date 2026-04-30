import jsPDF from 'jspdf';
import type { Variation } from '../../types/domain';

export function drawScopeSummary(doc: jsPDF, variation: Variation, yPos: number, pageWidth: number): number {
  if (!variation.description) return yPos;

  doc.setFont('helvetica', 'bold');
  doc.text('Scope of Works Summary', 14, yPos);
  doc.setFont('helvetica', 'normal');
  yPos += 5;
  const descLines = doc.splitTextToSize(variation.description, pageWidth - 28);
  doc.text(descLines, 14, yPos);
  return yPos + descLines.length * 5 + 8;
}