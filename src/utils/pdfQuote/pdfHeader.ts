import type { jsPDF } from 'jspdf';
import type { Company, Project, Variation } from '../../types/domain';
import { BLUE, INK, LINE, MUTED, formatDate } from './pdfConstants';

export function drawHeader(doc: jsPDF, company: Company, project: Project, variation: Variation, quoteNo: string, quoteDate: Date, expiryDate: Date) {
  const pageWidth = doc.internal.pageSize.width;
  doc.setTextColor(...INK);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(19);
  doc.text(company.name.toUpperCase(), 14, 18);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...MUTED);
  doc.text('Building Your Dreams', 14, 24);
  doc.text(`${company.phone} | ${company.email} | ${company.websiteUrl || 'segalbuild.com.au'}`, 14, 30);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(...BLUE);
  doc.text(variation.documentType === 'quote' ? 'Quotation' : 'Variation', pageWidth - 14, 18, { align: 'right' });
  doc.setFontSize(9);
  doc.setTextColor(...MUTED);
  doc.text(`# ${quoteNo}`, pageWidth - 14, 25, { align: 'right' });
  doc.setDrawColor(...LINE);
  doc.line(14, 36, pageWidth - 14, 36);
  drawClientDetails(doc, project, variation, quoteDate, expiryDate);
  return 84;
}

function drawClientDetails(doc: jsPDF, project: Project, variation: Variation, quoteDate: Date, expiryDate: Date) {
  const pageWidth = doc.internal.pageSize.width;
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...INK);
  doc.text('Prepared for', 14, 46);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...MUTED);
  doc.text(project.customer.name, 14, 52);
  doc.text(project.address, 14, 58);
  if (project.customer.email) doc.text(project.customer.email, 14, 64);
  if (project.customer.phone) doc.text(project.customer.phone, 14, 70);
  const metaX = pageWidth - 70;
  drawMeta(doc, metaX, 46, 'Quotation Date', formatDate(quoteDate));
  drawMeta(doc, metaX, 58, 'Expiration', formatDate(expiryDate));
  drawMeta(doc, metaX, 70, variation.documentType === 'quote' ? 'Salesperson' : 'Prepared by', 'James Segal');
}

function drawMeta(doc: jsPDF, x: number, y: number, label: string, value: string) {
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...INK);
  doc.text(label, x, y);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...MUTED);
  doc.text(value, x + 34, y);
}