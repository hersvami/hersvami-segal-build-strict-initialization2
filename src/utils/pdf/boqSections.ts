import type { jsPDF } from 'jspdf';
import { autoTable } from 'jspdf-autotable';
import type { Variation } from '../../types/domain';
import { PHASE_LABELS, PHASE_ORDER } from '../../components/variationBuilder/phaseGrouping';
import { formatCurrency } from '../helpers';
import { inferPhaseFromParametric, inferPhaseFromStage } from './phaseInference';

type BoqItem = { label: string; trade: string; description: string; cost: number };

export function drawBoqSections(doc: jsPDF, variation: Variation, yPos: number): number {
  const phaseGroups: Record<string, BoqItem[]> = {};
  for (const phase of PHASE_ORDER) phaseGroups[phase] = [];

  for (const stage of variation.scopes.flatMap((scope) => scope.stages || [])) {
    phaseGroups[inferPhaseFromStage(stage)].push({ label: stage.name, trade: stage.trade, description: stage.description || '', cost: stage.cost });
  }
  for (const item of variation.scopes.flatMap((scope) => scope.parametricItems || [])) {
    phaseGroups[inferPhaseFromParametric(item)].push({ label: item.label, trade: `${item.quantity} ${item.unit} x ${formatCurrency(item.rate)}`, description: item.notes || '', cost: item.rate * item.quantity });
  }

  for (const phase of PHASE_ORDER) {
    if (phaseGroups[phase].length === 0) continue;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(41, 98, 255);
    doc.text(PHASE_LABELS[phase], 14, yPos);
    yPos += 2;
    autoTable(doc, {
      startY: yPos,
      head: [['Stage / Item', 'Description', 'Trade / Unit', 'Amount']],
      body: phaseGroups[phase].map((item) => [item.label, item.description, item.trade, formatCurrency(item.cost)]),
      theme: 'plain',
      headStyles: { fillColor: [240, 240, 240], textColor: [80, 80, 80], fontStyle: 'bold' },
      styles: { fontSize: 9, cellPadding: 1.5 },
      margin: { left: 14, right: 14 },
      columnStyles: { 3: { halign: 'right', fontStyle: 'bold' } },
    });
    yPos = (doc as any).lastAutoTable.finalY + 8;
  }
  return yPos;
}
