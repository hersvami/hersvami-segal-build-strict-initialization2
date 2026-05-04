import { useState } from 'react';
import { X } from 'lucide-react';
import { PhotoCapture } from './PhotoCapture';

type Props = {
  onSubmit: (data: { name: string; address: string; customerName: string; customerEmail: string; customerPhone: string; heroPhoto?: string }) => void;
  onClose: () => void;
};

export function ProjectForm({ onSubmit, onClose }: Props) {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [heroPhoto, setHeroPhoto] = useState<string | undefined>();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, address, customerName, customerEmail, customerPhone, heroPhoto });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Create New Project</h2>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">Project Name</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Smith Renovation" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Address</label>
            <input value={address} onChange={e => setAddress(e.target.value)} placeholder="e.g. 123 Main St, Melbourne VIC 3000" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">Customer Name</label>
              <input value={customerName} onChange={e => setCustomerName(e.target.value)} placeholder="e.g. John Smith" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Phone</label>
              <input value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} placeholder="e.g. 0412 345 678" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Email</label>
            <input type="email" value={customerEmail} onChange={e => setCustomerEmail(e.target.value)} placeholder="e.g. john@example.com" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Hero Photo (optional)</label>
            <div className="mt-1">
              {heroPhoto ? (
                <div className="relative">
                  <img src={heroPhoto} alt="Hero" className="w-full h-32 object-cover rounded-lg" />
                  <button type="button" onClick={() => setHeroPhoto(undefined)} className="absolute top-2 right-2 p-1 bg-black/50 rounded text-white hover:bg-black/70">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <PhotoCapture onCapture={setHeroPhoto} />
              )}
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50">Cancel</button>
            <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">Create Project</button>
          </div>
        </form>
      </div>
    </div>
  );
}
