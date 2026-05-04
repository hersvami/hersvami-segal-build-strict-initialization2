import { jsPDF } from 'jspdf';
import type { Company, Project, Variation } from '../types/domain';
import { PDF_MARGIN } from './pdfQuote/pdfConstants';
import { drawHeader } from './pdfQuote/pdfHeader';
import { drawLineItems } from './pdfQuote/pdfLineItems';
import { drawFooterOnAllPages } from './pdfQuote/pdfLayout';
import { drawProjectOverview, drawScopeNarrative } from './pdfQuote/pdfScopeSections';
import { drawAcceptance, drawPaymentTerms, drawTotals } from './pdfQuote/pdfTotals';
import { drawTerms } from './pdfQuote/pdfTerms';

export function generateQuotePDF(variation: Variation, project: Project, company: Company): jsPDF {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const quoteDate = new Date(variation.createdAt || Date.now());
  const expiryDate = new Date(quoteDate);
  expiryDate.setDate(expiryDate.getDate() + 30);
  const quoteNo = variation.variationNumber || `S${variation.id.slice(0, 5).toUpperCase()}`;

  let y = drawHeader(doc, company, project, variation, quoteNo, quoteDate, expiryDate);
  y = drawProjectOverview(doc, variation, project, y, PDF_MARGIN, pageWidth, pageHeight);
  y = drawScopeNarrative(doc, variation, y, PDF_MARGIN, pageWidth, pageHeight);
  y = drawLineItems(doc, variation, y, PDF_MARGIN, pageWidth, pageHeight);
  y = drawTotals(doc, variation, y, PDF_MARGIN, pageWidth, pageHeight);
  y = drawPaymentTerms(doc, y, PDF_MARGIN, pageWidth, pageHeight);
  drawAcceptance(doc, y, PDF_MARGIN, pageWidth, pageHeight);
  drawFooterOnAllPages(doc, company, pageWidth, pageHeight);
  drawTerms(doc, pageWidth, pageHeight, PDF_MARGIN);
  drawFooterOnAllPages(doc, company, pageWidth, pageHeight);
  return doc;
}