// src/components/BunningsSettingsModal.tsx
import React, { useState, useEffect } from 'react';
import { X, Save, Key, CheckCircle, AlertCircle } from 'lucide-react';

interface BunningsSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BunningsSettingsModal: React.FC<BunningsSettingsModalProps> = ({ isOpen, onClose }) => {
  const [consumerKey, setConsumerKey] = useState('');
  const [consumerSecret, setConsumerSecret] = useState('');
  const [useSandbox, setUseSandbox] = useState(true);
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [saving, setSaving] = useState(false);

  // Load saved settings on mount
  useEffect(() => {
    const savedKey = localStorage.getItem('bunnings_consumer_key');
    const savedSecret = localStorage.getItem('bunnings_consumer_secret');
    const savedSandbox = localStorage.getItem('bunnings_use_sandbox');

    if (savedKey) setConsumerKey(savedKey);
    if (savedSecret) setConsumerSecret(savedSecret);
    if (savedSandbox !== null) setUseSandbox(savedSandbox === 'true');
  }, []);

  const testConnection = async () => {
    if (!consumerKey) {
      alert('Please enter a Consumer Key');
      return;
    }
    setSaving(true);
    // Simulate connection test (Real implementation would call an endpoint)
    setTimeout(() => {
      setIsConnected(true);
      setSaving(false);
      alert('Connection test successful! (Mock)');
    }, 1000);
  };

  const saveSettings = () => {
    setSaving(true);
    localStorage.setItem('bunnings_consumer_key', consumerKey);
    localStorage.setItem('bunnings_consumer_secret', consumerSecret);
    localStorage.setItem('bunnings_use_sandbox', useSandbox.toString());
    
    setTimeout(() => {
      setSaving(false);
      setIsConnected(true);
      onClose();
    }, 500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X size={20} />
        </button>

        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Key className="text-orange-600" />
          Bunnings API Settings
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Environment</label>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="sandbox"
                checked={useSandbox}
                onChange={(e) => setUseSandbox(e.target.checked)}
                className="rounded text-orange-600 focus:ring-orange-500"
              />
              <label htmlFor="sandbox" className="text-sm text-gray-600">
                Use Sandbox (Test Mode)
              </label>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {useSandbox ? 'Using mock data for testing.' : 'Using live production data.'}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Consumer Key</label>
            <input
              type="text"
              value={consumerKey}
              onChange={(e) => setConsumerKey(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-orange-500 focus:border-orange-500"
              placeholder="Enter your Bunnings Consumer Key"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Consumer Secret</label>
            <input
              type="password"
              value={consumerSecret}
              onChange={(e) => setConsumerSecret(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-orange-500 focus:border-orange-500"
              placeholder="Enter your Bunnings Consumer Secret"
            />
          </div>

          {isConnected === true && (
            <div className="flex items-center gap-2 text-green-600 text-sm bg-green-50 p-2 rounded">
              <CheckCircle size={16} />
              <span>Settings saved successfully</span>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              onClick={testConnection}
              disabled={saving || !consumerKey}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Test Connection
            </button>
            <button
              onClick={saveSettings}
              disabled={saving}
              className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-md text-sm font-medium hover:bg-orange-700 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {saving ? 'Saving...' : <><Save size={16} /> Save Settings</>}
            </button>
          </div>
          
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
            <AlertCircle size={14} className="inline mr-1" />
            <strong>Note:</strong> Direct browser API calls may be blocked by CORS. 
            The app will fallback to opening Bunnings search links for price verification.
          </div>
        </div>
      </div>
    </div>
  );
};