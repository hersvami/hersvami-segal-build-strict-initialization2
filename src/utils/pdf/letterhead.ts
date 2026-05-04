import type { jsPDF } from 'jspdf';
import type { Company, Project, Variation } from '../../types/domain';

export function drawLetterhead(doc: jsPDF, variation: Variation, company: Company) {
  const pageWidth = doc.internal.pageSize.width;
  const docLabel = variation.documentType === 'quote' ? 'Quotation' : 'Variation';

  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, pageWidth, 34, 'F');
  doc.setFillColor(29, 78, 216);
  doc.rect(0, 34, pageWidth, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(19);
  doc.setFont('helvetica', 'bold');
  doc.text(company.name, 14, 16);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.text(`ABN ${company.abn}`, 14, 23);
  if (company.licence) doc.text(company.licence, 14, 29);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text(docLabel, pageWidth - 14, 16, { align: 'right' });
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(new Date(variation.createdAt).toLocaleDateString('en-AU'), pageWidth - 14, 23, { align: 'right' });
  if (variation.variationNumber) doc.text(`Reference ${variation.variationNumber}`, pageWidth - 14, 29, { align: 'right' });
}

export function drawProjectDetails(doc: jsPDF, variation: Variation, project: Project) {
  const pageWidth = doc.internal.pageSize.width;

  doc.setDrawColor(226, 232, 240);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(14, 46, pageWidth - 28, 32, 2, 2, 'FD');

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Prepared for', 18, 55);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text(project.customer.name, 18, 61);
  doc.text(project.customer.email, 18, 66);
  if (project.customer.phone) doc.text(project.customer.phone, 18, 71);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('Project', pageWidth / 2, 55);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(project.name, pageWidth / 2, 61);
  doc.text(doc.splitTextToSize(project.address, pageWidth / 2 - 24), pageWidth / 2, 66);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('Total incl. GST', pageWidth - 18, 55, { align: 'right' });
  doc.setFontSize(13);
  doc.setTextColor(29, 78, 216);
  doc.text(formatMoney(variation.pricing.total), pageWidth - 18, 64, { align: 'right' });
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text(`Status: ${variation.status.toUpperCase()}`, pageWidth - 18, 71, { align: 'right' });
}

function formatMoney(value: number): string {
  return new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', maximumFractionDigits: 0 }).format(value || 0);
}
