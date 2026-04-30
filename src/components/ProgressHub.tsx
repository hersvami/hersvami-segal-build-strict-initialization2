import { useState } from 'react';
import type { Variation } from '../types/domain';
import { PhotoCapture } from './PhotoCapture';

type Props = {
  variation: Variation;
  onUpdate: (variation: Variation) => void;
};

export function ProgressHub({ variation, onUpdate }: Props) {
  const [photos, setPhotos] = useState<string[]>(variation.progressPhotos ? variation.progressPhotos.map(p => p.url) : []);
  const [updateText, setUpdateText] = useState('');

  const handleAddPhoto = (url: string | undefined) => {
    if (!url) return;
    const nextUrls = [...photos, url];
    setPhotos(nextUrls);
    const nextPhotos = [
      ...(variation.progressPhotos || []),
      { id: crypto.randomUUID(), url, caption: 'Progress', stage: 'General', date: new Date().toISOString() }
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
      changeLog: [
        ...variation.changeLog,
        { id: crypto.randomUUID(), action: 'progress-update', timestamp: now, user: 'Builder', details: updateText.trim() },
      ],
    });
    setUpdateText('');
  };

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-slate-700">Progress Photos</h4>
      {photos.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {photos.map((photo, i) => (
            <img key={i} src={photo} alt={`Progress ${i + 1}`} className="w-full h-32 object-cover rounded-lg" />
          ))}
        </div>
      )}
      <PhotoCapture label="Add Progress Photo" value={undefined} onChange={handleAddPhoto} />
      <div>
        <h4 className="text-sm font-semibold text-slate-700 mb-2">Progress Updates</h4>
        {variation.progressUpdates && variation.progressUpdates.length > 0 && (
          <div className="space-y-2 mb-3">
            {variation.progressUpdates.map((update, i) => (
              <div key={i} className="rounded-lg bg-slate-50 p-3 text-sm">
                <p className="text-slate-700">{update.text}</p>
                <p className="text-xs text-slate-400 mt-1">{new Date(update.timestamp).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        )}
        <div className="flex gap-2">
          <input value={updateText} onChange={(e) => setUpdateText(e.target.value)} placeholder="Add progress update…" className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          <button onClick={handleAddUpdate} disabled={!updateText.trim()} className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">Add</button>
        </div>
      </div>
    </div>
  );
}
