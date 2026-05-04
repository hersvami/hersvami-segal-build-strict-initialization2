import type { jsPDF } from 'jspdf';
import type { Project, Variation } from '../../types/domain';
import { INK } from './pdfConstants';
import { bulletList, ensureSpace, paragraph, sectionTitle } from './pdfLayout';

export function drawProjectOverview(doc: jsPDF, variation: Variation, project: Project, y: number, margin: number, pageWidth: number, pageHeight: number) {
  y = ensureSpace(doc, y, 42, pageHeight);
  sectionTitle(doc, 'Project Overview', margin, y);
  y += 7;
  const overview = variation.description || `This quote is for the proposed works at ${project.address}. It outlines the construction scope, trade stages, inclusions, exclusions and total payable including GST.`;
  return paragraph(doc, overview, margin, y, pageWidth - margin * 2, pageHeight) + 4;
}

export function drawScopeNarrative(doc: jsPDF, variation: Variation, y: number, margin: number, pageWidth: number, pageHeight: number) {
  y = ensureSpace(doc, y, 30, pageHeight);
  sectionTitle(doc, 'Scope of Work', margin, y);
  y += 7;
  for (const [index, scope] of variation.scopes.entries()) {
    y = ensureSpace(doc, y, 26, pageHeight);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(...INK);
    doc.text(`${index + 1}. ${scope.categoryLabel}`, margin, y);
    y += 5;
    y = paragraph(doc, scope.description || 'Scope details to be confirmed.', margin + 3, y, pageWidth - margin * 2 - 3, pageHeight, 8.5);
    if (scope.inclusions.length > 0) y = bulletList(doc, 'Included', scope.inclusions.map((item) => item.text), margin + 3, y, pageWidth, pageHeight);
    if (scope.exclusions.length > 0) y = bulletList(doc, 'Excluded', scope.exclusions.map((item) => item.text), margin + 3, y, pageWidth, pageHeight);
    y += 2;
  }
  return y + 2;
}