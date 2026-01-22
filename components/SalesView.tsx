
import React, { useState } from 'react';
import { Sale, Parameters } from '../types';
import { VAT_RATE } from '../constants';

interface SalesViewProps {
  sales: Sale[];
  params: Parameters;
  activeMonth: string;
  isClosed: boolean;
  onAddSale: (sale: Sale) => void;
  onDeleteSale: (id: string) => void;
  onClearAll: () => void;
  onMonthChange: (monthId: string) => void;
}

export const SalesView: React.FC<SalesViewProps> = ({ 
  sales, params, activeMonth, isClosed, onAddSale, onDeleteSale, onClearAll, onMonthChange 
}) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    client: '',
    model: '',
    priceWithVat: '',
    inMix: false,
    isFinanced: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isClosed) return;
    if (!formData.client || !formData.model || !formData.priceWithVat) return;

    const priceWithVat = parseFloat(formData.priceWithVat);
    const priceWithoutVat = priceWithVat / VAT_RATE;
    const baseCommissionUnit = priceWithoutVat * params.baseCommissionRate;
    const id = Date.now().toString(36) + Math.random().toString(36).substring(2);

    onAddSale({
      id,
      date: formData.date,
      client: formData.client,
      model: formData.model,
      priceWithVat,
      inMix: formData.inMix,
      isFinanced: formData.isFinanced,
      priceWithoutVat,
      baseCommissionUnit
    });

    setFormData({ ...formData, client: '', model: '', priceWithVat: '', inMix: false, isFinanced: false });
  };

  return (
    <div className="space-y-6">
      <section className={`p-4 rounded-xl border flex items-center justify-between ${isClosed ? 'bg-gray-100 border-gray-200' : 'bg-indigo-50 border-indigo-100'}`}>
        <div>
          <label className="text-[10px] font-bold text-gray-500 uppercase block">Periodo Activo</label>
          <input 
            type="month" 
            value={activeMonth}
            onChange={(e) => onMonthChange(e.target.value)}
            className="bg-transparent font-bold text-indigo-800 outline-none"
          />
        </div>
        <div className="text-right">
          <span className={`text-[10px] px-2 py-1 rounded font-bold uppercase ${isClosed ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}>
            {isClosed ? 'Mes Cerrado' : 'Mes Abierto'}
          </span>
        </div>
      </section>

      {!isClosed && (
        <section className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <h2 className="text-lg font-bold mb-4 text-indigo-800">Nueva Venta</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              <input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
              <input type="text" placeholder="Cliente" value={formData.client} onChange={e => setFormData({...formData, client: e.target.value})} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
              <input type="text" placeholder="Modelo" value={formData.model} onChange={e => setFormData({...formData, model: e.target.value})} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
              <input type="number" step="0.01" placeholder="Precio Final ($)" value={formData.priceWithVat} onChange={e => setFormData({...formData, priceWithVat: e.target.value})} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <div className="flex gap-3">
              <label className="flex-1 flex items-center justify-center gap-2 p-3 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 active:bg-gray-200 transition-colors">
                <input type="checkbox" checked={formData.inMix} onChange={e => setFormData({...formData, inMix: e.target.checked})} className="w-5 h-5 text-indigo-600 rounded" />
                <span className="text-sm font-medium">Mix</span>
              </label>
              <label className="flex-1 flex items-center justify-center gap-2 p-3 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 active:bg-gray-200 transition-colors">
                <input type="checkbox" checked={formData.isFinanced} onChange={e => setFormData({...formData, isFinanced: e.target.checked})} className="w-5 h-5 text-indigo-600 rounded" />
                <span className="text-sm font-medium">Finan</span>
              </label>
            </div>
            <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-indigo-700 active:scale-95 transition-transform">Guardar Venta</button>
          </form>
        </section>
      )}

      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold flex items-center gap-2">Registro <span className="text-sm bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full">{sales.length} ops.</span></h2>
          {!isClosed && sales.length > 0 && (
            <button onClick={onClearAll} className="text-xs font-bold text-red-500 uppercase px-2 py-1 hover:bg-red-50 rounded transition-colors">Limpiar Mes</button>
          )}
        </div>
        
        {sales.length === 0 ? (
          <div className="text-center py-10 text-gray-400 bg-white rounded-xl border border-dashed border-gray-300">No hay ventas registradas.</div>
        ) : (
          <div className="space-y-3">
            {[...sales].reverse().map(sale => (
              <div key={sale.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden flex">
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-gray-800 leading-tight">{sale.client}</h3>
                      <p className="text-sm text-gray-500">{sale.model}</p>
                    </div>
                    <p className="text-[10px] font-mono text-gray-400 bg-gray-50 px-1 rounded">{sale.date}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-3 border-t pt-3">
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase font-bold">Base</p>
                      <p className="font-semibold text-green-600">${sale.baseCommissionUnit.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</p>
                    </div>
                    <div className="flex gap-1 justify-end items-center">
                      {sale.inMix && <span className="bg-blue-100 text-blue-800 text-[10px] px-1.5 py-0.5 rounded font-bold uppercase">Mix</span>}
                      {sale.isFinanced && <span className="bg-purple-100 text-purple-800 text-[10px] px-1.5 py-0.5 rounded font-bold uppercase">Finan</span>}
                    </div>
                  </div>
                </div>
                {!isClosed && (
                  <button 
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDeleteSale(sale.id); }} 
                    className="w-12 -mr-4 -my-4 flex items-center justify-center bg-red-50 text-red-500 border-l border-red-100 active:bg-red-200 transition-colors z-20"
                  >
                    <svg className="w-5 h-5 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
