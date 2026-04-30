import jsPDF from 'jspdf';
import type { Company, Project, Variation } from '../types/domain';
import { drawBoqSections } from './pdf/boqSections';
import { drawDocumentIntro } from './pdf/documentIntro';
import { drawFooter } from './pdf/footer';
import { drawLetterhead, drawProjectDetails } from './pdf/letterhead';
import { drawPricingSummary } from './pdf/pricingSummary';
import { drawScopeDetails } from './pdf/scopeDetails';
import { drawScopeSummary } from './pdf/scopeSummary';
import { drawTermsAndConditions } from './pdf/terms';

export function generateQuotePDF(variation: Variation, project: Project, company: Company): jsPDF {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;

  drawLetterhead(doc, variation, company);
  drawProjectDetails(doc, variation, project);

  let yPos = 70;
  yPos = drawDocumentIntro(doc, variation, project, yPos, pageWidth);
  yPos = drawScopeSummary(doc, variation, yPos, pageWidth);
  yPos = drawScopeDetails(doc, variation, yPos, pageWidth);
  yPos = drawBoqSections(doc, variation, yPos);
  yPos = drawPricingSummary(doc, variation, yPos, pageWidth);
  drawTermsAndConditions(doc, pageWidth);
  drawFooter(doc, company, pageWidth);

  return doc;
}