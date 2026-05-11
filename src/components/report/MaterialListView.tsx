import { useState } from 'react';
import { Download, Plus, Trash2, ChevronDown, ChevronUp, Settings } from 'lucide-react';
import type { Company, Project, Variation, MaterialItem, MaterialPreferences } from '../../types/domain';
import { generateMaterialList, DEFAULT_PREFERENCES } from '../../utils/pricing/materialTakeoff';
import { generateMaterialListPDF } from '../../utils/pdfGenerator';
import { formatCurrency } from '../../utils/helpers';

type Props = { variation: Variation; project: Project; company: Company };

export function MaterialListView({ variation, project, company }: Props) {
  const [prefs, setPrefs] = useState<MaterialPreferences>(DEFAULT_PREFERENCES);
  const [showPrefs, setShowPrefs] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
  const [materials, setMaterials] = useState<MaterialItem[]>([]);

  const handleGenerate = () => {
    if (variation.baseline) {
      setMaterials(generateMaterialList(variation.scopes, variation.baseline, prefs));
      setIsGenerated(true);
    }
  };

  const handleAddItem = () => {
    setMaterials((prev) => [...prev, { id: `mat-${Date.now()}`, category: 'Custom', description: 'New Item', quantity: 1, unit: 'each', estimatedCost: 0 }]);
  };

  const handleUpdateItem = (index: number, patch: Partial<MaterialItem>) => {
    setMaterials((prev) => prev.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  };

  const handleRemoveItem = (index: number) => {
    setMaterials((prev) => prev.filter((_, i) => i !== index));
  };

  const totalCost = materials.reduce((sum, item) => sum + item.estimatedCost, 0);
  const handleExport = () => { generateMaterialListPDF(project, variation, materials, company); };

  if (!isGenerated) {
    return (
      <div className="p-6 space-y-6">
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Generate Material List</h3>
          <p className="text-sm text-slate-500 mb-6">Set your product preferences below, then click Generate.</p>
          <div className="bg-slate-50 rounded-lg p-4 mb-6">
            <button onClick={() => setShowPrefs(!showPrefs)} className="flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-blue-700">
              <Settings className="h-4 w-4" /> {showPrefs ? 'Hide Preferences' : 'Show Preferences'}
              {showPrefs ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
            {showPrefs && (
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <h4 className="text-sm font-bold text-slate-700 col-span-full mt-2">Tiles & Stone</h4>
                <PrefSelect label="Tile Size" value={prefs.tileSize} onChange={(v) => setPrefs((p) => ({ ...p, tileSize: v as any }))} options={['300x300', '600x600', '800x800']} />
                <PrefSelect label="Tile Type" value={prefs.tileType} onChange={(v) => setPrefs((p) => ({ ...p, tileType: v as any }))} options={['Ceramic', 'Porcelain', 'Natural Stone']} />
                <h4 className="text-sm font-bold text-slate-700 col-span-full mt-2">Timber & Decking</h4>
                <PrefSelect label="Decking Size" value={prefs.deckingProfile} onChange={(v) => setPrefs((p) => ({ ...p, deckingProfile: v as any }))} options={['90x19', '140x19', '140x25', '185x22']} />
                <PrefSelect label="Decking Timber" value={prefs.deckingTimber} onChange={(v) => setPrefs((p) => ({ ...p, deckingTimber: v as any }))} options={['Merbau', 'Spotted Gum', 'Blackbutt', 'Treated Pine']} />
                <h4 className="text-sm font-bold text-slate-700 col-span-full mt-2">Flooring & Carpet</h4>
                <PrefSelect label="Flooring Type" value={prefs.flooringType} onChange={(v) => setPrefs((p) => ({ ...p, flooringType: v as any }))} options={['Engineered Timber', 'Solid Timber', 'Bamboo', 'Hybrid', 'Laminate']} />
                <PrefSelect label="Flooring Width" value={prefs.flooringWidth} onChange={(v) => setPrefs((p) => ({ ...p, flooringWidth: v as any }))} options={['110mm', '150mm', '190mm', '220mm']} />
                <PrefSelect label="Carpet Grade" value={prefs.carpetGrade} onChange={(v) => setPrefs((p) => ({ ...p, carpetGrade: v as any }))} options={['Standard Nylon', 'Premium Wool', 'Triexta']} />
                <h4 className="text-sm font-bold text-slate-700 col-span-full mt-2">Bathroom & Kitchen</h4>
                <PrefSelect label="Shower Screen" value={prefs.showerScreenType} onChange={(v) => setPrefs((p) => ({ ...p, showerScreenType: v as any }))} options={['Semi-Frameless', 'Frameless', 'Semi-Frameless (900x900)', 'Frameless (1200x2000)']} />
                <PrefSelect label="Vanity Size" value={prefs.vanitySize} onChange={(v) => setPrefs((p) => ({ ...p, vanitySize: v as any }))} options={['600mm', '900mm', '1200mm', 'Custom']} />
                <PrefSelect label="Benchtop" value={prefs.benchtopMaterial} onChange={(v) => setPrefs((p) => ({ ...p, benchtopMaterial: v as any }))} options={['Laminate', 'Stone (Caesarstone)', 'Porcelain', 'Timber']} />
                <h4 className="text-sm font-bold text-slate-700 col-span-full mt-2">Painting & Insulation</h4>
                <PrefSelect label="Paint Finish" value={prefs.paintFinish} onChange={(v) => setPrefs((p) => ({ ...p, paintFinish: v as any }))} options={['Flat', 'Low Sheen', 'Semi-Gloss', 'Gloss']} />
                <PrefSelect label="Paint Brand" value={prefs.paintBrand} onChange={(v) => setPrefs((p) => ({ ...p, paintBrand: v as any }))} options={['Dulux', 'Taubmans', 'Wattyl']} />
                <PrefSelect label="Insulation" value={prefs.insulationType} onChange={(v) => setPrefs((p) => ({ ...p, insulationType: v as any }))} options={['Glasswool R2.0', 'Glasswool R2.5', 'Glasswool R3.5', 'Polyester R2.0']} />
                <PrefSelect label="Window Type" value={prefs.windowType} onChange={(v) => setPrefs((p) => ({ ...p, windowType: v as any }))} options={['Aluminium', 'Timber', 'uPVC']} />
              </div>
            )}
          </div>
          <button onClick={handleGenerate} disabled={!variation.baseline} className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
            Generate Material List
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold text-slate-900">Estimated Material List</h3>
          <button onClick={() => setIsGenerated(false)} className="text-sm text-blue-600 hover:underline">Change Preferences</button>
        </div>
        <div className="flex gap-2">
          <button onClick={handleAddItem} className="flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200"><Plus className="h-4 w-4" /> Add Item</button>
          <button onClick={handleExport} className="flex items-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-700"><Download className="h-4 w-4" /> Export PDF</button>
        </div>
      </div>
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-sm whitespace-nowrap">
          <thead>
            <tr className="bg-slate-50 text-left text-xs font-semibold uppercase text-slate-500">
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3 min-w-[200px]">Description</th>
              <th className="px-4 py-3 text-right">Qty</th>
              <th className="px-4 py-3 text-right">Unit</th>
              <th className="px-4 py-3 text-right">Est. Cost</th>
              <th className="px-4 py-3 w-10"></th>
            </tr>
          </thead>
          <tbody>
            {materials.map((item, i) => (
              <tr key={item.id} className="border-t border-slate-100 hover:bg-slate-50">
                <td className="px-4 py-2"><input value={item.category} onChange={(e) => handleUpdateItem(i, { category: e.target.value })} className="w-full bg-transparent border-none text-sm text-slate-700 focus:ring-0" /></td>
                <td className="px-4 py-2"><input value={item.description} onChange={(e) => handleUpdateItem(i, { description: e.target.value })} className="w-full bg-transparent border-none text-sm text-slate-900 font-medium focus:ring-0" /></td>
                <td className="px-4 py-2"><input type="number" value={item.quantity} onChange={(e) => handleUpdateItem(i, { quantity: Number(e.target.value) })} className="w-20 bg-transparent border-none text-sm text-right text-slate-700 focus:ring-0" /></td>
                <td className="px-4 py-2 text-right"><input value={item.unit} onChange={(e) => handleUpdateItem(i, { unit: e.target.value })} className="w-16 bg-transparent border-none text-sm text-right text-slate-500 focus:ring-0" /></td>
                <td className="px-4 py-2 text-right"><input type="number" value={item.estimatedCost} onChange={(e) => handleUpdateItem(i, { estimatedCost: Number(e.target.value) })} className="w-24 bg-transparent border-none text-sm text-right text-slate-900 font-medium focus:ring-0" /></td>
                <td className="px-4 py-2"><button onClick={() => handleRemoveItem(i)} className="text-slate-400 hover:text-red-600"><Trash2 className="h-3.5 w-3.5" /></button></td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-slate-200 bg-slate-50">
              <td colSpan={4} className="px-4 py-3 text-right font-bold text-slate-900">Total Estimated Material Cost:</td>
              <td className="px-4 py-3 text-right font-bold text-blue-700">{formatCurrency(totalCost)}</td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

function PrefSelect({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-500 mb-1">{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none">
        {options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    </div>
  );
}
