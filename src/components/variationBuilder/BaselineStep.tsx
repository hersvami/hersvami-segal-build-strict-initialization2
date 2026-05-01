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
  
  // Helper to safely parse numbers
  const num = (val: string) => {
    const n = parseFloat(val);
    return isNaN(n) ? 0 : n;
  };

  // Determine if current height is a standard option
  const h = baseline.ceilingHeightM;
  const isStandard = (h === 2.4 || h === 2.7 || h === 3.0);
  
  // The value for the select must EXACTLY match the option value strings
  const selectValue = isStandard ? h.toString() : 'custom';

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-slate-900">Project Baseline</h3>
        <p className="text-sm text-slate-500 mt-1">
          Enter the area and default ceiling height for the quoted works only.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Total Floor Area */}
        <div>
          <label className="text-sm font-medium text-slate-700">Total Floor Area (m²)</label>
          <input 
            type="number" 
            min={0} 
            value={baseline.totalAreaM2 || ''} 
            onChange={(e) => set({ totalAreaM2: num(e.target.value) })} 
            placeholder="e.g. 120" 
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" 
          />
        </div>

        {/* Storeys */}
        <div>
          <label className="text-sm font-medium text-slate-700">Storeys</label>
          <select 
            value={baseline.storeys} 
            onChange={(e) => set({ storeys: e.target.value as ProjectBaseline['storeys'] })} 
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="single">Single Storey</option>
            <option value="double">Double Storey</option>
            <option value="multi">Multi / Split Level</option>
          </select>
        </div>

        {/* Ceiling Height - FIXED CUSTOM INPUT LOGIC */}
        <div>
          <label className="text-sm font-medium text-slate-700">Ceiling Height</label>
          <select 
            value={selectValue} 
            onChange={(e) => { 
              const val = e.target.value;
              if (val === 'custom') {
                // Set a sensible default when switching to custom, but keep the input visible
                set({ ceilingHeightM: 2.5 }); 
              } else {
                set({ ceilingHeightM: parseFloat(val) });
              }
            }} 
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="2.4">2.4m</option>
            <option value="2.7">2.7m</option>
            <option value="3.0">3.0m</option>
            <option value="custom">Custom...</option>
          </select>
          
          {/* This input now reliably appears when 'custom' is selected */}
          {selectValue === 'custom' && (
            <input 
              type="number" 
              min={2} 
              step={0.1} 
              value={baseline.ceilingHeightM} 
              onChange={(e) => set({ ceilingHeightM: num(e.target.value) })} 
              placeholder="Enter height in metres" 
              className="mt-2 w-full rounded-lg border border-blue-300 bg-blue-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
            />
          )}
        </div>

        {/* Site Access */}
        <div>
          <label className="text-sm font-medium text-slate-700">Site Access</label>
          <select 
            value={baseline.siteAccess} 
            onChange={(e) => set({ siteAccess: e.target.value as ProjectBaseline['siteAccess'] })} 
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="easy">Easy — ground level, clear access</option>
            <option value="moderate">Moderate — some restrictions</option>
            <option value="difficult">Difficult — tight access, crane needed</option>
          </select>
        </div>

        {/* Notes */}
        <div>
          <label className="text-sm font-medium text-slate-700">Notes</label>
          <input 
            value={baseline.notes || ''} 
            onChange={(e) => set({ notes: e.target.value })} 
            placeholder="Any site-specific notes…" 
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" 
          />
        </div>
      </div>

      {/* Summary Card */}
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