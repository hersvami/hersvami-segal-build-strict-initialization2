import { AlertCircle, CheckCircle2, Loader2, Sparkles, Zap } from 'lucide-react';
import type { ReactNode } from 'react';

type Props = { documentType: 'quote' | 'variation'; scopeInput: string; setScopeInput: (value: string) => void; geminiKey: string; setGeminiKey: (value: string) => void; apiPolishing: boolean; isAnalysing: boolean; varRefQuote: string; setVarRefQuote: (value: string) => void; varReason: string; setVarReason: (value: string) => void; approvedQuotes: Array<{ id: string; title: string }>; lastAiModel: string; recogniseFeedback?: string; analysisFallback: boolean; hasTradeAnalyses: boolean; keyRestored?: boolean; onRecognise: () => void; onPolish: () => Promise<void> };

export function ScopeInputPanel({ documentType, scopeInput, setScopeInput, geminiKey, setGeminiKey, apiPolishing, isAnalysing, varRefQuote, setVarRefQuote, varReason, setVarReason, approvedQuotes, lastAiModel, recogniseFeedback, analysisFallback, hasTradeAnalyses, keyRestored, onRecognise, onPolish }: Props) {
  return (
    <div className="space-y-5">
      {documentType === 'variation' && (<Card><h3 className="font-semibold text-amber-900">Variation Details</h3><div className="mt-3 space-y-3"><select value={varRefQuote} onChange={(e) => setVarRefQuote(e.target.value)} className="w-full rounded-lg border border-amber-300 px-3 py-2 text-sm"><option value="">Reference Quote...</option>{approvedQuotes.map((q) => (<option key={q.id} value={q.id}>{q.title}</option>))}</select><select value={varReason} onChange={(e) => setVarReason(e.target.value)} className="w-full rounded-lg border border-amber-300 px-3 py-2 text-sm"><option value="">Reason for Change...</option>{['Client Request', 'Site Condition', 'Design Change', 'Compliance', 'Other'].map((r) => (<option key={r} value={r}>{r}</option>))}</select></div></Card>)}
      <div className="space-y-3">
        <label className="block space-y-1"><span className="text-sm font-medium text-slate-700">Describe the scope of works</span><textarea value={scopeInput} onChange={(e) => setScopeInput(e.target.value)} placeholder="Paste or write the full scope here." rows={8} className="w-full resize-y rounded-xl border border-slate-300 px-4 py-3 text-sm leading-relaxed outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200" style={{ minHeight: '220px' }} /></label>
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" onClick={onRecognise} disabled={isAnalysing || !scopeInput.trim()} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">{isAnalysing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}{isAnalysing ? 'Analysing…' : 'Recognise Categories'}</button>
          {geminiKey && (<button type="button" onClick={onPolish} disabled={apiPolishing || !scopeInput.trim()} className="inline-flex items-center gap-1.5 rounded-lg bg-purple-600 px-3 py-2 text-sm text-white hover:bg-purple-700 disabled:opacity-50"><Sparkles className="h-4 w-4" />{apiPolishing ? 'Polishing…' : 'Polish with AI'}</button>)}
          {recogniseFeedback && (<span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-xs text-blue-700"><CheckCircle2 className="h-3.5 w-3.5" /> {recogniseFeedback}</span>)}
          {analysisFallback && hasTradeAnalyses && (<span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs text-amber-700"><AlertCircle className="h-3.5 w-3.5" /> Keyword fallback — add Gemini key for pre-filled quantities</span>)}
        </div>
        {geminiKey ? (<div className="flex flex-wrap items-center gap-2 text-xs"><span className="rounded-full bg-green-100 px-2 py-0.5 text-green-700">✨ AI Key Active</span>{keyRestored && <span className="rounded-full bg-blue-50 px-2 py-0.5 text-blue-700">Restored from previous session</span>}{lastAiModel && <span className="text-slate-400">Last used: {lastAiModel}</span>}<button type="button" onClick={() => setGeminiKey('')} className="ml-auto text-slate-400 underline hover:text-red-500">Clear key</button></div>
        ) : (<Card><label className="text-xs font-medium text-slate-600">Gemini API Key — unlocks pre-filled quantities per trade</label><input value={geminiKey} onChange={(e) => setGeminiKey(e.target.value)} placeholder="Paste your Gemini API key…" className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-xs" /><a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-xs text-blue-500 hover:underline">Get free API key from Google AI Studio →</a></Card>)}
      </div>
    </div>
  );
}

function Card({ children }: { children: ReactNode }) {
  return <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">{children}</div>;
}
