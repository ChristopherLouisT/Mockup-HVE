"use client";
import { useState } from 'react';
import { 
  Filter, ShieldCheck, 
  Target, BarChart3, Info 
} from 'lucide-react';

const MonitoringKomparasi = () => {
  // 1. State for Selection
  const [unitA, setUnitA] = useState("HVE SBY 14");
  const [unitB, setUnitB] = useState("HVE AMB 01");
  const [tooltip, setTooltip] = useState<any>(null);

  // 2. Dummy Data (3 units with different profiles)
  const unitData: any = {
    "HVE SBY 14": {
      merk: "KONE - SMV 4531 TC5",
      engine: "350 HP / Cummins",
      kapasitas: "45 Ton",
      tahun: "2018 | SBY - Nilam",
      loc: "SBY - SURABAYA",
      avail: 85,
      freq: 15,
      downtime: 185,
      mttr: 5.2,
      mtbf: 250,
      system: "Engine / Cooling"
    },
    "HVE AMB 01": {
      merk: "KALMAR - DRU 450",
      engine: "330 HP / Volvo",
      kapasitas: "45 Ton",
      tahun: "2020 | AMB - Depo",
      loc: "AMB - AMBON",
      avail: 92,
      freq: 8,
      downtime: 120,
      mttr: 3.8,
      mtbf: 410,
      system: "Hydraulic Hose"
    },
    "HVE JKT 05": {
      merk: "TCM - FD 250",
      engine: "300 HP / Isuzu",
      kapasitas: "25 Ton",
      tahun: "2019 | JKT - Priok",
      loc: "JKT - JAKARTA",
      avail: 72,
      freq: 24,
      downtime: 310,
      mttr: 7.5,
      mtbf: 140,
      system: "Transmission"
    }
  };

  const dataA = unitData[unitA];
  const dataB = unitData[unitB];

  // Helper: Winner logic
  const isWinner = (valA: number, valB: number, type: 'higher' | 'lower') => {
    if (valA === valB) return false;
    return type === 'higher' ? valA > valB : valA < valB;
  };

  // --- RADAR CHART LOGIC ---
  // Calculates dynamic polygon paths based on unit data
  const getRadarPath = (data: any) => {
    const scores = [
      (data.avail - 50) * 2,           // Top: Availability %
      (data.mtbf / 500) * 80,          // Top Right: MTBF Score
      (10 - data.mttr) * 8,            // Bottom Right: MTTR (Inverse: Lower is Better)
      (400 - data.downtime) / 5,       // Bottom Left: Downtime (Inverse: Lower is Better)
      (30 - data.freq) * 2.6           // Top Left: Freq (Inverse: Lower is Better)
    ];

    const angleStep = (Math.PI * 2) / 5;
    const centerX = 100;
    const centerY = 100;

    return scores.map((score, i) => {
      const angle = i * angleStep - Math.PI / 2;
      const x = centerX + Math.max(10, score) * Math.cos(angle);
      const y = centerY + Math.max(10, score) * Math.sin(angle);
      return `${x},${y}`;
    }).join(' ');
  };

  const getRadarPoints = (data: any) => {
      const scores = [
        (data.avail - 50) * 2,
        (data.mtbf / 500) * 80,
        (10 - data.mttr) * 8,
        (400 - data.downtime) / 5,
        (30 - data.freq) * 2.6
      ];

      const angleStep = (Math.PI * 2) / 5;
      const centerX = 100;
      const centerY = 100;

      return scores.map((score, i) => {
        const angle = i * angleStep - Math.PI / 2;

        const x = centerX + Math.max(10, score) * Math.cos(angle);
        const y = centerY + Math.max(10, score) * Math.sin(angle);

        return { x, y, score };
      });
    };

  const radarLabels = [
      "Availability",
      "MTBF",
      "MTTR",
      "Downtime",
      "Frequency"
    ];

  const pointsA = getRadarPoints(dataA);
  const pointsB = getRadarPoints(dataB);

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      
      {/* 1. SELECTION FILTERS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[ { id: 'A', state: unitA, setter: setUnitA, color: 'border-[#005a32]' }, 
           { id: 'B', state: unitB, setter: setUnitB, color: 'border-blue-600' }
        ].map((p) => (
          <div key={p.id} className={`bg-white p-5 rounded-xl border-t-4 ${p.color} shadow-sm space-y-3`}>
            <div className="flex items-center gap-2 font-black uppercase text-xs text-slate-700">
              <Filter size={16} className="text-slate-400" /> Filter Unit {p.id}
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Pilih Unit Seleksi:</label>
              <select 
                value={p.state} 
                onChange={(e) => p.setter(e.target.value)}
                className="w-full text-xs font-bold bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Object.keys(unitData).map(key => (
                  <option key={key} value={key}>{key} ({unitData[key].loc?.split(' - ')[0]})</option>
                ))}
              </select>
            </div>
          </div>
        ))}
      </div>

      {/* 2. SPECS COMPARISON */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[dataA, dataB].map((data, idx) => (
          <div key={idx} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className={`p-3 px-5 text-white text-[10px] font-black uppercase tracking-widest flex items-center justify-between ${idx === 0 ? 'bg-[#005a32]' : 'bg-blue-600'}`}>
              <div className="flex items-center gap-2"><ShieldCheck size={14} /> {idx === 0 ? unitA : unitB} Technical Specs</div>
              <span className="opacity-50 text-[9px] font-mono">{data.loc}</span>
            </div>
            <table className="w-full text-[11px] font-bold">
              <tbody className="divide-y divide-slate-100 uppercase tracking-tighter">
                <tr><td className="px-5 py-3 text-slate-400 w-1/3">Merk & Model</td><td className="px-5 py-3 text-slate-700">{data.merk}</td></tr>
                <tr><td className="px-5 py-3 text-slate-400">Engine / Power</td><td className="px-5 py-3 text-slate-700">{data.engine}</td></tr>
                <tr><td className="px-5 py-3 text-slate-400">Kapasitas</td><td className="px-5 py-3 text-red-600 font-black">{data.kapasitas}</td></tr>
                <tr className="bg-slate-50/50"><td className="px-5 py-3 text-slate-400">Tahun & Lokasi</td><td className="px-5 py-3 text-blue-600">{data.tahun}</td></tr>
              </tbody>
            </table>
          </div>
        ))}
      </div>

      {/* 3. RADAR CHART & HEAD-TO-HEAD */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Visual Radar with Legend & Axis Info */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
          <div className="flex justify-between items-center border-b pb-4 mb-8">
            <h3 className="text-xs font-black text-slate-700 uppercase tracking-widest flex items-center gap-2">
              <BarChart3 size={16} className="text-orange-500" /> Perbandingan Parameter (Radar)
            </h3>
            {/* Chart Legend */}
            <div className="flex gap-4">
               <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-[#005a32] rounded-sm"></div><span className="text-[9px] font-black text-slate-400 uppercase">{unitA}</span></div>
               <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-blue-600 rounded-sm"></div><span className="text-[9px] font-black text-slate-400 uppercase">{unitB}</span></div>
            </div>
          </div>
          
          <div className="relative h-[320px] flex items-center justify-center pt-8">
             <svg width="340" height="340" viewBox="0 0 200 200" className="overflow-visible">
                {/* Background Grid */}
                {[20, 40, 60, 80].map((r) => (
                  <polygon key={r} points={`100,${100-r} ${100+r*0.95},${100-r*0.3} ${100+r*0.58},${100+r*0.8} ${100-r*0.58},${100+r*0.8} ${100-r*0.95},${100-r*0.3}`} fill="none" stroke="#e2e8f0" strokeWidth="1" />
                ))}
                
                {/* Axis Lines */}
                <line x1="100" y1="100" x2="100" y2="20" stroke="#cbd5e1" strokeDasharray="2" />
                <line x1="100" y1="100" x2="180" y2="70" stroke="#cbd5e1" strokeDasharray="2" />
                <line x1="100" y1="100" x2="150" y2="170" stroke="#cbd5e1" strokeDasharray="2" />
                <line x1="100" y1="100" x2="50" y2="170" stroke="#cbd5e1" strokeDasharray="2" />
                <line x1="100" y1="100" x2="20" y2="70" stroke="#cbd5e1" strokeDasharray="2" />

                {/* Dynamic Shapes */}
                <polygon points={getRadarPath(dataA)} fill="rgba(0, 90, 50, 0.15)" stroke="#005a32" strokeWidth="3" 
                strokeLinejoin="round" className="transition-all duration-1000" pointerEvents="none" />
                {/* Hover Points */}
                  {pointsA.map((p, i) => (
                    <circle key={`a-${i}`} cx={p.x} cy={p.y} r="6"
                      fill="transparent"
                      onMouseEnter={() =>
                        setTooltip({
                          x: p.x, y: p.y,
                          label: radarLabels[i],
                          valueA: dataA[["avail","mtbf","mttr","downtime","freq"][i]],
                          valueB: dataB[["avail","mtbf","mttr","downtime","freq"][i]]
                        })
                      }
                      onMouseLeave={() => setTooltip(null)}
                    />
                  ))}

                <polygon points={getRadarPath(dataB)} fill="rgba(37, 99, 235, 0.15)" stroke="#2563eb" strokeWidth="3"
                strokeLinejoin="round" className="transition-all duration-1000" pointerEvents="none"/>
                {/* Hover Points */}
                  {pointsB.map((p, i) => (
                    <circle key={`b-${i}`} cx={p.x} cy={p.y} r="6"
                      fill="transparent"
                      onMouseEnter={() =>
                        setTooltip({
                          x: p.x, y: p.y,
                          label: radarLabels[i],
                          valueA: dataA[["avail","mtbf","mttr","downtime","freq"][i]],
                          valueB: dataB[["avail","mtbf","mttr","downtime","freq"][i]]
                        })
                      }
                      onMouseLeave={() => setTooltip(null)}
                    />
                  ))}

                {/* AXIS LABELS */}
                <text x="100" y="5" textAnchor="middle" className="text-[9px] font-black fill-slate-500 uppercase tracking-tighter">Availability % (Top)</text>
                <text x="190" y="65" textAnchor="start" className="text-[9px] font-black fill-slate-500 uppercase tracking-tighter">MTBF Tens (Top R)</text>
                <text x="160" y="190" textAnchor="start" className="text-[9px] font-black fill-slate-500 uppercase tracking-tighter">MTTR Score (Bot R)</text>
                <text x="40" y="190" textAnchor="end" className="text-[9px] font-black fill-slate-500 uppercase tracking-tighter">Downtime Score (Bot L)</text>
                <text x="10" y="65" textAnchor="end" className="text-[9px] font-black fill-slate-500 uppercase tracking-tighter">Freq Score (Top L)</text>

                {tooltip && (
                  <g transform={`translate(${tooltip.x}, ${tooltip.y - 12})`}>
                    <rect x="-75" y="-35"
                      width="150" height="30"
                      rx="4" fill="#0f172a"opacity="0.9"/>
                    <text x="0" y="-22"
                      textAnchor="middle" fill="white"
                      fontSize="8" fontWeight="bold">
                      {tooltip.label}
                    </text>
                    <text x="0" y="-10"
                      textAnchor="middle" fill="white"
                      fontSize="8">
                      {unitA}: {tooltip.valueA} | {unitB}: {tooltip.valueB}
                    </text>
                  </g>
                )}
             </svg>
          </div>

          <div className="mt-8 p-3 bg-slate-50 rounded-lg flex items-start gap-3">
             <Info size={16} className="text-slate-400 shrink-0 mt-0.5" />
             <p className="text-[9px] text-slate-500 leading-relaxed font-bold uppercase tracking-tight">
               Score dihitung secara normalisasi: Semakin mendekati tepi grafik, semakin baik performa unit tersebut (Downtime & MTTR yang rendah menghasilkan score tinggi).
             </p>
          </div>
        </div>

        {/* Head-to-Head Table */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col uppercase tracking-tighter">
           <h3 className="text-xs font-black text-slate-700 uppercase tracking-widest flex items-center gap-2 border-b pb-4 mb-6">
              <Target size={16} className="text-red-500" /> Analisis Head-to-Head (Data Aktual)
           </h3>
           <div className="flex-1 overflow-hidden rounded-xl border border-slate-100">
              <table className="w-full text-left text-[11px] font-bold">
                <thead className="bg-slate-50 text-slate-400 uppercase font-black border-b border-slate-100">
                  <tr><th className="px-4 py-4">KPI Parameter</th><th className="px-4 py-4 text-center">{unitA}</th><th className="px-4 py-4 text-center">{unitB}</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {[
                    { label: "Equipment Availability", key: "avail", unit: "%", type: "higher" },
                    { label: "Total Breakdown (Freq)", key: "freq", unit: "x", type: "lower" },
                    { label: "Total Downtime (Jam)", key: "downtime", unit: "h", type: "lower" },
                    { label: "MTTR (Mean Time To Repair)", key: "mttr", unit: "h", type: "lower" },
                    { label: "MTBF (Mean Time Failure)", key: "mtbf", unit: "h", type: "higher" },
                  ].map((kpi) => (
                    <tr key={kpi.key} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-4 text-slate-500">{kpi.label}</td>
                      <td className={`px-4 py-4 text-center ${isWinner(dataA[kpi.key], dataB[kpi.key], kpi.type as any) ? 'text-green-600 bg-green-50/50' : 'text-slate-800'}`}>{dataA[kpi.key]}{kpi.unit}</td>
                      <td className={`px-4 py-4 text-center ${isWinner(dataB[kpi.key], dataA[kpi.key], kpi.type as any) ? 'text-green-600 bg-green-50/50' : 'text-slate-800'}`}>{dataB[kpi.key]}{kpi.unit}</td>
                    </tr>
                  ))}
                  <tr className="bg-red-50/30">
                    <td className="px-4 py-5 text-red-600 font-black">Sistem Terlemah</td>
                    <td className="px-4 py-5 text-center text-red-700 font-black italic">{dataA.system}</td>
                    <td className="px-4 py-5 text-center text-red-700 font-black italic">{dataB.system}</td>
                  </tr>
                </tbody>
              </table>
           </div>
        </div>
      </div>
    </div>
  );
};

export default MonitoringKomparasi;