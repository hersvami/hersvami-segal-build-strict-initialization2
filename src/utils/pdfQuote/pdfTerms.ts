import type { jsPDF } from 'jspdf';
import { SEGAL_BUILD_TERMS } from '../legal/terms';
import { INK } from './pdfConstants';
import { ensureSpace, paragraph, sectionTitle } from './pdfLayout';

export function drawTerms(doc: jsPDF, pageWidth: number, pageHeight: number, margin: number) {
  doc.addPage();
  let y = 18;
  sectionTitle(doc, 'Terms and Conditions', margin, y);
  y += 8;
  for (const section of SEGAL_BUILD_TERMS) {
    y = ensureSpace(doc, y, 16, pageHeight);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(...INK);
    doc.text(section.title.toUpperCase(), margin, y);
    y += 5;
    for (const clause of section.clauses) {
      y = paragraph(doc, clause, margin, y, pageWidth - margin * 2, pageHeight, 7.2, 3.4);
    }
    y += 2;
  }
}