import { ChangeEvent } from 'react';
import type { ProjectBaseline } from '../../types/domain';
import { formatCurrency } from '../../utils/helpers';
import { describeBaseline } from '../../utils/pricing/baselineMultipliers';

type Props = {
  baseline: ProjectBaseline;
  setBaseline: (b: ProjectBaseline) => void;
  previewTradeCost: number;
};

export function BaselineStep({ baseline, setBaseline, previewTradeCost }: Props) {
  const set = (patch: Partial<ProjectBaseline>) => setBaseline({ ...baseline, ...patch });
  const num = (e: ChangeEvent<HTMLInputElement>) => Number(e.target.value) || 0;
  const heightOption = [2.4, 2.7, 3.0].includes(baseline.ceilingHeightM) ? `${baseline.ceilingHeightM}` : 'custom';

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-slate-900">Project Baseline</h3>
        <p className="text-sm text-slate-500 mt-1">
          Enter the area and default ceiling height for the quoted works only (for example: 6m² bathroom, 24m² garage conversion), not the whole house.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-slate-700">Total Floor Area (m²)</label>
          <input type="number" min={0} value={baseline.totalAreaM2 || ''} onChange={(e) => set({ totalAreaM2: num(e) })} placeholder="e.g. 120" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">Storeys</label>
          <select value={baseline.storeys} onChange={(e) => set({ storeys: e.target.value as ProjectBaseline['storeys'] })} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm">
            <option value="single">Single Storey</option>
            <option value="double">Double Storey</option>
            <option value="multi">Multi / Split Level</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">Ceiling Height</label>
          <select value={heightOption} onChange={(e) => { if (e.target.value !== 'custom') set({ ceilingHeightM: Number(e.target.value) }); }} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm">
            <option value="2.4">2.4m</option>
            <option value="2.7">2.7m</option>
            <option value="3.0">3.0m</option>
            <option value="custom">Custom</option>
          </select>
          {heightOption === 'custom' && (
            <input type="number" min={2} step={0.1} value={baseline.ceilingHeightM || ''} onChange={(e) => set({ ceilingHeightM: num(e) })} placeholder="Custom ceiling height in metres" className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          )}
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">Site Access</label>
          <select value={baseline.siteAccess} onChange={(e) => set({ siteAccess: e.target.value as ProjectBaseline['siteAccess'] })} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm">
            <option value="easy">Easy — ground level, clear access</option>
            <option value="moderate">Moderate — some restrictions</option>
            <option value="difficult">Difficult — tight access, crane needed</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">Notes</label>
          <input value={baseline.notes || ''} onChange={(e) => set({ notes: e.target.value })} placeholder="Any site-specific notes…" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
        </div>
      </div>

      {baseline.totalAreaM2 > 0 && (
        <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
          <p className="text-sm font-medium text-blue-900">Baseline: {describeBaseline(baseline)}</p>
          {previewTradeCost > 0 && (
            <p className="text-xs text-blue-700 mt-1">Trade cost before baseline adjustment: {formatCurrency(previewTradeCost)}</p>
          )}
        </div>
      )}
    </div>
  );
}