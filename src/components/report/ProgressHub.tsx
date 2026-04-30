import { useState } from 'react';
import type { Variation } from '../../types/domain';
import { PhotoCapture } from '../PhotoCapture';

type Props = {
  variation: Variation;
  onUpdate: (variation: Variation) => void;
};

export function ProgressHub({ variation, onUpdate }: Props) {
  const [updateText, setUpdateText] = useState('');

  const handleAddPhoto = (url: string | undefined) => {
    if (!url) return;
    const nextPhotos = [
      ...(variation.progressPhotos || []),
      { id: crypto.randomUUID(), url, caption: 'Progress', stage: 'General', date: new Date().toISOString() },
    ];
    onUpdate({ ...variation, progressPhotos: nextPhotos, updatedAt: new Date().toISOString() });
  };

  const handleAddUpdate = () => {
    if (!updateText.trim()) return;
    const now = new Date().toISOString();
    onUpdate({
      ...variation,
      updatedAt: now,
      progressUpdates: [...(variation.progressUpdates || []), { text: updateText.trim(), timestamp: now }],
    });
    setUpdateText('');
  };

  return (
    <div className="space-y-4 p-4">
      <PhotoCapture label="Add Progress Photo" value={undefined} onChange={handleAddPhoto} />
      <div className="flex gap-2">
        <input
          value={updateText}
          onChange={(e) => setUpdateText(e.target.value)}
          placeholder="Add progress update..."
          className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
        <button
          onClick={handleAddUpdate}
          disabled={!updateText.trim()}
          className="rounded-lg bg-blue-600 px-3 py-2 text-sm text-white disabled:opacity-50"
        >
          Add
        </button>
      </div>
    </div>
  );
}