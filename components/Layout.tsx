
import React from 'react';
import { Tab } from '../types';

interface LayoutProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  children: React.ReactNode;
  activeMonthId: string;
  isClosed: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ activeTab, setActiveTab, children, activeMonthId, isClosed }) => {
  return (
    <div className="flex flex-col h-full max-w-md mx-auto bg-white shadow-xl relative">
      <header className="bg-indigo-600 text-white p-4 shadow-md sticky top-0 z-30 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-black tracking-tight leading-none">ComisApp</h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] font-bold opacity-80 uppercase">{activeMonthId}</span>
            <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-black uppercase tracking-wider ${isClosed ? 'bg-red-500 text-white' : 'bg-green-400 text-indigo-900'}`}>
              {isClosed ? 'Cerrado' : 'Abierto'}
            </span>
          </div>
        </div>
        <div className="text-right">
           <span className="text-[10px] bg-indigo-500 px-2 py-1 rounded font-bold">v2.1</span>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 pb-24 bg-gray-50">
        {children}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-gray-200 flex justify-around p-1 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] z-30">
        <TabButton active={activeTab === Tab.SALES} onClick={() => setActiveTab(Tab.SALES)} icon="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" label="Ventas" />
        <TabButton active={activeTab === Tab.SUMMARY} onClick={() => setActiveTab(Tab.SUMMARY)} icon="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" label="Cierre" />
        <TabButton active={activeTab === Tab.HISTORY} onClick={() => setActiveTab(Tab.HISTORY)} icon="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" label="Historial" />
        <TabButton active={activeTab === Tab.PARAMS} onClick={() => setActiveTab(Tab.PARAMS)} icon="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" label="Config" />
      </nav>
    </div>
  );
};

const TabButton = ({ active, onClick, icon, label }: any) => (
  <button onClick={onClick} className={`flex flex-col items-center p-2 rounded-lg transition-all flex-1 ${active ? 'text-indigo-600 bg-indigo-50 scale-105' : 'text-gray-400 hover:text-indigo-300'}`}>
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={icon} /></svg>
    <span className="text-[9px] font-black mt-1 uppercase">{label}</span>
  </button>
);
