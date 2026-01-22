
import React from 'react';
import { MonthData } from '../types';

interface HistoryViewProps {
  months: Record<string, MonthData>;
  onViewMonth: (monthId: string) => void;
  onExport: () => void;
  onImport: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({ months, onViewMonth, onExport, onImport }) => {
  const closedMonths = Object.entries(months)
    .filter(([_, data]) => data.status === 'closed')
    .sort(([idA], [idB]) => idB.localeCompare(idA));

  const formatCurrency = (val: number) => val.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' });

  return (
    <div className="space-y-6">
      <section className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <h2 className="text-sm font-bold text-gray-400 uppercase mb-3 text-center">Gestión de Datos</h2>
        <div className="flex gap-2">
          <button onClick={onExport} className="flex-1 bg-indigo-50 text-indigo-600 font-bold py-3 rounded-lg text-[10px] uppercase border border-indigo-100 flex items-center justify-center gap-2">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            Exportar Backup
          </button>
          <label className="flex-1 bg-gray-50 text-gray-600 font-bold py-3 rounded-lg text-[10px] uppercase border border-gray-200 flex items-center justify-center gap-2 cursor-pointer">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
            Importar
            <input type="file" className="hidden" accept=".json" onChange={onImport} />
          </label>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold mb-4 text-gray-700">Historial de Cierres</h2>
        {closedMonths.length === 0 ? (
          <div className="text-center py-10 text-gray-400 bg-white rounded-xl border border-dashed border-gray-300 px-6">
            <p className="text-sm italic">No hay meses cerrados aún.</p>
            <p className="text-[10px] mt-2">Los meses cerrados aparecerán aquí para consulta histórica.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {closedMonths.map(([id, data]) => (
              <button 
                key={id}
                onClick={() => onViewMonth(id)}
                className="w-full bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex justify-between items-center text-left hover:border-indigo-300 transition-colors group"
              >
                <div>
                  <h3 className="text-xl font-black text-indigo-900">{id}</h3>
                  <div className="flex gap-2 mt-1">
                    <span className="text-[10px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded">CONSOLIDADO</span>
                    <span className="text-[10px] font-bold text-gray-400">{data.sales.length} VENTAS</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-indigo-600">
                    {data.summary ? formatCurrency(data.summary.finalCommission) : 'N/A'}
                  </p>
                  <span className="text-[9px] text-gray-300 uppercase font-bold group-hover:text-indigo-400 transition-colors">Ver Detalles →</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
