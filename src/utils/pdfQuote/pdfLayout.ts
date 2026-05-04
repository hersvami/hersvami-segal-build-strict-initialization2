import type { jsPDF } from 'jspdf';
import type { Company } from '../../types/domain';
import { INK, LINE, MUTED } from './pdfConstants';

export function sectionTitle(doc: jsPDF, title: string, x: number, y: number) {
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...INK);
  doc.text(title, x, y);
}

export function ensureSpace(doc: jsPDF, y: number, needed: number, pageHeight: number) {
  if (y + needed <= pageHeight - 22) return y;
  doc.addPage();
  return 18;
}

export function paragraph(doc: jsPDF, text: string, x: number, y: number, width: number, pageHeight: number, fontSize = 9, lineHeight = 4) {
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(fontSize);
  doc.setTextColor(...MUTED);
  const lines = doc.splitTextToSize(text, width);
  for (const line of lines) {
    y = ensureSpace(doc, y, lineHeight + 2, pageHeight);
    doc.text(line, x, y);
    y += lineHeight;
  }
  return y;
}

export function bulletList(doc: jsPDF, title: string, items: string[], x: number, y: number, pageWidth: number, pageHeight: number) {
  if (items.length === 0) return y;
  y = ensureSpace(doc, y, 10, pageHeight);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...INK);
  doc.text(`${title}:`, x, y);
  y += 4;
  for (const item of items.slice(0, 8)) {
    y = paragraph(doc, `- ${item}`, x + 3, y, pageWidth - x - 18, pageHeight, 7.5, 3.4);
  }
  return y + 1;
}

export function drawFooterOnAllPages(doc: jsPDF, company: Company, pageWidth: number, pageHeight: number) {
  const pages = doc.getNumberOfPages();
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i);
    doc.setDrawColor(...LINE);
    doc.line(14, pageHeight - 16, pageWidth - 14, pageHeight - 16);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(...MUTED);
    doc.text(`${company.name} | ${company.phone} | ${company.email} | ${company.websiteUrl || 'segalbuild.com.au'}`, 14, pageHeight - 10);
    doc.text(`Page ${i} / ${pages}`, pageWidth - 14, pageHeight - 10, { align: 'right' });
  }
}