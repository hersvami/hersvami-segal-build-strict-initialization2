import { useState, useCallback, useMemo } from 'react';
import { X, Upload, FileSpreadsheet, ChevronRight, ChevronLeft, Check, AlertTriangle, MapPin } from 'lucide-react';
import { read as xlsxRead, utils as xlsxUtils } from 'xlsx';
import { TRADE_RATE_DIRECTORY } from '../utils/trades/tradeRateDirectory';


type RawRow = Record<string, unknown>;

type MappedRow = {
  trade: string;
  description: string;
  quantity: number;
  unit: string;
  rate: number;
  total: number;
  matchedCategoryId?: string;
  matchedCategoryLabel?: string;
};

type ColumnMap = {
  trade: string;
  description: string;
  quantity: string;
  unit: string;
  rate: string;
  total: string;
};

const COLUMN_HINTS: Record<keyof ColumnMap, string[]> = {
  trade: ['trade', 'trade name', 'category', 'section', 'group', 'trade category'],
  description: ['description', 'item', 'item description', 'scope', 'works', 'details', 'name'],
  quantity: ['qty', 'quantity', 'amount', 'count'],
  unit: ['unit', 'uom', 'measure', 'measurement', 'unit of measure'],
  rate: ['rate', 'unit rate', 'price', 'unit price', 'cost', 'unit cost', '$/unit'],
  total: ['total', 'line total', 'amount', 'extended', 'subtotal', 'line amount', '$ total'],
};

function detectColumn(headers: string[], field: keyof ColumnMap): string {
  const hints = COLUMN_HINTS[field];
  const lower = headers.map((h) => h.toLowerCase().trim());

  // Exact match
  for (const hint of hints) {
    const idx = lower.findIndex((h) => h === hint);
    if (idx >= 0) return headers[idx];
  }

  // Partial match
  for (const hint of hints) {
    const idx = lower.findIndex((h) => h.includes(hint) || hint.includes(h));
    if (idx >= 0) return headers[idx];
  }

  return '';
}

function parseNumber(val: unknown): number {
  if (typeof val === 'number') return val;
  if (typeof val === 'string') {
    const cleaned = val.replace(/[$,€£%\s]/g, '');
    const n = parseFloat(cleaned);
    return isNaN(n) ? 0 : n;
  }
  return 0;
}

function matchTrade(trade: string) {
  if (!trade) return { matchedCategoryId: undefined, matchedCategoryLabel: undefined };
  const needle = trade.toLowerCase();
  const match = TRADE_RATE_DIRECTORY.find((t) => {
    const tName = t.trade.toLowerCase();
    return needle.includes(tName) || tName.includes(needle) || t.keywords.some((k) => needle.includes(k.toLowerCase()));
  });
  return match
    ? { matchedCategoryId: match.categoryId, matchedCategoryLabel: match.trade }
    : { matchedCategoryId: undefined, matchedCategoryLabel: undefined };
}

type Step = 'upload' | 'map' | 'preview' | 'done';

