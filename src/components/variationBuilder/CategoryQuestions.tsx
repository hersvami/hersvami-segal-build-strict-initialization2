import type { QuoteScope } from '../../types/domain';
import { getCategoryById } from '../../utils/categories/extended';

type Props = { scope: QuoteScope; onChange: (next: QuoteScope) => void };

export function CategoryQuestions({ scope, onChange }: Props) {
  const category = getCategoryById(scope.categoryId);
  if (!category || !category.questions || category.questions.length === 0) return null;
  const answers = scope.questionAnswers || [];
  const getAnswer = (questionId: string) => answers.find(a => a.questionId === questionId)?.answer || '';
  const setAnswer = (questionId: string, answer: string) => {
    const next = answers.filter(a => a.questionId !== questionId);
    if (answer) next.push({ questionId, answer });
    const nextAnswers = { ...scope.answers };
    if (answer) nextAnswers[questionId] = answer; else delete nextAnswers[questionId];
    onChange({ ...scope, answers: nextAnswers, questionAnswers: next });
  };
  return (
    <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
      <h4 className="text-xs font-semibold uppercase text-blue-700 mb-2">Category Questions</h4>
      <div className="space-y-3">
        {category.questions.map((q) => { const current = getAnswer(q.id); return (
          <div key={q.id}><label className="text-sm font-medium text-slate-700">{q.label}</label>
            {q.type === 'select' && q.options ? (<select value={current} onChange={(e) => setAnswer(q.id, e.target.value)} className="mt-1 w-full rounded-lg border border-blue-300 px-3 py-2 text-sm bg-white"><option value="">Select...</option>{q.options.map((opt) => (<option key={opt} value={opt}>{opt}</option>))}</select>
            ) : (<input type={q.type === 'number' ? 'number' : 'text'} value={current} onChange={(e) => setAnswer(q.id, e.target.value)} className="mt-1 w-full rounded-lg border border-blue-300 px-3 py-2 text-sm bg-white" />)}
          </div>); })}
      </div>
    </div>
  );
}
