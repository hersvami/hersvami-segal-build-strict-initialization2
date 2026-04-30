import { useState } from 'react';
import { Send, User } from 'lucide-react';
import type { Project } from '../types/domain';

type Props = { project: Project };

export function ProjectChat({ project }: Props) {
  const [activeTab, setActiveTab] = useState<'notes' | 'contact'>('notes');
  const [notes, setNotes] = useState('');
  const [message, setMessage] = useState('');

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
      <div className="flex border-b border-slate-200">
        <button onClick={() => setActiveTab('notes')} className={`flex-1 py-3 text-sm font-medium ${activeTab === 'notes' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500'}`}>Internal Notes</button>
        <button onClick={() => setActiveTab('contact')} className={`flex-1 py-3 text-sm font-medium ${activeTab === 'contact' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500'}`}>Contact Customer</button>
      </div>
      <div className="p-4">
        {activeTab === 'notes' ? (
          <div className="space-y-3">
            <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Add internal notes about this project..."
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm min-h-[120px] focus:ring-2 focus:ring-blue-500 outline-none" />
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">Save Note</button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center"><User className="w-5 h-5 text-blue-600" /></div>
              <div><p className="font-medium text-sm">{project.customer.name}</p><p className="text-xs text-slate-500">{project.customer.email}</p></div>
            </div>
            <div className="space-y-2">
              <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Type message to customer..."
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm min-h-[100px] focus:ring-2 focus:ring-blue-500 outline-none" />
              <div className="flex gap-2">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-1"><Send className="w-3 h-3" /> Send Email</button>
                <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700">Send WhatsApp</button>
                <button className="bg-slate-100 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-200">Send SMS</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
