
import React, { useState, useEffect, useMemo } from 'react';
import { Layout } from './components/Layout';
import { SalesView } from './components/SalesView';
import { ParametersView } from './components/ParametersView';
import { SummaryView } from './components/SummaryView';
import { HistoryView } from './components/HistoryView';
import { Tab, Sale, Parameters, MonthData, SummaryData, AppStore } from './types';
import { INITIAL_PARAMS } from './constants';

const LS_KEY = 'comisapp_store_v2';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.SALES);
  
  // Initialize entire store from LocalStorage
  const [store, setStore] = useState<AppStore>(() => {
    const saved = localStorage.getItem(LS_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
    const initialMonth = new Date().toISOString().slice(0, 7);
    return {
      activeMonth: initialMonth,
      months: {
        [initialMonth]: {
          status: 'open',
          sales: [],
          parameters: INITIAL_PARAMS,
          qualityScore: 0, // Inicia en 0 para obligar carga
          summary: null
        }
      }
    };
  });

  // Sync with LocalStorage
  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(store));
  }, [store]);

  const activeMonthId = store.activeMonth;
  const activeMonthData = useMemo(() => {
    return store.months[activeMonthId] || {
      status: 'open',
      sales: [],
      parameters: INITIAL_PARAMS,
      qualityScore: 0,
      summary: null
    };
  }, [store.months, activeMonthId]);

  const isClosed = activeMonthData.status === 'closed';

  // Handlers
  const handleMonthChange = (newMonth: string) => {
    setStore(prev => {
      const newMonths = { ...prev.months };
      if (!newMonths[newMonth]) {
        newMonths[newMonth] = {
          status: 'open',
          sales: [],
          parameters: prev.months[prev.activeMonth]?.parameters || INITIAL_PARAMS,
          qualityScore: 0,
          summary: null
        };
      }
      return { ...prev, activeMonth: newMonth, months: newMonths };
    });
  };

  const updateActiveMonth = (updates: Partial<MonthData>) => {
    if (isClosed && !updates.status) return; // Prevent edits if closed
    setStore(prev => ({
      ...prev,
      months: {
        ...prev.months,
        [activeMonthId]: { ...prev.months[activeMonthId], ...updates }
      }
    }));
  };

  const handleAddSale = (sale: Sale) => {
    updateActiveMonth({ sales: [...activeMonthData.sales, sale] });
  };

  const handleDeleteSale = (id: string) => {
    if (window.confirm('¿Eliminar esta venta?')) {
      updateActiveMonth({ sales: activeMonthData.sales.filter(s => s.id !== id) });
    }
  };

  const handleClearAll = () => {
    if (window.confirm('¿Borrar TODAS las ventas de este mes?')) {
      updateActiveMonth({ sales: [] });
    }
  };

  const handleCloseMonth = (summary: SummaryData) => {
    updateActiveMonth({
      status: 'closed',
      summary: summary,
      closedAt: new Date().toISOString()
    });
    setActiveTab(Tab.HISTORY);
  };

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(store, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `comisapp_backup_${activeMonthId}.json`;
    a.click();
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const imported = JSON.parse(evt.target?.result as string);
        if (imported.activeMonth && imported.months) {
          if (confirm('¿Importar datos? Esto reemplazará toda la información actual.')) {
            setStore(imported);
            window.location.reload();
          }
        }
      } catch (err) {
        alert('Archivo JSON no válido');
      }
    };
    reader.readAsText(file);
  };

  const renderContent = () => {
    switch (activeTab) {
      case Tab.SALES:
        return (
          <SalesView 
            sales={activeMonthData.sales} 
            params={activeMonthData.parameters} 
            activeMonth={activeMonthId}
            isClosed={isClosed}
            onAddSale={handleAddSale}
            onDeleteSale={handleDeleteSale}
            onClearAll={handleClearAll}
            onMonthChange={handleMonthChange}
          />
        );
      case Tab.SUMMARY:
        return (
          <SummaryView 
            sales={activeMonthData.sales} 
            params={activeMonthData.parameters}
            qualityScore={activeMonthData.qualityScore}
            setQualityScore={(val) => updateActiveMonth({ qualityScore: val })}
            isClosed={isClosed}
            savedSummary={activeMonthData.summary}
            onCloseMonth={handleCloseMonth}
          />
        );
      case Tab.HISTORY:
        return (
          <HistoryView 
            months={store.months} 
            onViewMonth={(id) => { handleMonthChange(id); setActiveTab(Tab.SALES); }}
            onExport={handleExport}
            onImport={handleImport}
          />
        );
      case Tab.PARAMS:
        return (
          <ParametersView 
            params={activeMonthData.parameters} 
            isClosed={isClosed}
            setParams={(p) => updateActiveMonth({ parameters: p })} 
          />
        );
      default:
        return null;
    }
  };

  return (
    <Layout 
      activeTab={activeTab} 
      setActiveTab={setActiveTab} 
      activeMonthId={activeMonthId} 
      isClosed={isClosed}
    >
      {renderContent()}
    </Layout>
  );
};

export default App;
