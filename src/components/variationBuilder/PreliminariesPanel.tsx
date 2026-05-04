import type { PreliminariesSettings } from '../../types/domain';
import { formatCurrency } from '../../utils/helpers';

type Props = {
  settings: PreliminariesSettings;
  baseTradeCost: number;
  onChange: (settings: PreliminariesSettings) => void;
};

export function getPreliminariesAmount(settings: PreliminariesSettings, baseTradeCost: number) {
  if (!settings.enabled) return 0;
  return settings.mode === 'fixed' ? settings.amount : Math.round(baseTradeCost * (settings.percent / 100));
}

export function PreliminariesPanel({ settings, baseTradeCost, onChange }: Props) {
  const amount = getPreliminariesAmount(settings, baseTradeCost);
  const patch = (next: Partial<PreliminariesSettings>) => onChange({ ...settings, ...next });

  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h4 className="font-semibold text-amber-950">Preliminaries</h4>
          <p className="mt-1 text-xs text-amber-800">Site setup, supervision, insurance, temporary works and scaffold allowance.</p>
        </div>
        <label className="flex items-center gap-2 text-sm text-amber-900">
          <input type="checkbox" checked={settings.enabled} onChange={(event) => patch({ enabled: event.target.checked })} />
          Include
        </label>
      </div>
      {settings.enabled && (
        <div className="mt-3 grid grid-cols-3 gap-3">
          <select value={settings.mode} onChange={(event) => patch({ mode: event.target.value as PreliminariesSettings['mode'] })} className="rounded-lg border border-amber-200 px-3 py-2 text-sm">
            <option value="percent">Percent</option>
            <option value="fixed">Fixed amount</option>
          </select>
          <input type="number" value={settings.mode === 'percent' ? settings.percent : settings.amount} onChange={(event) => patch(settings.mode === 'percent' ? { percent: Number(event.target.value) } : { amount: Number(event.target.value) })} className="rounded-lg border border-amber-200 px-3 py-2 text-sm" />
          <div className="rounded-lg bg-white px-3 py-2 text-right text-sm font-semibold text-amber-950">{formatCurrency(amount)}</div>
        </div>
      )}
    </div>
  );
}