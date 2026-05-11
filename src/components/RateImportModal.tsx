import { useState, useCallback } from 'react';
import { X, Upload, FileText, Check, AlertTriangle } from 'lucide-react';
import { TRADE_RATE_DIRECTORY } from '../utils/trades/tradeRateDirectory';

const OVERRIDE_KEY = 'segal_build_rate_overrides';

type ImportRow = {
  trade: string;
  item?: string;
  unit: string;
  rate: number;
  matchedKey?: string;
  matchedRate?: number;
  diff?: number;
};

export function RateImportModal({ onClose }: { onClose: () => void }) {
  const [dragOver, setDragOver] = useState(false);
  const [rows, setRows] = useState<ImportRow[]>([]);
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');

  const handleFile = useCallback((file: File) => {
    setError('');
    setFileName(file.name);
    const ext = file.name.split('.').pop()?.toLowerCase();

    if (ext === 'json') {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          if (Array.isArray(data)) parseJsonRows(data);
          else if (data.rates && Array.isArray(data.rates)) parseJsonRows(data.rates);
          else setError('Invalid JSON: expected array or { rates: [...] }');
        } catch {
          setError('Failed to parse JSON file');
        }
      };
      reader.readAsText(file);
    } else if (ext === 'csv') {
      const reader = new FileReader();
      reader.onload = (e) => parseCsvRows(e.target?.result as string);
      reader.readAsText(file);
    } else {
      setError('Only .csv and .json files are supported');
    }
  }, []);

  const parseJsonRows = (data: Record<string, unknown>[]) => {
    const parsed: ImportRow[] = data.map((row) => {
      const trade = String(row.trade || row.Trade || row.name || row.Name || '');
      const item = String(row.item || row.Item || row.description || row.Description || '');
      const unit = String(row.unit || row.Unit || '').toLowerCase();
      const rate = parseFloat(String(row.rate || row.Rate || row.cost || row.Cost || 0));
      return { trade, item: item || undefined, unit, rate: isNaN(rate) ? 0 : rate };
    }).filter((r) => r.trade && r.rate > 0);
    setRows(parsed.map((r) => ({ ...r, ...matchTrade(r) })));
  };

  const parseCsvRows = (csv: string) => {
    const lines = csv.split(/\r?\n/).filter((l) => l.trim());
    if (lines.length < 2) { setError('CSV file is empty or has no data rows'); return; }

    // Try to auto-detect header columns
    const headers = lines[0].split(/[,;\t]/).map((h) => h.trim().toLowerCase());
    const colIndex: Record<string, number> = {};
    ['trade', 'name', 'item', 'description', 'unit', 'rate', 'cost'].forEach((field) => {
      const aliases = { trade: ['trade', 'trade name'], name: ['name', 'trade name'], item: ['item', 'description'], description: ['item', 'description'], unit: ['unit', 'uom', 'measure'], rate: ['rate', 'price', 'cost'], cost: ['rate', 'price', 'cost'] };
      const idx = headers.findIndex((h) => {
        const al = (aliases as Record<string, string[]>)[field] || [field];
        return al.some((a) => h.includes(a));
      });
      if (idx >= 0) colIndex[field] = idx;
    });

    const parsed: ImportRow[] = lines.slice(1).map((line) => {
      const cells = line.split(/[,;\t]/).map((c) => c.trim());
      const trade = cells[colIndex.trade ?? colIndex.name ?? 0] || '';
      const item = colIndex.item !== undefined ? cells[colIndex.item] : (colIndex.description !== undefined ? cells[colIndex.description] : '');
      const unit = cells[colIndex.unit ?? 1]?.toLowerCase() || '';
      const rate = parseFloat(cells[colIndex.rate ?? colIndex.cost ?? 2] || '0');
      return { trade, item: item || undefined, unit, rate: isNaN(rate) ? 0 : rate };
    }).filter((r) => r.trade && r.rate > 0);

    setRows(parsed.map((r) => ({ ...r, ...matchTrade(r) })));
  };

  const matchTrade = (row: ImportRow) => {
    const needle = row.trade.toLowerCase();
    const match = TRADE_RATE_DIRECTORY.find((t) => {
      const tName = t.trade.toLowerCase();
      return needle.includes(tName) || tName.includes(needle) || t.keywords.some((k) => needle.includes(k.toLowerCase()));
    });
    if (!match) return { matchedKey: undefined, matchedRate: undefined, diff: undefined };
    const key = `trade_${match.trade}`;
    const overrides: Record<string, number> = {};
    try { const raw = localStorage.getItem(OVERRIDE_KEY); if (raw) Object.assign(overrides, JSON.parse(raw)); } catch {}
    const current = overrides[key] ?? match.rate;
    return { matchedKey: key, matchedRate: current, diff: Math.round(((row.rate - current) / current) * 100) };
  };

  const handleApply = () => {
    const overrides: Record<string, number> = {};
    try { const raw = localStorage.getItem(OVERRIDE_KEY); if (raw) Object.assign(overrides, JSON.parse(raw)); } catch {}
    let count = 0;
    for (const row of rows) {
      if (row.matchedKey && row.rate > 0) {
        overrides[row.matchedKey] = row.rate;
        count++;
      }
    }
    localStorage.setItem(OVERRIDE_KEY, JSON.stringify(overrides));
    alert(`${count} rate(s) imported and saved.`);
    onClose();
  };

  const applied = rows.filter((r) => r.matchedKey).length;
  const unmatched = rows.filter((r) => !r.matchedKey).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-3xl max-h-[90vh] rounded-2xl bg-white shadow-2xl flex flex-col">
        <div className="flex items-center justify-between border-b border-slate-200 p-4 shrink-0">
          <h2 className="text-lg font-bold text-slate-900">Import Rate Sheet</h2>
          <button onClick={onClose} className="rounded-lg p-2 hover:bg-slate-100"><X className="h-5 w-5" /></button>
        </div>

        {rows.length === 0 ? (
          <div className="p-8">
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => { e.preventDefault(); setDragOver(false); if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]); }}
              className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${dragOver ? 'border-blue-400 bg-blue-50' : 'border-slate-300'}`}
            >
              <Upload className="h-10 w-10 mx-auto text-slate-400 mb-3" />
              <p className="text-sm font-medium text-slate-700">Drop CSV or JSON file here</p>
              <p className="text-xs text-slate-500 mt-1">or click to browse</p>
              <input type="file" accept=".csv,.json" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} className="hidden" id="rateImport" />
              <label htmlFor="rateImport" className="inline-block mt-3 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 cursor-pointer">
                Browse Files
              </label>
            </div>
            <div className="mt-6 space-y-2 text-xs text-slate-500">
              <h3 className="font-semibold text-slate-700">Expected format:</h3>
              <div className="rounded-lg bg-slate-50 p-3 font-mono">
                <p><span className="text-slate-400">// JSON:</span> [{`{ "trade": "Carpenter", "rate": 95, "unit": "allow" }`}]</p>
                <p className="mt-1"><span className="text-slate-400">// CSV:</span> trade,unit,rate</p>
              </div>
              <p>Columns detected: <code className="bg-slate-100 px-1 rounded">trade</code> (required), <code className="bg-slate-100 px-1 rounded">rate</code> (required), <code className="bg-slate-100 px-1 rounded">unit</code>, <code className="bg-slate-100 px-1 rounded">item</code>, <code className="bg-slate-100 px-1 rounded">description</code>, <code className="bg-slate-100 px-1 rounded">cost</code></p>
            </div>
          </div>
        ) : (
          <>
            <div className="px-4 py-3 border-b border-slate-100 shrink-0">
              <div className="flex items-center gap-3 text-sm">
                <FileText className="h-4 w-4 text-slate-400" />
                <span className="font-medium">{fileName}</span>
                <span className="text-slate-500">— {rows.length} rates</span>
                {applied > 0 && <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-700">{applied} matched</span>}
                {unmatched > 0 && <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-700">{unmatched} unmatched</span>}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-white">
                  <tr className="text-left text-xs font-semibold text-slate-500 border-b border-slate-200">
                    <th className="px-4 py-2">Trade</th>
                    <th className="px-3 py-2 text-right">Imported Rate</th>
                    <th className="px-3 py-2 text-right">Current Rate</th>
                    <th className="px-3 py-2 text-right">Change</th>
                    <th className="px-3 py-2 text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, i) => (
                    <tr key={i} className={`border-b border-slate-100 ${!row.matchedKey ? 'bg-amber-50/50' : ''}`}>
                      <td className="px-4 py-2">
                        <p className="font-medium text-slate-900">{row.trade}{row.item && <span className="text-xs text-slate-400 ml-1">— {row.item}</span>}</p>
                      </td>
                      <td className="px-3 py-2 text-right font-medium">${row.rate}</td>
                      <td className="px-3 py-2 text-right text-slate-500">{row.matchedRate != null ? `$${row.matchedRate}` : '—'}</td>
                      <td className="px-3 py-2 text-right">
                        {row.diff != null && (
                          <span className={row.diff > 0 ? 'text-emerald-600' : row.diff < 0 ? 'text-red-600' : 'text-slate-500'}>
                            {row.diff > 0 ? '+' : ''}{row.diff}%
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-2 text-center">
                        {row.matchedKey ? (
                          <Check className="h-4 w-4 text-emerald-600 inline" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-amber-500 inline" />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {error && <p className="px-4 py-2 text-sm text-red-700 bg-red-50 border-t border-red-100">{error}</p>}

            <div className="border-t border-slate-200 p-4 flex justify-end gap-3 shrink-0">
              <button onClick={onClose} className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100">Cancel</button>
              <button onClick={handleApply} disabled={applied === 0} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">Apply {applied} Rate(s)</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
