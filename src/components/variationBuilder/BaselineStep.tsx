import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import type { ProjectBaseline, ModuleType } from '../../types/domain';
import { formatCurrency } from '../../utils/helpers';
import { describeBaseline } from '../../utils/pricing/baselineMultipliers';

type Props = { baseline: ProjectBaseline; setBaseline: (b: ProjectBaseline) => void; previewTradeCost: number };

const MODULES: { id: ModuleType; label: string; icon: string; desc: string }[] = [
  { id: 'generic', label: 'General Building', icon: '🏠', desc: 'Renovations, interiors, general works' },
  { id: 'decking', label: 'Decking & Pergolas', icon: '🪵', desc: 'Decks, patios, outdoor structures' },
  { id: 'bathroom', label: 'Bathroom / Wet Area', icon: '🚿', desc: 'Full bathroom renovations' },
  { id: 'kitchen', label: 'Kitchen', icon: '🍳', desc: 'Kitchen renovations & joinery' },
  { id: 'laundry', label: 'Laundry', icon: '🧺', desc: 'Laundry fitouts' },
  { id: 'grannyFlat', label: 'Granny Flat / DPU', icon: '🏡', desc: 'Secondary dwellings' },
  { id: 'extension', label: 'Extension', icon: '🏗️', desc: 'Room additions & upper storey' },
  { id: 'landscaping', label: 'Landscaping', icon: '🌿', desc: 'Gardens, paving, retaining' },
  { id: 'pool', label: 'Pool & Spa', icon: '🏊', desc: 'Swimming pools & spas' },
];

