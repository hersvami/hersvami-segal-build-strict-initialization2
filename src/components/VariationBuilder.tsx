import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import type { Project, Variation } from '../types/domain';
import { BuilderHeader } from './variationBuilder/BuilderHeader';
import { BuilderStepContent } from './variationBuilder/BuilderStepContent';
import { moveStep } from './variationBuilder/builderShared';
import { useVariationBuilderController } from './variationBuilder/useVariationBuilderController';

type Props = {
  project: Project;
  documentType: 'quote' | 'variation';
  existingQuotes: Variation[];
  companyOH: number;
  companyProfit: number;
  onSave: (variation: Variation) => void;
  onCancel: () => void;
};

export function VariationBuilder(props: Props) {
  const c = useVariationBuilderController(props);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="flex max-h-[90vh] w-full max-w-4xl flex-col rounded-2xl bg-white shadow-2xl">
        <BuilderHeader documentType={props.documentType} step={c.step} baseline={c.baseline} baselineAdj={c.baselineAdj} onCancel={props.onCancel} />
        <main className="flex-1 overflow-y-auto p-6"><BuilderStepContent {...c.stepProps} /></main>
        <footer className="flex shrink-0 justify-between border-t border-slate-200 p-4">
          <button onClick={() => moveStep(c.step, c.setStep, -1)} disabled={c.step === 'baseline'} className="flex items-center gap-2 rounded-lg px-4 py-2 text-slate-600 hover:bg-slate-100 disabled:opacity-50"><ArrowLeft className="h-4 w-4" /> Back</button>
          {c.step === 'review' ? (
            <button onClick={c.handleSave} className="flex items-center gap-2 rounded-lg bg-emerald-600 px-6 py-2 font-medium text-white hover:bg-emerald-700"><Check className="h-4 w-4" /> Save {props.documentType === 'quote' ? 'Quote' : 'Variation'}</button>
          ) : (
            <button onClick={() => c.canNext && moveStep(c.step, c.setStep, 1)} disabled={!c.canNext} className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50">Next <ArrowRight className="h-4 w-4" /></button>
          )}
        </footer>
      </div>
    </div>
  );
}