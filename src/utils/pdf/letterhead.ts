import jsPDF from 'jspdf';
import type { Company, Project, Variation } from '../../types/domain';

export function drawLetterhead(doc: jsPDF, variation: Variation, company: Company) {
  const pageWidth = doc.internal.pageSize.width;
  const docLabel = variation.documentType === 'quote' ? 'QUOTATION' : 'VARIATION';

  doc.setFillColor(41, 98, 255);
  doc.rect(0, 0, pageWidth, 25, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text(company.name, 14, 16);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`ABN: ${company.abn}`, 14, 22);

  doc.setTextColor(41, 98, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(docLabel, pageWidth - 14, 16, { align: 'right' });
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  if (variation.variationNumber) doc.text(`No: ${variation.variationNumber}`, pageWidth - 14, 22, { align: 'right' });
}

export function drawProjectDetails(doc: jsPDF, variation: Variation, project: Project) {
  const pageWidth = doc.internal.pageSize.width;

  doc.setTextColor(60, 60, 60);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Prepared For', 14, 35);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(`Project: ${project.name}`, 14, 41);
  doc.text(`Address: ${project.address}`, 14, 46);
  doc.text(`Client: ${project.customer.name}`, 14, 51);
  doc.text(`Email: ${project.customer.email}`, 14, 56);
  if (project.customer.phone) doc.text(`Phone: ${project.customer.phone}`, 14, 61);

  doc.text(`Date: ${new Date(variation.createdAt).toLocaleDateString('en-AU')}`, pageWidth - 14, 41, { align: 'right' });
  doc.text(`Document status: ${variation.status.toUpperCase()}`, pageWidth - 14, 46, { align: 'right' });
}