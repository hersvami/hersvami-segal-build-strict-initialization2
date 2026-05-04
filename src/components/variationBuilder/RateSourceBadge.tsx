import type { PricingSourceMeta } from '../../types/domain';
import { formatCurrency } from '../../utils/helpers';

type Props = {
  meta?: PricingSourceMeta;
  onCostTypeChange?: (costType: PricingSourceMeta['costType']) => void;
};

const COST_TYPES: PricingSourceMeta['costType'][] = [
  'composite',
  'material_only',
  'labour_only',
  'pc_value',
  'hire',
  'provision',
];

export function RateSourceBadge({ meta, onCostTypeChange }: Props) {
  if (!meta) {
    return <p className="mt-1 text-[11px] text-amber-600">Manual or category default rate - source not verified</p>;
  }

  return (
    <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500">
      <span className="rounded-full bg-blue-50 px-2 py-0.5 font-medium text-blue-700">{meta.source}</span>
      <select
        value={meta.costType}
        onChange={(event) => onCostTypeChange?.(event.target.value as PricingSourceMeta['costType'])}
        className="rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[11px]"
      >
        {COST_TYPES.map((type) => <option key={type} value={type}>{type.replace('_', ' ')}</option>)}
      </select>
      {meta.escalatedRate && <span>{formatCurrency(meta.baseRate)} base to {formatCurrency(meta.escalatedRate)}</span>}
      {meta.escalationFactor && <span>Esc. x{meta.escalationFactor.toFixed(3)}</span>}
      <span>{meta.gstIncluded ? 'GST incl.' : 'GST excl.'}</span>
      <span>{meta.confidence.replace('_', ' ')}</span>
    </div>
  );
}