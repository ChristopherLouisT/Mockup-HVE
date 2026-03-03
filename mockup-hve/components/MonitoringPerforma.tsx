"use client";
import { useState } from 'react';
import { 
  Activity, Wrench, Clock, 
  TrendingUp, AlertTriangle, 
  PieChart as PieIcon,
  BarChart3, Gauge, Info
} from 'lucide-react';

const MonitoringPerforma = () => {
  const [hoveredMonth, setHoveredMonth] = useState<number | null>(null);

  // 1. KPI Stats Data
  const stats = [
    { label: "Availability Rate", value: "92.4 %", sub: "Average Availability", color: "text-green-600", icon: Activity },
    { label: "Mean Time to Repair (MTTR)", value: "4.1 Hrs", sub: "Average Time to Repair", color: "text-red-600", icon: Wrench },
    { label: "Mean Time Between Failures (MTBF)", value: "315 Hrs", sub: "Average Mean Time Between Failures", color: "text-blue-600", icon: Clock },
    { label: "Utilitas Alat (HM)", value: "1,240 HM", sub: "Total Jam Kerja Efektif", color: "text-orange-600", icon: Gauge },
  ];

  // 2. Trend Data (Dummy Months)
  const trendData = [
    { month: 'Okt', mttr: 3.5, avail: 89 },
    { month: 'Nov', mttr: 3.2, avail: 92 },
    { month: 'Des', mttr: 4.8, avail: 88 },
    { month: 'Jan', mttr: 5.2, avail: 84 },
    { month: 'Feb', mttr: 4.1, avail: 82 },
    { month: 'Mar', mttr: 3.8, avail: 87 },
  ];

  // 3. Root Cause Data (Dummy Data)
  const rootCauses = [
    { label: 'Engine', color: 'bg-orange-500', hex: '#f97316', p: 45 },
    { label: 'Hydraulic', color: 'bg-blue-400', hex: '#60a5fa', p: 25 },
    { label: 'Electrical', color: 'bg-green-500', hex: '#22c55e', p: 15 },
    { label: 'Transmission', color: 'bg-cyan-400', hex: '#22d3ee', p: 10 },
    { label: 'Others', color: 'bg-slate-300', hex: '#cbd5e1', p: 5 },
  ];

  const donutGradient = `conic-gradient(
    #f97316 0% 45%, 
    #60a5fa 45% 70%, 
    #22c55e 70% 85%, 
    #22d3ee 85% 95%, 
    #cbd5e1 95% 100%
  )`;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Parameter Analisis */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-end gap-4">
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 font-bold uppercase tracking-tighter text-sm">
          <div className="space-y-1"><label className="text-[10px] text-green-700">Port/Lokasi:</label><select className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 outline-none font-bold uppercase"><option>ALL (NASIONAL)</option><option>SBY - SURABAYA</option><option>JKT - JAKARTA</option><option>AMB - AMBON</option></select></div>
          <div className="space-y-1"><label className="text-[10px] text-green-700">Jenis Alat:</label><select className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 outline-none font-bold uppercase"><option>ALL JENIS ALAT</option><option>Reach Stacker</option><option>Crane</option><option>Forklift</option></select></div>
          <div className="space-y-1"><label className="text-[10px] text-green-700">Nama Alat:</label><select className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 outline-none font-bold uppercase"><option>SEMUA ALAT</option></select></div>
        </div>
        <button className="bg-black text-white px-8 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-md active:scale-95">Terapkan</button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
        {stats.map((item, idx) => (
          <div key={idx} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden group transition-all">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform"><item.icon size={48} /></div>
            <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest block mb-2">{item.label}</span>
            <div className={`text-3xl font-black ${item.color} tracking-tighter mb-1 font-mono`}>{item.value}</div>
            <span className="text-[9px] text-slate-400 font-bold italic block mt-1 uppercase tracking-tighter leading-tight">{item.sub}</span>
          </div>
        ))}
      </div>

      {/* Analytics Visualization Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Trend Chart (MTTR & Availability) */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex justify-between items-center border-b pb-4 border-slate-50">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <TrendingUp size={16} className="text-green-600" /> Trend MTTR & Availability (YTD)
            </h3>
            <div className="flex gap-4">
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 bg-green-500 rounded-full"></div><span className="text-[9px] font-bold text-slate-400 uppercase">Avail %</span></div>
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 bg-red-400 rounded-full"></div><span className="text-[9px] font-bold text-slate-400 uppercase">MTTR Hrs</span></div>
            </div>
          </div>
          
          <div className="flex gap-2">
             {/* Y-Axis Left (MTTR) */}
             <div className="flex flex-col justify-between text-[8px] font-bold text-slate-400 pb-8 uppercase">
                <span>6.0h</span><span>4.5h</span><span>3.0h</span><span>1.5h</span><span>0h</span>
             </div>

             <div className="flex-1 h-[250px] flex items-end justify-between px-4 relative border-l border-b border-slate-100 pb-2">
                {/* Background Grid */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20 px-4 pt-4 pb-8">
                   {[1,2,3,4].map(i => <div key={i} className="w-full border-t border-slate-300 border-dashed"></div>)}
                </div>

                {/* SVG Line for Availability */}
                <svg className="absolute inset-0 h-full w-full pointer-events-none px-10 pt-10" preserveAspectRatio="none">
                    <polyline fill="none" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" 
                      points="0,80 100,50 200,100 300,140 400,90 500,60" />
                    {/* Data Points for Hover Reference */}
                    {[0,100,200,300,400,500].map((x, i) => (
                       <circle key={i} cx={x} cy={[80,50,100,140,90,60][i]} r="4" fill="#22c55e" />
                    ))}
                </svg>

                {trendData.map((d, i) => (
                  <div 
                    key={i} 
                    className="flex-1 flex flex-col items-center group relative z-10"
                    onMouseEnter={() => setHoveredMonth(i)}
                    onMouseLeave={() => setHoveredMonth(null)}>
                      {/* Tooltip on Hover */}
                      {hoveredMonth === i && (
                        <div className="absolute -top-20 left-1/2 -translate-x-1/2 bg-slate-800 text-white p-2 rounded shadow-xl z-50 min-w-[80px] text-center border border-slate-600 animate-in zoom-in-95 duration-200">
                           <div className="text-[10px] font-black border-b border-white/20 pb-1 mb-1">{d.month} Data</div>
                           <div className="text-[9px] font-bold text-green-400">Avail: {d.avail}%</div>
                           <div className="text-[9px] font-bold text-red-400">MTTR: {d.mttr}h</div>
                        </div>
                      )}

                      <div className="w-8 bg-red-400/20 rounded-t-sm group-hover:bg-red-400 transition-all cursor-crosshair" style={{ height: `${d.mttr * 30}px` }}></div>
                      <span className="text-[9px] font-bold text-slate-400 mt-4">{d.month}</span>
                  </div>
                ))}
             </div>

             {/* Y-Axis Right (Availability) */}
             <div className="flex flex-col justify-between text-[8px] font-bold text-green-600 pb-8 text-right">
                <span>100%</span><span>95%</span><span>90%</span><span>85%</span><span>80%</span>
             </div>
          </div>
        </div>

        {/* Root Cause Distribution */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
          <div className="flex justify-between items-center border-b pb-4 border-slate-50 mb-8">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <PieIcon size={16} className="text-orange-500" /> Distribusi Problem (Root Cause)
            </h3>
            <Info size={14} className="text-slate-300" />
          </div>
          
          <div className="flex items-center justify-around flex-1 gap-8">
            <div 
              className="relative w-44 h-44 rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-105 duration-500"
              style={{ background: donutGradient }}>
               <div className="w-28 h-28 bg-white rounded-full flex flex-col items-center justify-center shadow-inner">
                  <div className="text-2xl font-black text-slate-800 leading-none">142</div>
                  <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Total NDT</div>
               </div>
            </div>

            {/* Legends */}
            <div className="space-y-4 min-w-[160px]">
              {rootCauses.map((rc, i) => (
                <div key={i} className="group cursor-pointer">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${rc.color} ring-2 ring-white shadow-sm`}></div>
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">{rc.label}</span>
                    </div>
                    <span className="text-[10px] font-black text-slate-800">{rc.p}%</span>
                  </div>
                  <div className="w-full bg-slate-50 h-1 rounded-full overflow-hidden">
                     <div className={`${rc.color} h-full transition-all duration-1000`} style={{ width: `${rc.p}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bad Actors Table */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 border-b pb-4 border-slate-50 mb-6">
            <AlertTriangle size={16} className="text-yellow-500" /> Top Bad Actors (Sering Rusak)
          </h3>
          <table className="w-full text-left text-[11px] font-bold">
            <thead className="bg-slate-50 text-slate-400 uppercase font-black tracking-widest border-b border-slate-100">
              <tr><th className="px-4 py-3 text-center">Rank</th><th className="px-4 py-3">Nama Alat</th><th className="px-4 py-3 text-center">Freq (NDT)</th><th className="px-4 py-3 text-right">TTL DT</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
               <tr className="hover:bg-slate-50 transition-colors text-slate-700">
                 <td className="px-4 py-4 text-center text-slate-400 font-black">#1</td>
                 <td className="px-4 py-4 underline decoration-blue-100">HVE SBY 14 (RS KONE)</td>
                 <td className="px-4 py-4 text-center text-red-600 font-black">15x</td>
                 <td className="px-4 py-4 text-right text-blue-600 font-black">185 Jam</td>
               </tr>
               <tr className="hover:bg-slate-50 transition-colors text-slate-700">
                 <td className="px-4 py-4 text-center text-slate-400 font-black">#2</td>
                 <td className="px-4 py-4 underline decoration-blue-100">HVE AMB 01 / JATAYU (-)</td>
                 <td className="px-4 py-4 text-center text-red-600 font-black">8x</td>
                 <td className="px-4 py-4 text-right text-blue-600 font-black">120 Jam</td>
               </tr>
            </tbody>
          </table>
        </div>

        {/* Perbandingan Availability By Type */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 border-b pb-4 border-slate-50">
             <BarChart3 size={16} className="text-blue-500" /> Availability By Equipment Type
          </h3>
          <div className="space-y-6 pt-4">
             {['Reach Stacker', 'Forklift', 'Crane'].map((type, i) => (
               <div key={i} className="space-y-2 group cursor-pointer">
                 <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                   <span className="group-hover:text-blue-600 transition-colors">{type}</span>
                   <div className="flex gap-2">
                      <span className="text-slate-300 font-bold uppercase">Target: 95%</span>
                      <span className="text-blue-600">{(94 - i*4)}%</span>
                   </div>
                 </div>
                 <div className="w-full bg-slate-50 h-3.5 rounded-full overflow-hidden shadow-inner border border-slate-100 relative">
                    <div className="bg-blue-600 h-full rounded-full transition-all duration-1000 shadow-lg" style={{ width: `${94 - i*4}%` }}></div>
                    <div className="absolute right-[5%] top-0 h-full w-[2px] bg-red-400 opacity-30 z-20"></div>
                 </div>
               </div>
             ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default MonitoringPerforma;