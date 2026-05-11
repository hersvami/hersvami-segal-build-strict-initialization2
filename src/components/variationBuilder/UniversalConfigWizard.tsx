import React, { useEffect, useState } from 'react';
import { MODULE_CONFIGS } from '../../utils/modules/moduleConfigs';
import type { ModuleType, ProjectBaseline } from '../../types/domain';
import { CheckCircle, AlertTriangle, Info } from 'lucide-react';

interface Props {
  moduleType: ModuleType;
  baseline: ProjectBaseline;
  onChange: (data: Record<string, any>) => void;
  initialData?: Record<string, any>;
}

export function UniversalConfigWizard({ moduleType, baseline, onChange, initialData = {} }: Props) {
  const config = MODULE_CONFIGS[moduleType];
  const [formData, setFormData] = useState<Record<string, any>>(initialData);
  const [activeTriggers, setActiveTriggers] = useState<string[]>([]);

  // Update parent when form changes
  useEffect(() => {
    onChange(formData);
    
    // Check auto-triggers
    const triggered = config.autoTriggers
      .filter(t => t.condition(formData[t.field], formData))
      .map(t => t.action);
    setActiveTriggers(triggered);
  }, [formData, config]);

  const updateField = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  if (!config) return <div className="p-4 text-red-500">Configuration missing for {moduleType}</div>;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <span className="text-3xl">{config.icon}</span>
          <div>
            <h3 className="font-bold text-lg text-blue-900">{config.label} Configuration</h3>
            <p className="text-sm text-blue-700">{config.description}</p>
          </div>
        </div>
        
        {activeTriggers.length > 0 && (
          <div className="mt-3 flex items-start gap-2 text-xs text-amber-800 bg-amber-100 p-2 rounded">
            <AlertTriangle size={14} className="shrink-0 mt-0.5" />
            <div>
              <strong>Code Requirements Detected:</strong>
              <ul className="list-disc ml-4 mt-1">
                {activeTriggers.map((t, i) => <li key={i}>{t}</li>)}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Dynamic Sections */}
      {config.sections.map(section => (
        <div key={section.id} className="border border-slate-200 rounded-xl overflow-hidden">
          <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center gap-2">
            <span className="text-xl">{section.icon}</span>
            <h4 className="font-semibold text-slate-800">{section.title}</h4>
          </div>
          
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
            {section.fields.map(field => {
              // Conditional Logic
              if (field.requiredIf && !field.requiredIf(formData)) return null;

              const currentValue = formData[field.key] ?? field.defaultValue;

              return (
                <div key={field.key} className="space-y-1">
                  <label className="block text-sm font-medium text-slate-700">
                    {field.label}
                  </label>
                  
                  {field.helpText && (
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <Info size={12} /> {field.helpText}
                    </p>
                  )}

                  {/* Input Types */}
                  {field.type === 'select' && (
                    <select
                      value={currentValue}
                      onChange={(e) => updateField(field.key, e.target.value)}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                      {field.options?.map(opt => (
                        <option key={opt.id} value={opt.id}>
                          {opt.label} {opt.costImpact && `(${opt.costImpact})`}
                        </option>
                      ))}
                    </select>
                  )}

                  {field.type === 'number' && (
                    <input
                      type="number"
                      min={field.min}
                      max={field.max}
                      step={field.step || 1}
                      value={currentValue}
                      onChange={(e) => updateField(field.key, parseFloat(e.target.value) || 0)}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  )}

                  {field.type === 'boolean' && (
                    <div className="flex items-center gap-2 mt-2">
                      <input
                        type="checkbox"
                        checked={currentValue}
                        onChange={(e) => updateField(field.key, e.target.checked)}
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-slate-600">Yes, include this</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}