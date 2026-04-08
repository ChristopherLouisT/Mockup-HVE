"use client";
import React, { useState } from 'react';
import MonitoringSRT from '@/components/MonitoringSRT';
import MonitoringPerforma from '@/components/MonitoringPerforma';
import MonitoringKomparasi from '@/components/MonitoringKomparasi';

const MonitoringPage = () => {
  const [activeTab, setActiveTab] = useState(1);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      <div className="bg-[#005a32] shadow-md sticky top-0 z-30 font-bold">
        <div className="max-w-[1600px] mx-auto flex px-6 overflow-x-auto no-scrollbar">
          {[
            { id: 1, label: "1. Monitoring SRT (Log Activity)" },
            { id: 2, label: "2. Monitoring Performa (MTTR & Availability)" },
            { id: 3, label: "3. Komparasi Unit" }
          ].map((tab) => (
            <button 
              key={tab.id} 
              onClick={() => setActiveTab(tab.id)} 
              className={`py-4 px-6 text-[10px] md:text-xs uppercase tracking-wider whitespace-nowrap transition-all border-b-4 ${
                activeTab === tab.id ? 'border-white bg-white/10 text-white' : 'border-transparent text-white/70 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <main className="max-w-[1600px] mx-auto p-4 md:p-6">
        {activeTab === 1 && <MonitoringSRT />}
        {activeTab === 2 && <MonitoringPerforma />}
        {activeTab === 3 && <MonitoringKomparasi />}
      </main>
    </div>
  );
};

export default MonitoringPage;