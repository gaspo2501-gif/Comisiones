
import React from 'react';
import { Parameters, Tier } from '../types';

interface ParametersViewProps {
  params: Parameters;
  isClosed: boolean;
  setParams: (params: Parameters) => void;
}

export const ParametersView: React.FC<ParametersViewProps> = ({ params, isClosed, setParams }) => {
  const updateWeight = (key: keyof Parameters['weights'], value: string) => {
    if (isClosed) return;
    const num = parseFloat(value) || 0;
    setParams({
      ...params,
      weights: { ...params.weights, [key]: num }
    });
  };

  const updateTier = (category: keyof Parameters['tiers'], index: number, field: keyof Tier, value: string) => {
    if (isClosed) return;
    const num = parseFloat(value) || 0;
    const newTiers = [...params.tiers[category]];
    newTiers[index] = { ...newTiers[index], [field]: num };
    setParams({
      ...params,
      tiers: { ...params.tiers, [category]: newTiers }
    });
  };

  return (
    <div className="space-y-6">
      {isClosed && (
        <div className="bg-red-50 p-4 rounded-xl border border-red-200 text-red-800 text-sm font-bold text-center">
          Mes Cerrado: No se pueden modificar los parámetros.
        </div>
      )}
      
      <section className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <h2 className="text-lg font-bold mb-4 text-indigo-800">Comisión Base</h2>
        <input 
          type="number" step="0.01" disabled={isClosed}
          value={params.baseCommissionRate * 100}
          onChange={e => setParams({...params, baseCommissionRate: (parseFloat(e.target.value) || 0) / 100})}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50"
        />
      </section>

      <section className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <h2 className="text-lg font-bold mb-4 text-indigo-800">Pesos de Indicadores</h2>
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(params.weights).map(([key, val]) => (
            <div key={key}>
              <label className="block text-xs font-bold text-gray-500 uppercase">{key}</label>
              <input 
                type="number" step="0.01" disabled={isClosed} value={val}
                onChange={e => updateWeight(key as any, e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg text-sm disabled:bg-gray-50"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Tier Sections */}
      {[
        { key: 'volume' as const, title: 'Volumen (Unidades)', isPercent: false },
        { key: 'mix' as const, title: 'Mix (%)', isPercent: true },
        { key: 'financing' as const, title: 'Financiación (%)', isPercent: true },
        { key: 'quality' as const, title: 'Calidad (Puntaje)', isPercent: false }
      ].map(cat => (
        <section key={cat.key} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <h2 className="text-md font-bold mb-3 text-indigo-700">{cat.title}</h2>
          <div className="space-y-2">
            {params.tiers[cat.key].map((tier, idx) => (
              <div key={tier.id} className="grid grid-cols-2 gap-2">
                <input 
                  type="number" step="0.01" disabled={isClosed}
                  value={cat.isPercent ? tier.threshold * 100 : tier.threshold}
                  onChange={e => updateTier(cat.key, idx, 'threshold', cat.isPercent ? (parseFloat(e.target.value)/100).toString() : e.target.value)}
                  className="p-2 border border-gray-300 rounded-lg text-sm disabled:bg-gray-50"
                />
                <input 
                  type="number" step="1" disabled={isClosed}
                  value={tier.percentage * 100}
                  onChange={e => updateTier(cat.key, idx, 'percentage', (parseFloat(e.target.value)/100).toString())}
                  className="p-2 border border-gray-300 rounded-lg text-sm disabled:bg-gray-50"
                />
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};
