import type { jsPDF } from 'jspdf';
import type { Company } from '../../types/domain';

export function drawFooter(doc: jsPDF, company: Company, pageWidth: number) {
  const yPos = pageWidth > 200 ? 280 : 290;
  doc.setFontSize(9);
  doc.setTextColor(41, 98, 255);
  doc.text(`${company.name} | ${company.phone} | ${company.email}`, pageWidth / 2, yPos, { align: 'center' });
}
