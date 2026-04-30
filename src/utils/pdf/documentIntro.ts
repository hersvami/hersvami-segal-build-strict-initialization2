import jsPDF from 'jspdf';
import type { Project, Variation } from '../../types/domain';

export function drawDocumentIntro(doc: jsPDF, variation: Variation, project: Project, yPos: number, pageWidth: number): number {
  const documentName = variation.documentType === 'quote' ? 'quotation' : 'variation';
  const intro = [
    `This ${documentName} has been prepared for ${project.customer.name} for the works at ${project.address}.`,
    'It outlines the proposed scope, pricing basis, inclusions, exclusions and GST total for review before approval.',
  ];

  if (variation.documentType === 'variation' && variation.reasonForChange) {
    intro.push(`Reason for variation: ${variation.reasonForChange}.`);
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(41, 98, 255);
  doc.text('Document Overview', 14, yPos);
  yPos += 5;
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(60, 60, 60);
  doc.setFontSize(9);
  const lines = doc.splitTextToSize(intro.join(' '), pageWidth - 28);
  doc.text(lines, 14, yPos);
  return yPos + lines.length * 4.5 + 7;
}