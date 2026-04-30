import type { QuoteScope } from '../../types/domain';
import type { getCategoryById } from '../../utils/categories/extended';
import { DimensionInput } from './DimensionInput';
import { needsAreaHeightOverride } from './scopePricing';

type Props = { category: ReturnType<typeof getCategoryById> | undefined; scope: QuoteScope; onChange: (patch: Partial<QuoteScope>) => void };

export function ScopeDimensions({ category, scope, onChange }: Props) {
  const mode = category?.dimensionMode ?? 'area';
  const setDim = (key: 'width' | 'length' | 'height', value: number) => onChange({ dimensions: { ...scope.dimensions, [key]: value } });
  if (needsAreaHeightOverride(scope.categoryId)) return <DimensionGrid labels={['Area (m²)', 'Height (m)']} keys={['width', 'height']} scope={scope} setDim={setDim} />;
  if (mode === 'none' || mode === 'item') return null;
  if (mode === 'linear') return <DimensionGrid labels={['Length (m)']} keys={['length']} scope={scope} setDim={setDim} />;
  if (mode === 'wall') return <DimensionGrid labels={['Length (m)', 'Height (m)']} keys={['length', 'height']} scope={scope} setDim={setDim} />;
  if (mode === 'roof') return <DimensionGrid labels={['Roof width (m)', 'Roof length (m)']} keys={['width', 'length']} scope={scope} setDim={setDim} />;
  if (mode === 'room') return <DimensionGrid labels={['Width (m)', 'Length (m)', 'Height (m)']} keys={['width', 'length', 'height']} scope={scope} setDim={setDim} />;
  return <DimensionGrid labels={['Width (m)', 'Length (m)']} keys={['width', 'length']} scope={scope} setDim={setDim} />;
}

function DimensionGrid({ labels, keys, scope, setDim }: { labels: string[]; keys: Array<'width' | 'length' | 'height'>; scope: QuoteScope; setDim: (key: 'width' | 'length' | 'height', value: number) => void }) {
  const cols = keys.length === 3 ? 'grid-cols-3' : keys.length === 2 ? 'grid-cols-2' : 'grid-cols-1';
  return <div className={`grid gap-3 ${cols}`}>{keys.map((key, index) => <DimensionInput key={key} label={labels[index]} value={scope.dimensions[key]} onChange={(value) => setDim(key, value)} />)}</div>;
}