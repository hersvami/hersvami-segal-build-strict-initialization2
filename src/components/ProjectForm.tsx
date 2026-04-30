import { useState } from 'react';
import { X } from 'lucide-react';
import { PhotoCapture } from './PhotoCapture';

type Props = {
  onSubmit: (data: { name: string; address: string; customerName: string; customerEmail: string; customerPhone: string; heroPhoto?: string }) => void;
  onCancel: () => void;
};

export function ProjectForm({ onSubmit, onCancel }: Props) {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [heroPhoto, setHeroPhoto] = useState<string | undefined>();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !address.trim() || !customerName.trim() || !customerEmail.trim()) return;
    onSubmit({ name: name.trim(), address: address.trim(), customerName: customerName.trim(), customerEmail: customerEmail.trim(), customerPhone: customerPhone.trim(), heroPhoto });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 p-6">
          <h2 className="text-xl font-bold text-slate-900">New Project</h2>
          <button type="button" onClick={onCancel} className="rounded-lg p-2 hover:bg-slate-100"><X className="h-5 w-5" /></button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700">Project Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Smith Renovation" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" required />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Address</label>
            <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="e.g. 123 Main St, Melbourne VIC 3000" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-700">Customer Name</label>
              <input value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="e.g. John Smith" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" required />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Phone</label>
              <input value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} placeholder="e.g. 0412 345 678" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Email</label>
            <input type="email" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} placeholder="e.g. john@example.com" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" required />
          </div>
          <PhotoCapture label="Hero Photo (optional)" value={heroPhoto} onChange={setHeroPhoto} />
        </div>

        <div className="flex justify-end gap-3 border-t border-slate-200 p-4">
          <button type="button" onClick={onCancel} className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100">Cancel</button>
          <button type="submit" disabled={!name.trim() || !address.trim() || !customerName.trim() || !customerEmail.trim()} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">Create Project</button>
        </div>
      </form>
    </div>
  );
}
