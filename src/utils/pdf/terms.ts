import type { jsPDF } from 'jspdf';
import { SEGAL_BUILD_TERMS } from '../legal/terms';

export function drawTermsAndConditions(doc: jsPDF, pageWidth: number) {
  doc.addPage();
  let yPos = 18;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(41, 98, 255);
  doc.text('Terms and Conditions', 14, yPos);
  yPos += 8;

  for (const section of SEGAL_BUILD_TERMS) {
    yPos = ensureSpace(doc, yPos, 18);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(40, 40, 40);
    doc.text(section.title, 14, yPos);
    yPos += 5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(70, 70, 70);
    for (const clause of section.clauses) {
      const lines = doc.splitTextToSize(clause, pageWidth - 28);
      yPos = ensureSpace(doc, yPos, lines.length * 3.6 + 2);
      doc.text(lines, 14, yPos);
      yPos += lines.length * 3.6 + 2;
    }
  }
}

function ensureSpace(doc: jsPDF, yPos: number, needed: number): number {
  const pageHeight = doc.internal.pageSize.height;
  if (yPos + needed < pageHeight - 18) return yPos;
  doc.addPage();
  return 18;
}