export function SupplierQuoteUpload({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<Step>('upload');
  const [fileName, setFileName] = useState('');
  const [rawRows, setRawRows] = useState<RawRow[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [colMap, setColMap] = useState<ColumnMap>({ trade: '', description: '', quantity: '', unit: '', rate: '', total: '' });
  const [mappedRows, setMappedRows] = useState<MappedRow[]>([]);
  const [error, setError] = useState('');

  const handleFile = useCallback((file: File) => {
    setError('');
    setFileName(file.name);
    const ext = file.name.split('.').pop()?.toLowerCase();

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        if (ext === 'csv') {
          const text = e.target?.result as string;
          const wb = xlsxRead(text, { type: 'string' });
          const ws = wb.Sheets[wb.SheetNames[0]];
          const data = xlsxUtils.sheet_to_json<RawRow>(ws, { defval: '' });
          if (data.length === 0) { setError('File appears empty'); return; }
          const hdrs = Object.keys(data[0]);
          setHeaders(hdrs);
          setRawRows(data);
          autoDetectColumns(hdrs);
          setStep('map');
        } else {
          // Excel file
          const data = e.target?.result as ArrayBuffer;
          const wb = xlsxRead(data, { type: 'array' });
          const ws = wb.Sheets[wb.SheetNames[0]];
          const json = xlsxUtils.sheet_to_json<RawRow>(ws, { defval: '' });
          if (json.length === 0) { setError('File appears empty'); return; }
          const hdrs = Object.keys(json[0]);
          setHeaders(hdrs);
          setRawRows(json);
          autoDetectColumns(hdrs);
          setStep('map');
        }
      } catch {
        setError('Failed to parse file. Ensure it is a valid .xlsx or .csv file.');
      }
    };

    if (ext === 'csv') reader.readAsText(file);
    else reader.readAsArrayBuffer(file);
  }, []);

  const autoDetectColumns = (hdrs: string[]) => {
    const map: ColumnMap = { trade: '', description: '', quantity: '', unit: '', rate: '', total: '' };
    for (const field of Object.keys(COLUMN_HINTS) as (keyof ColumnMap)[]) {
      map[field] = detectColumn(hdrs, field);
    }
    setColMap(map);
  };

  const handleApplyMapping = useCallback(() => {
    if (!colMap.rate) { setError('Rate column is required'); return; }

    const mapped: MappedRow[] = rawRows.map((row) => {
      const trade = colMap.trade ? String(row[colMap.trade] || '') : '';
      const description = colMap.description ? String(row[colMap.description] || '') : '';
      const quantity = parseNumber(colMap.quantity ? row[colMap.quantity] : 1);
      const unit = colMap.unit ? String(row[colMap.unit] || '') : '';
      const rate = parseNumber(row[colMap.rate]);
      const total = colMap.total ? parseNumber(row[colMap.total]) : rate * (quantity || 1);
      const tradeMatch = matchTrade(trade || description);
      return { trade, description, quantity, unit, rate, total, ...tradeMatch };
    }).filter((r) => r.rate > 0);

    setMappedRows(mapped);
    setError('');
    setStep('preview');
  }, [colMap, rawRows]);

  const handleImport = useCallback(() => {
    // Save as rate overrides where trades match
    const OVERRIDE_KEY = 'segal_build_rate_overrides';
    const overrides: Record<string, number> = {};
    try { const raw = localStorage.getItem(OVERRIDE_KEY); if (raw) Object.assign(overrides, JSON.parse(raw)); } catch {}

    let count = 0;
    for (const row of mappedRows) {
      if (row.matchedCategoryId) {
        const dirEntry = TRADE_RATE_DIRECTORY.find((t) => t.categoryId === row.matchedCategoryId);
        if (dirEntry) {
          const key = `trade_${dirEntry.trade}`;
          // Only override if the new rate differs significantly (>5%)
          if (Math.abs(row.rate - dirEntry.rate) / dirEntry.rate > 0.05) {
            overrides[key] = row.rate;
            count++;
          }
        }
      }
    }

    localStorage.setItem(OVERRIDE_KEY, JSON.stringify(overrides));
    setStep('done');
  }, [mappedRows]);

  const summary = useMemo(() => {
    const total = mappedRows.reduce((s, r) => s + r.total, 0);
    const matched = mappedRows.filter((r) => r.matchedCategoryId).length;
    return { total, matched, unmatched: mappedRows.length - matched, count: mappedRows.length };
  }, [mappedRows]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-4xl max-h-[90vh] rounded-2xl bg-white shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 shrink-0">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Upload Supplier / Subcontractor Quote</h2>
            <p className="text-sm text-slate-500">Import line items from Excel or CSV and map to BoQ</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 hover:bg-slate-100"><X className="h-5 w-5" /></button>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2 px-6 py-3 border-b border-slate-100 shrink-0">
          {(['upload', 'map', 'preview', 'done'] as Step[]).map((s, i) => {
            const steps: Step[] = ['upload', 'map', 'preview', 'done'];
            const currentIdx = steps.indexOf(step);
            const idx = steps.indexOf(s);
            const done = idx < currentIdx;
            const active = s === step;
            const labels: Record<Step, string> = { upload: 'Upload', map: 'Map Columns', preview: 'Review', done: 'Done' };
            return (
              <div key={s} className="flex items-center gap-2">
                <div className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${done ? 'bg-emerald-600 text-white' : active ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
                  {done ? <Check className="h-3.5 w-3.5" /> : i + 1}
                </div>
                <span className={`text-sm font-medium ${active ? 'text-blue-700' : done ? 'text-emerald-700' : 'text-slate-400'}`}>{labels[s]}</span>
                {idx < 3 && <ChevronRight className="h-4 w-4 text-slate-300" />}
              </div>
            );
          })}
        </div>

        {/* Step content */}
        <div className="flex-1 overflow-y-auto">
          {step === 'upload' && (
            <div className="p-8">
              <div
                onDragOver={(e) => { e.preventDefault(); }}
                onDrop={(e) => { e.preventDefault(); if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]); }}
                className="border-2 border-dashed border-slate-300 rounded-xl p-12 text-center hover:border-blue-400 hover:bg-blue-50/50 transition-colors"
              >
                <FileSpreadsheet className="h-12 w-12 mx-auto text-slate-400 mb-3" />
                <p className="text-base font-medium text-slate-700">Drop Excel or CSV file here</p>
                <p className="text-sm text-slate-500 mt-1">.xlsx, .xls, or .csv</p>
                <input type="file" accept=".xlsx,.xls,.csv" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} className="hidden" id="supplierUpload" />
                <label htmlFor="supplierUpload" className="inline-block mt-4 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 cursor-pointer">
                  Browse Files
                </label>
              </div>
              <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                <div className="rounded-lg bg-slate-50 p-4">
                  <Upload className="h-6 w-6 mx-auto text-blue-600 mb-2" />
                  <p className="text-sm font-medium text-slate-700">Upload</p>
                  <p className="text-xs text-slate-500 mt-1">Excel or CSV quote</p>
                </div>
                <div className="rounded-lg bg-slate-50 p-4">
                  <MapPin className="h-6 w-6 mx-auto text-blue-600 mb-2" />
                  <p className="text-sm font-medium text-slate-700">Map</p>
                  <p className="text-xs text-slate-500 mt-1">Auto-detect columns</p>
                </div>
                <div className="rounded-lg bg-slate-50 p-4">
                  <Check className="h-6 w-6 mx-auto text-blue-600 mb-2" />
                  <p className="text-sm font-medium text-slate-700">Import</p>
                  <p className="text-xs text-slate-500 mt-1">Review & apply rates</p>
                </div>
              </div>
              {error && <p className="mt-4 text-sm text-red-700 bg-red-50 rounded-lg p-3 text-center">{error}</p>}
            </div>
          )}

          {step === 'map' && (
            <div className="p-6 space-y-6">
              <div className="rounded-lg bg-blue-50 border border-blue-200 p-4 text-sm text-blue-900">
                <p className="font-medium">File: {fileName}</p>
                <p className="text-blue-700 mt-0.5">{rawRows.length} rows detected · {headers.length} columns</p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-slate-900 mb-3">Column Mapping</h3>
                <p className="text-xs text-slate-500 mb-4">Confirm or adjust the detected column mapping. Rate is required; other fields are optional.</p>
                <div className="grid grid-cols-2 gap-4">
                  {(Object.keys(COLUMN_HINTS) as (keyof ColumnMap)[]).map((field) => (
                    <div key={field}>
                      <label className="block text-sm font-medium text-slate-700 capitalize mb-1">
                        {field} {field === 'rate' && <span className="text-red-500">*</span>}
                      </label>
                      <select
                        value={colMap[field]}
                        onChange={(e) => setColMap((prev) => ({ ...prev, [field]: e.target.value }))}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm bg-white"
                      >
                        <option value="">— skip —</option>
                        {headers.map((h) => <option key={h} value={h}>{h}</option>)}
                      </select>
                    </div>
                  ))}
                </div>
              </div>

              {error && <p className="text-sm text-red-700 bg-red-50 rounded-lg p-3">{error}</p>}

              <div className="flex justify-end gap-3">
                <button onClick={() => setStep('upload')} className="flex items-center gap-1 rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100">
                  <ChevronLeft className="h-4 w-4" /> Back
                </button>
                <button onClick={handleApplyMapping} className="flex items-center gap-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                  Preview Mapping <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {step === 'preview' && (
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-4 gap-3">
                <div className="rounded-lg bg-slate-50 p-3 text-center">
                  <p className="text-2xl font-bold text-slate-900">{summary.count}</p>
                  <p className="text-xs text-slate-500">Line items</p>
                </div>
                <div className="rounded-lg bg-emerald-50 p-3 text-center">
                  <p className="text-2xl font-bold text-emerald-700">{summary.matched}</p>
                  <p className="text-xs text-emerald-600">Matched to trade</p>
                </div>
                <div className="rounded-lg bg-amber-50 p-3 text-center">
                  <p className="text-2xl font-bold text-amber-700">{summary.unmatched}</p>
                  <p className="text-xs text-amber-600">Unmatched</p>
                </div>
                <div className="rounded-lg bg-blue-50 p-3 text-center">
                  <p className="text-2xl font-bold text-blue-700">${summary.total.toLocaleString()}</p>
                  <p className="text-xs text-blue-600">Total value</p>
                </div>
              </div>

              <div className="rounded-lg border border-slate-200 overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs font-semibold text-slate-500 bg-slate-50">
                      <th className="px-3 py-2">Trade / Category</th>
                      <th className="px-3 py-2">Description</th>
                      <th className="px-3 py-2 text-right">Qty</th>
                      <th className="px-3 py-2 text-right">Rate</th>
                      <th className="px-3 py-2 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mappedRows.slice(0, 50).map((row, i) => (
                      <tr key={i} className={`border-t border-slate-100 ${!row.matchedCategoryId ? 'bg-amber-50/30' : ''}`}>
                        <td className="px-3 py-2">
                          {row.matchedCategoryLabel ? (
                            <span className="inline-flex items-center gap-1 text-emerald-700">
                              <Check className="h-3 w-3" /> {row.matchedCategoryLabel}
                            </span>
                          ) : row.trade ? (
                            <span className="inline-flex items-center gap-1 text-amber-600">
                              <AlertTriangle className="h-3 w-3" /> {row.trade}
                            </span>
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </td>
                        <td className="px-3 py-2 text-slate-700 truncate max-w-[200px]">{row.description || '—'}</td>
                        <td className="px-3 py-2 text-right">{row.quantity}</td>
                        <td className="px-3 py-2 text-right">${row.rate}</td>
                        <td className="px-3 py-2 text-right font-medium">${row.total}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {mappedRows.length > 50 && (
                  <p className="text-center text-xs text-slate-500 py-2">Showing 50 of {mappedRows.length} rows</p>
                )}
              </div>

              <div className="flex justify-end gap-3">
                <button onClick={() => setStep('map')} className="flex items-center gap-1 rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100">
                  <ChevronLeft className="h-4 w-4" /> Back
                </button>
                <button onClick={handleImport} className="flex items-center gap-1 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700">
                  <Check className="h-4 w-4" /> Import {summary.matched} Rate(s)
                </button>
              </div>
            </div>
          )}

          {step === 'done' && (
            <div className="p-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4">
                <Check className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Import Complete</h3>
              <p className="text-slate-500 mt-2">{summary.matched} rate(s) imported from {fileName}</p>
              <p className="text-sm text-slate-400 mt-1">Overrides saved — they will apply to new quotes automatically</p>
              <button onClick={onClose} className="mt-6 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700">Done</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
