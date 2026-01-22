
import React, { useMemo } from 'react';
import { Sale, Parameters, SummaryData, Tier } from '../types';

interface SummaryViewProps {
  sales: Sale[];
  params: Parameters;
  qualityScore: number;
  setQualityScore: (val: number) => void;
  isClosed: boolean;
  savedSummary: SummaryData | null;
  onCloseMonth: (summary: SummaryData) => void;
}

export const SummaryView: React.FC<SummaryViewProps> = ({ 
  sales, params, qualityScore, setQualityScore, isClosed, savedSummary, onCloseMonth 
}) => {

  const findTierPercentage = (value: number, tiers: Tier[]): number => {
    const sortedTiers = [...tiers].sort((a, b) => b.threshold - a.threshold);
    const metTier = sortedTiers.find(t => value >= t.threshold);
    return metTier ? metTier.percentage : 0;
  };

  const calculatedSummary = useMemo<SummaryData>(() => {
    if (isClosed && savedSummary) return savedSummary;

    const totalUnits = sales.length;
    const totalBaseCommission = sales.reduce((sum, s) => sum + s.baseCommissionUnit, 0);
    const mixSales = sales.filter(s => s.inMix).length;
    const mixPercentage = totalUnits > 0 ? mixSales / totalUnits : 0;
    const financedSales = sales.filter(s => s.isFinanced).length;
    const financingPercentage = totalUnits > 0 ? financedSales / totalUnits : 0;

    const volTierPct = findTierPercentage(totalUnits, params.tiers.volume);
    const volumeBonus = totalBaseCommission * params.weights.volume * volTierPct;
    
    const mixTierPct = findTierPercentage(mixPercentage, params.tiers.mix);
    const mixBonus = totalBaseCommission * params.weights.mix * mixTierPct;
    
    const finTierPct = findTierPercentage(financingPercentage, params.tiers.financing);
    const financingBonus = totalBaseCommission * params.weights.financing * finTierPct;
    
    const qualTierPct = findTierPercentage(qualityScore, params.tiers.quality);
    const qualityBonus = totalBaseCommission * params.weights.quality * qualTierPct;

    const finalCommission = totalBaseCommission + volumeBonus + mixBonus + financingBonus + qualityBonus;

    return { 
      totalUnits, totalBaseCommission, volumeBonus, mixBonus, financingBonus, qualityBonus, finalCommission, 
      stats: { mixPercentage, financingPercentage, qualityScore } 
    };
  }, [sales, params, qualityScore, isClosed, savedSummary]);

  const formatCurrency = (val: number) => val.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' });
  const formatPercent = (val: number) => (val * 100).toFixed(1) + '%';

  const hasSales = sales.length > 0;
  const hasQuality = qualityScore > 0;
  const canClose = hasSales && hasQuality;

  return (
    <div className="space-y-6">
      <section className={`${isClosed ? 'bg-gray-800' : 'bg-indigo-600'} text-white p-6 rounded-2xl shadow-lg relative overflow-hidden transition-colors`}>
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 20 20"><path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"/><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.184c-.622.117-1.195.342-1.676.662C6.602 13.234 6 14.009 6 15c0 .99.602 1.765 1.324 2.246A4.535 4.535 0 009 17.908V18a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662c.722-.481 1.324-1.256 1.324-2.246 0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 12.184v-1.184c.622-.117 1.195-.342 1.676-.662C13.398 9.766 14 8.991 14 8c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 5.092V5z" clipRule="evenodd"/></svg>
        </div>
        <p className="text-[10px] uppercase font-bold opacity-80 mb-1 leading-none">
          {isClosed ? 'Comisión Consolidada Final' : 'Proyección de Comisión'}
        </p>
        <h2 className="text-4xl font-black">{formatCurrency(calculatedSummary.finalCommission)}</h2>
        <div className="mt-4 grid grid-cols-2 gap-4 border-t border-white/20 pt-4">
          <div><p className="text-[10px] uppercase font-bold opacity-70">Unidades</p><p className="text-xl font-bold">{calculatedSummary.totalUnits}</p></div>
          <div><p className="text-[10px] uppercase font-bold opacity-70">Base Total</p><p className="text-xl font-bold">{formatCurrency(calculatedSummary.totalBaseCommission)}</p></div>
        </div>
      </section>

      <section className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-4">
        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Desglose de Incentivos</h3>
        {[
          { label: 'Volumen', val: calculatedSummary.volumeBonus, detail: `${calculatedSummary.totalUnits} uds.`, tier: findTierPercentage(calculatedSummary.totalUnits, params.tiers.volume) },
          { label: 'Mix de Ventas', val: calculatedSummary.mixBonus, detail: formatPercent(calculatedSummary.stats.mixPercentage), tier: findTierPercentage(calculatedSummary.stats.mixPercentage, params.tiers.mix) },
          { label: 'Financiación', val: calculatedSummary.financingBonus, detail: formatPercent(calculatedSummary.stats.financingPercentage), tier: findTierPercentage(calculatedSummary.stats.financingPercentage, params.tiers.financing) },
        ].map(item => (
          <div key={item.label} className="flex justify-between items-center pb-2 border-b border-gray-50">
            <div><p className="font-bold text-gray-800 text-sm leading-none mb-1">{item.label}</p><p className="text-[10px] text-gray-400">Logro: {item.detail}</p></div>
            <div className="text-right"><p className="font-bold text-indigo-600 leading-none mb-1">+{formatCurrency(item.val)}</p><p className="text-[10px] text-gray-400">Nivel: {formatPercent(item.tier)}</p></div>
          </div>
        ))}
        
        <div className="flex justify-between items-center">
          <div>
            <p className="font-bold text-gray-800 text-sm leading-none mb-1">Calidad (CSAT)</p>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-gray-400 uppercase">Score:</span>
              <input 
                type="number" step="0.01" min="0" max="5"
                value={qualityScore} 
                disabled={isClosed} 
                onChange={e => setQualityScore(Math.min(5, Math.max(0, parseFloat(e.target.value) || 0)))} 
                className={`w-14 px-1 border-b text-xs focus:outline-none focus:border-indigo-500 bg-transparent disabled:border-none font-black ${!hasQuality && !isClosed ? 'border-red-500 text-red-500 bg-red-50' : 'border-gray-300 text-gray-800'}`} 
              />
            </div>
          </div>
          <div className="text-right">
            <p className="font-bold text-indigo-600 leading-none mb-1">+{formatCurrency(calculatedSummary.qualityBonus)}</p>
            <p className="text-[10px] text-gray-400">Nivel: {formatPercent(findTierPercentage(calculatedSummary.stats.qualityScore, params.tiers.quality))}</p>
          </div>
        </div>
      </section>

      {!isClosed && (
        <section className="space-y-3">
          {!canClose && (
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-start gap-3 shadow-sm">
              <div className="bg-amber-100 p-1.5 rounded-lg">
                <svg className="w-5 h-5 text-amber-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
              </div>
              <div className="text-[11px] text-amber-900 leading-snug">
                <p className="font-black uppercase tracking-wider mb-1">Bloqueo de Cierre</p>
                <ul className="space-y-1">
                  <li className={`flex items-center gap-1.5 ${hasSales ? 'text-gray-400 line-through' : 'font-bold'}`}>
                    <span className={`w-1 h-1 rounded-full ${hasSales ? 'bg-gray-300' : 'bg-amber-500 animate-pulse'}`}></span>
                    Debe cargar al menos una venta.
                  </li>
                  <li className={`flex items-center gap-1.5 ${hasQuality ? 'text-gray-400 line-through' : 'font-bold'}`}>
                    <span className={`w-1 h-1 rounded-full ${hasQuality ? 'bg-gray-300' : 'bg-amber-500 animate-pulse'}`}></span>
                    El puntaje de calidad debe ser mayor a 0.
                  </li>
                </ul>
              </div>
            </div>
          )}
          
          <button 
            disabled={!canClose}
            onClick={() => { if(confirm('¿ESTÁS SEGURO? Cerrar el mes generará un reporte inmutable. Verifica que todas las ventas y el puntaje de calidad sean correctos.')) onCloseMonth(calculatedSummary); }}
            className={`w-full font-black py-4 rounded-xl shadow-lg transition-all uppercase tracking-[0.2em] text-sm ${canClose ? 'bg-orange-600 text-white hover:bg-orange-700 active:scale-95' : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'}`}
          >
            Consolidar y Cerrar
          </button>
        </section>
      )}

      {isClosed && (
        <div className="bg-green-100 p-5 rounded-xl text-center border border-green-200 shadow-inner">
          <div className="w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-2 shadow-sm">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
          </div>
          <p className="text-sm font-black text-green-800 uppercase tracking-widest leading-none">Cierre Consolidado</p>
          <p className="text-[10px] text-green-700 mt-2 font-medium">Este periodo ha sido bloqueado y no permite modificaciones.</p>
        </div>
      )}
    </div>
  );
};