export function BaselineStep({ baseline, setBaseline, previewTradeCost }: Props) {
  const set = (patch: Partial<ProjectBaseline>) => setBaseline({ ...baseline, ...patch });
  const num = (val: string) => { const n = parseFloat(val); return isNaN(n) ? 0 : n; };
  
  const h = baseline.ceilingHeightM;
  const isStandard = (h === 2.4 || h === 2.7 || h === 3.0);
  const selectValue = isStandard ? h.toString() : 'custom';

  const isDeckModule = baseline.moduleType === 'decking' || baseline.moduleType === 'landscaping' || baseline.moduleType === 'pool';
  const isBuildingModule = !isDeckModule;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-slate-900">What are you building?</h3>
        <p className="text-sm text-slate-500 mt-1">Select the project type to show relevant fields.</p>
      </div>

      {/* MODULE SELECTOR GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {MODULES.map((mod) => (
          <button
            key={mod.id}
            onClick={() => set({ moduleType: mod.id })}
            className={`flex flex-col items-start p-4 rounded-xl border-2 transition-all text-left ${
              baseline.moduleType === mod.id 
                ? 'border-blue-600 bg-blue-50 ring-1 ring-blue-600' 
                : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'
            }`}
          >
            <span className="text-2xl mb-2">{mod.icon}</span>
            <span className={`font-semibold text-sm ${baseline.moduleType === mod.id ? 'text-blue-900' : 'text-slate-900'}`}>
              {mod.label}
            </span>
            <span className="text-xs text-slate-500 mt-1">{mod.desc}</span>
          </button>
        ))}
      </div>

      <div className="border-t border-slate-200 pt-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">
          {isDeckModule ? 'Deck / External Dimensions' : 'Building Dimensions'}
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* DECK SPECIFIC FIELDS */}
          {isDeckModule && (
            <>
              <div>
                <label className="text-sm font-medium text-slate-700">Length (m)</label>
                <input 
                  type="number" min={0} step={0.1}
                  value={baseline.deckLengthM || ''} 
                  onChange={(e) => {
                    const val = num(e.target.value);
                    set({ deckLengthM: val, totalAreaM2: val * (baseline.deckWidthM || 0) });
                  }} 
                  placeholder="e.g. 6.0" 
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" 
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Width (m)</label>
                <input 
                  type="number" min={0} step={0.1}
                  value={baseline.deckWidthM || ''} 
                  onChange={(e) => {
                    const val = num(e.target.value);
                    set({ deckWidthM: val, totalAreaM2: (baseline.deckLengthM || 0) * val });
                  }} 
                  placeholder="e.g. 6.0" 
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" 
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Height from Ground (m)</label>
                <input 
                  type="number" min={0} step={0.1}
                  value={baseline.deckHeightFromGroundM || ''} 
                  onChange={(e) => set({ deckHeightFromGroundM: num(e.target.value) })} 
                  placeholder="e.g. 1.0" 
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" 
                />
                <p className="text-xs text-slate-500 mt-1">Determines stump height & bracing requirements</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Deck Material</label>
                <select 
                  value={baseline.deckMaterial || 'merbau'} 
                  onChange={(e) => set({ deckMaterial: e.target.value as any })} 
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                >
                  <option value="merbau">Merbau Hardwood</option>
                  <option value="treated_pine">Treated Pine</option>
                  <option value="composite">Composite</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Soil Type (for Stumps)</label>
                <select 
                  value={baseline.soilType || 'medium'} 
                  onChange={(e) => set({ soilType: e.target.value as any })} 
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                >
                  <option value="soft">Soft / Sandy</option>
                  <option value="medium">Medium Clay (Standard)</option>
                  <option value="hard">Hard / Rock</option>
                </select>
              </div>
            </>
          )}

          {/* BUILDING SPECIFIC FIELDS (Generic, Bathroom, Kitchen, etc.) */}
          {isBuildingModule && (
            <>
              <div>
                <label className="text-sm font-medium text-slate-700">Total Floor Area (m²)</label>
                <input 
                  type="number" min={0} 
                  value={baseline.totalAreaM2 || ''} 
                  onChange={(e) => set({ totalAreaM2: num(e.target.value) })} 
                  placeholder="e.g. 120" 
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" 
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Storeys</label>
                <select 
                  value={baseline.storeys} 
                  onChange={(e) => set({ storeys: e.target.value as any })} 
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                >
                  <option value="single">Single Storey</option>
                  <option value="double">Double Storey</option>
                  <option value="multi">Multi / Split Level</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Ceiling Height</label>
                <select 
                  value={selectValue} 
                  onChange={(e) => { 
                    const val = e.target.value; 
                    if (val === 'custom') set({ ceilingHeightM: 2.5 }); 
                    else set({ ceilingHeightM: parseFloat(val) }); 
                  }} 
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                >
                  <option value="2.4">2.4m (Standard)</option>
                  <option value="2.7">2.7m</option>
                  <option value="3.0">3.0m</option>
                  <option value="custom">Custom...</option>
                </select>
                {selectValue === 'custom' && (
                  <input 
                    type="number" min={2} step={0.1} 
                    value={baseline.ceilingHeightM} 
                    onChange={(e) => set({ ceilingHeightM: num(e.target.value) })} 
                    placeholder="Enter height in metres" 
                    className="mt-2 w-full rounded-lg border border-blue-300 bg-blue-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  />
                )}
              </div>
            </>
          )}

          {/* COMMON FIELDS */}
          <div>
            <label className="text-sm font-medium text-slate-700">Site Access</label>
            <select 
              value={baseline.siteAccess} 
              onChange={(e) => set({ siteAccess: e.target.value as any })} 
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            >
              <option value="easy">Easy — ground level, clear access</option>
              <option value="moderate">Moderate — some restrictions</option>
              <option value="difficult">Difficult — tight access, crane needed</option>
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="text-sm font-medium text-slate-700">Notes</label>
            <input 
              value={baseline.notes || ''} 
              onChange={(e) => set({ notes: e.target.value })} 
              placeholder="Any site-specific notes…" 
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" 
            />
          </div>
        </div>
      </div>

      {/* SUMMARY */}
      {(baseline.totalAreaM2 > 0 || (baseline.deckLengthM && baseline.deckWidthM)) && (
        <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
          <p className="text-sm font-medium text-blue-900">
            {isDeckModule 
              ? `Deck: ${baseline.deckLengthM}m x ${baseline.deckWidthM}m (${(baseline.deckLengthM! * baseline.deckWidthM!).toFixed(1)} m²) • ${baseline.deckHeightFromGroundM}m high • ${baseline.deckMaterial}`
              : describeBaseline(baseline)
            }
          </p>
          {previewTradeCost > 0 && (
            <p className="text-xs text-blue-700 mt-1">Trade cost before adjustment: {formatCurrency(previewTradeCost)}</p>
          )}
        </div>
      )}
    </div>
  );
}