import type { JobStage, ParametricItem, QuoteScope } from '../../types/domain';
import { formatCurrency } from '../../utils/helpers';

type QuoteLine = {
  description: string;
  detail?: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  amount: number;
};

export function QuoteLineSchedule({ scopes }: { scopes: QuoteScope[] }) {
  const lines = scopes.flatMap(buildQuoteLines);
  if (lines.length === 0) return null;

  return (
    <div className="overflow-hidden rounded-sm border border-slate-200">
      <div className="grid grid-cols-[1fr_90px_90px_80px_110px] bg-slate-900 px-4 py-3 text-xs font-bold uppercase tracking-wide text-white">
        <span>Description</span>
        <span className="text-right">Quantity</span>
        <span className="text-right">Unit Price</span>
        <span className="text-center">GST</span>
        <span className="text-right">Amount</span>
      </div>
      {lines.map((line, index) => <QuoteLineRow key={`${line.description}-${index}`} line={line} />)}
    </div>
  );
}

function QuoteLineRow({ line }: { line: QuoteLine }) {
  return (
    <div className="grid grid-cols-[1fr_90px_90px_80px_110px] items-start gap-2 border-t border-slate-200 px-4 py-3 text-sm">
      <div>
        <p className="font-semibold text-slate-900">{line.description}</p>
        {line.detail && <p className="mt-1 text-xs leading-5 text-slate-500">{line.detail}</p>}
      </div>
      <span className="text-right text-slate-700">{formatQuantity(line.quantity)} {line.unit}</span>
      <span className="text-right text-slate-700">{formatCurrency(line.unitPrice)}</span>
      <span className="text-center text-xs font-medium text-slate-500">GST Sales</span>
      <span className="text-right font-semibold text-slate-900">{formatCurrency(line.amount)}</span>
    </div>
  );
}

function buildQuoteLines(scope: QuoteScope): QuoteLine[] {
  const stageLines = scope.stages.map((stage: JobStage) => ({
    description: `${scope.categoryLabel} - ${stage.name}`,
    detail: stage.description,
    quantity: 1,
    unit: 'Units',
    unitPrice: stage.cost || 0,
    amount: stage.cost || 0,
  }));

  const boqLines = (scope.parametricItems || []).map((item: ParametricItem) => ({
    description: `${scope.categoryLabel} - ${item.label}`,
    detail: item.notes,
    quantity: item.quantity || 0,
    unit: item.unit,
    unitPrice: item.rate || 0,
    amount: (item.quantity || 0) * (item.rate || 0),
  }));

  return [...stageLines, ...boqLines];
}

function formatQuantity(value: number) {
  if (Number.isInteger(value)) return value.toFixed(2);
  return value.toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}