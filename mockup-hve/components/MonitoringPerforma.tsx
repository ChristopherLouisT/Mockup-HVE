"use client";
import { useState, useMemo  } from 'react';
import { 
  Activity, Wrench, Clock, AlertTriangle, 
  PieChart as PieIcon, Gauge, Info, BarChart3,
  TrendingUp, History, ChevronUp, ChevronDown
} from 'lucide-react';

const MonitoringPerforma = () => {
  const [hoveredMonth, setHoveredMonth] = useState<number | null>(null);
  const [hoveredRoot, setHoveredRoot] = useState<number | null>(null);
  const totalNDT = 142;

  // 1. KPI Stats Data
  const stats = [
    { label: "Availability Rate", mean: "72%", median: "65%", sub: "Average Availability", color: "text-green-600", icon: Activity },
    { label: "Mean Time to Repair (MTTR)", mean: "3.0 Hrs", median: "2.8 Hrs", sub: "Average TTR", color: "text-red-600", icon: Wrench },
    { label: "Mean Time Between Failures (MTBF)", mean: "315 Hrs", median: "300 Hrs", sub: "Average MTBF", color: "text-blue-600", icon: Clock },
    { label: "Number Downtime (NDT)", mean: `${totalNDT} NDT`, sub: "Total Number Downtime", color: "text-orange-600", icon: Gauge },
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

  const rootDetails: Record<string, any[]> = {
    Engine: [
      { sub: "Engine A", problem: "Overheat", freq: 36 },
      { sub: "Engine B", problem: "Leak", freq: 24 },
      { sub: "Engine C", problem: "Slipping", freq: 5 },
      { sub: "Engine D", problem: "Broken", freq: 2 },
      { sub: "Engine E", problem: "Dirty", freq: 7 },
    ],
    Hydraulic: [
      { sub: "Pump", problem: "Misuse", freq: 21 },
    ],
    Electrical: [
      { sub: "Battery", problem: "Low voltage", freq: 13 },
      { sub: "Wiring", problem: "Short circuit", freq: 8 },
    ],
    Others: [
      { sub: "Weather", problem: "Heavy rain", freq: 3 },
      { sub: "Terrain", problem: "Rough road", freq: 4 },
    ],
  };

  const donutGradient = `conic-gradient(
    #f97316 0% 45%, 
    #60a5fa 45% 70%, 
    #22c55e 70% 85%, 
    #22d3ee 85% 95%, 
    #cbd5e1 95% 100%
  )`;


  // SRT Section
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPort, setSelectedPort] = useState("ALL PORTS");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'asc' });
  const [selectedRoot, setSelectedRoot] = useState<number | null>(null);

  // --- DUMMY DATA ---
  const initialActiveLogs = [
    { id: 'SPK-001', type: 'REACH STACKER', name: 'HVE AMB 01 / JATAYU (-)', loc: 'AMBON', system: 'ENGINE, FUEL SYSTEM', failureType: 'OLI BOCOR, OVERHEAT, RPM DROP', actionType: 'GANTI SEAL, CLEAN RADIATOR/COOLER, CLEAN JALUR SOLAR', staff: 'Budi (M), Anto (H)', start: '03-03-2026 08:30', current: 6.0, target: 4.0, status: 'OVERDUE' },
    { id: 'SPK-002', type: 'FORKLIFT', name: 'HVE JKT 05 / FL TCM', loc: 'JAKARTA', system: 'TRANSMISSION', failureType: 'OVERHAUL, BOX FUSE LONGGAR', actionType: 'OVERHAUL & REPAIR POMPA TRANSMISI, GANTI BOX FUSE BARU', staff: 'Yanto (M), Rian (H)', start: '03-03-2026 14:15', current: 2.5, target: 5.0, status: 'ON TRACK' },
    { id: 'SPK-005', type: 'CRANE', name: 'HVE SBY 22 / RS KONE', loc: 'SURABAYA', system: 'DRIVESHAFT', failureType: 'BAUT JOINT DRUM SWING KENDOR', actionType: 'PERBAIKI / GANTI BAUT JOINT & PLAT', staff: 'Slamet (M), Adi (H)', start: '04-03-2026 09:00', current: 1.2, target: 3.0, status: 'ON TRACK' },
  ];

  const initialHistoryLogs = [
    { id: 'SPK-003', type: 'CRANE', name: 'HVE SBY 14 / RS KONE', loc: 'SURABAYA', system: 'DRIVESHAFT', failureType: 'BAUT JOINT DRUM SWING KENDOR', actionType: 'PERBAIKI / GANTI BAUT JOINT & PLAT', staff: 'Agus P. (M), Dani (H)', start: '02-03-2026 08:00', end: '02-03-2026 11:30', labor: 0.5, part: 0.5, repair: 2.0, other: 0.5, final: 3.5, target: 4.0, status: 'ACHIEVED SRT' },
    { id: 'SPK-004', type: 'REACH STACKER', name: 'HVE AMB 02 / BENGKEL', loc: 'AMBON', system: 'FUEL SYSTEM', failureType: 'RPM DROP', actionType: 'CLEAN JALUR SOLAR', staff: 'Heru (M), Jojo (H)', start: '01-03-2026 10:00', end: '01-03-2026 16:00', labor: 1.0, part: 2.0, repair: 3.0, other: 0.0, final: 6.0, target: 4.0, status: 'EXCEEDED SRT' },
    { id: 'SPK-006', type: 'FORKLIFT', name: 'HVE JKT 09 / FL TCM', loc: 'JAKARTA', system: 'TRANSMISSION', failureType: 'OVERHAUL', actionType: 'OVERHAUL', staff: 'Doni (M), Eka (H)', start: '01-03-2026 13:00', end: '01-03-2026 15:12', labor: 0.2, part: 1.0, repair: 1.0, other: 0.0, final: 2.2, target: 3.0, status: 'ACHIEVED SRT' },
  ];

  const parseDateString = (dateStr: string) => {
    const [datePart, timePart] = dateStr.split(' ');
    const [day, month, year] = datePart.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    if (timePart) {
      const [hours, minutes] = timePart.split(':').map(Number);
      date.setHours(hours, minutes, 0, 0);
    }
    return date;
  };

  const requestSort = (key: string) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
  };

  const getSortedData = (data: any[]) => {
    const sortableData = [...data];
    if (sortConfig.key) {
      sortableData.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return sortableData;
  };

  const filterEngine = (logs: any[]) => {
    let data = getSortedData(logs);
    if (selectedPort !== "ALL PORTS") {
      const portName = selectedPort.split(' - ')[1].toUpperCase(); 
      data = data.filter(log => log.loc.toUpperCase() === portName);
    }
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      data = data.filter(log => 
        log.name.toLowerCase().includes(query) || log.type.toLowerCase().includes(query) || log.id.toLowerCase().includes(query) || log.staff.toLowerCase().includes(query)
      );
    }

    // --- DATE PERIOD FILTER LOGIC ---
    if (startDate) {
      const startOfDay = new Date(startDate);
      startOfDay.setHours(0, 0, 0, 0);
      data = data.filter(log => parseDateString(log.start) >= startOfDay);
    }
    if (endDate) {
      const endOfDay = new Date(endDate);
      endOfDay.setHours(23, 59, 59, 999);
      data = data.filter(log => parseDateString(log.start) <= endOfDay);
    }

    return data;
  };

  const filteredActive = useMemo(() => filterEngine(initialActiveLogs), [searchQuery, selectedPort, startDate, endDate, sortConfig]);
  const filteredHistory = useMemo(() => filterEngine(initialHistoryLogs), [searchQuery, selectedPort, startDate, endDate, sortConfig]);

  const SortIcon = ({ field }: { field: string }) => {
    if (sortConfig.key !== field) return <ChevronDown size={12} className="opacity-20" />;
    return sortConfig.direction === 'asc' ? <ChevronUp size={12} className="text-blue-600" /> : <ChevronDown size={12} className="text-blue-600" />;
  };

  return (

    
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Parameter Analisis */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-end gap-4">
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 font-bold uppercase tracking-tighter text-sm">
          <div className="space-y-1">
            <label className="text-[10px] text-green-700">Port/Lokasi:</label>
            <select className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 outline-none font-bold uppercase">
              <option>ALL (NASIONAL)</option>
              <option>SBY - SURABAYA</option>
              <option>JKT - JAKARTA</option>
              <option>AMB - AMBON</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] text-green-700">Jenis Alat:</label>
            <select className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 outline-none font-bold uppercase">
              <option>ALL JENIS ALAT</option>
              <option>Reach Stacker</option>
              <option>Crane</option>
              <option>Forklift</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] text-green-700">Nama Alat:</label>
            <select className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 outline-none font-bold uppercase">
              <option>SEMUA ALAT</option>
            </select>
          </div>
        </div>
        <button className="bg-black text-white px-8 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-md active:scale-95">Terapkan</button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
        {stats.map((item, idx) => (
          <div key={idx} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden group transition-all">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform"><item.icon size={48} /></div>
            <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest block mb-2">{item.label}</span>
            <div className={`text-3xl font-black ${item.color} tracking-tighter mb-1 font-mono grid gap-2 ${
              item.mean && item.median ? "grid-cols-2" : "grid-cols-1"}`}>
              {item.mean && <span>{item.mean}</span>}
              {item.median && <span>{item.median}</span>}
            </div>
            <div className={`text-3xl font-black ${item.color} tracking-tighter mb-1 font-mono grid gap-2 ${
              item.mean && item.median ? "grid-cols-2" : "grid-cols-1"}`}>
                {item.mean && 
                <span className="text-[9px] text-slate-400 font-bold italic block mt-1 uppercase tracking-tighter leading-tight">{item.sub}</span>
                }
                {item.median && 
                <span className="text-[9px] text-slate-400 font-bold italic block mt-1 uppercase tracking-tighter leading-tight">Median</span>}
            </div>
            
          </div>
        ))}
      </div>

      {/* Analytics Visualization Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
        
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
             <div className="flex flex-col justify-between text-[8px] font-bold text-slate-400 pb-8 uppercase">
                <span>6.0h</span><span>4.5h</span><span>3.0h</span><span>1.5h</span><span>0h</span>
             </div>

             <div className="flex-1 h-[250px] flex items-end justify-between px-4 relative border-l border-b border-slate-100 pb-2">
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20 px-4 pt-4 pb-8">
                   {[1,2,3,4].map(i => <div key={i} className="w-full border-t border-slate-300 border-dashed"></div>)}
                </div>

                <svg className="absolute inset-0 h-full w-full pointer-events-none px-10 pt-10" preserveAspectRatio="none">
                    <polyline fill="none" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" 
                      points="0,80 100,50 200,100 300,140 400,90 500,60" />
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

             <div className="flex flex-col justify-between text-[8px] font-bold text-green-600 pb-8 text-right">
                <span>100%</span><span>95%</span><span>90%</span><span>85%</span><span>80%</span>
             </div>
          </div>
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
          {/* Root Cause Distribution */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col col-span-2">
            <div className="flex justify-between items-center border-b pb-4 border-slate-50 mb-8">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <PieIcon size={16} className="text-orange-500" /> Distribusi Problem (Root Cause)
              </h3>
              <Info size={14} className="text-slate-300" />
            </div>
            
            <div className="flex items-start justify-between flex-1 gap-6">
              <div 
                className="relative w-44 h-44 rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-105 duration-500"
                style={{ background: donutGradient }}>
                <div className="w-28 h-28 bg-white rounded-full flex flex-col items-center justify-center shadow-inner"></div>
              </div>

              {/* Legends */}
              <div className="space-y-4 min-w-[160px]">
                {rootCauses.map((rc, i) => (
                  <div 
                    key={i} 
                    className={`group cursor-pointer relative ${selectedRoot === i ? 'bg-slate-100 p-2 rounded-lg' : ''}`}
                    onClick={() => setSelectedRoot(i)}
                    onMouseEnter={() => setHoveredRoot(i)}
                    onMouseLeave={() => setHoveredRoot(null)}>
                    {/* Floating Tooltip */}
                    {hoveredRoot === i && (
                      <div className="absolute -top-12 left-0 bg-slate-800 text-white px-2 py-1 rounded text-[9px] shadow-xl z-50 animate-in fade-in zoom-in-95 duration-200 border border-slate-600 whitespace-nowrap">
                        <span className="font-black uppercase">{rc.label}</span>: 
                        <span className={`text-white ml-1`}>
                          {Math.round((rc.p / 100) * totalNDT)} Cases
                        </span>
                        <div className="absolute -bottom-1 left-3 w-2 h-2 bg-slate-800 rotate-45 border-r border-b border-slate-600"></div>
                      </div>
                    )}

                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${rc.color} ring-2 ring-white shadow-sm group-hover:scale-110 transition-transform`}></div>
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter group-hover:text-slate-800 transition-colors">
                          {rc.label}
                        </span>
                      </div>
                      <span className="text-[10px] font-black text-slate-800">{rc.p}%</span>
                    </div>
                    
                    <div className="w-full bg-slate-50 h-1 rounded-full overflow-hidden">
                      <div 
                        className={`${rc.color} h-full transition-all duration-1000 group-hover:brightness-90`} 
                        style={{ width: `${rc.p}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="min-w-[220px] bg-slate-50 border border-slate-200 rounded-lg p-3">
                <h4 className="text-[10px] font-black uppercase text-slate-500 mb-2">
                  Detail Problem
                </h4>

                {selectedRoot !== null ? (
                  <table className="w-full text-[10px]">
                    <thead className="text-slate-400 uppercase">
                      <tr>
                        <th className="text-left py-1">Sub Area</th>
                        <th className="text-left py-1">Problem</th>
                        <th className="text-center py-1">Freq</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {rootDetails[rootCauses[selectedRoot].label]?.map((item, idx) => (
                        <tr key={idx} className="hover:bg-white transition">
                          <td className="py-1 font-bold text-slate-600">{item.sub}</td>
                          <td className="py-1 text-slate-500">{item.problem}</td>
                          <td className="py-1 text-center font-black text-slate-800">
                            {item.freq}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="text-[10px] text-slate-400 italic text-center py-6">
                    Click a category to see details
                  </div>
                )}
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
        </div>

      {/* Historical Log Table */}
      <section className="space-y-3 pt-6 border-t border-slate-200">
        <h2 className="text-blue-700 font-black italic flex items-center gap-2 text-sm tracking-tight uppercase"><History size={18} className="text-blue-600" /> Historical Log</h2>
        <div className="bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden overflow-x-auto">
          <table className="w-full text-[10px] border-collapse min-w-[1600px]">
            <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase tracking-tighter text-left">
              <tr className="divide-x divide-slate-100">
                <th rowSpan={2} className="px-2 py-4 text-center">NO. SPK</th>
                <th rowSpan={2} className="px-2 py-4">EQUIP TYPE</th>
                <th rowSpan={2} className="px-2 py-4">EQUIP NAME</th>
                <th rowSpan={2} className="px-2 py-4 text-center">LOCATION</th>
                <th rowSpan={2} className="px-2 py-4">SYSTEM</th>
                <th rowSpan={2} className="px-4 py-4 text-red-600">FAILURE TYPE</th>
                <th rowSpan={2} className="px-4 py-4 text-slate-600">ACTION TYPE</th>
                <th rowSpan={2} className="px-2 py-4 text-blue-800">MECHANIC & HELPER</th>
                <th colSpan={2} className="px-2 py-2 text-center bg-blue-50/30 border-b border-blue-100 text-blue-700 tracking-widest text-[9px]">DATETIME LOG</th>
                <th colSpan={5} className="px-2 py-2 text-center bg-yellow-50/50 border-b border-slate-200 text-yellow-700 tracking-widest text-[9px]">DOWNTIME (HOURS)</th>
                <th rowSpan={2} className="px-2 py-4 text-center bg-blue-50/50 text-blue-700">Target SRT</th>
                <th rowSpan={2} className="px-2 py-4 text-center">STATUS SRT</th>
              </tr>
              <tr className="divide-x divide-slate-200 text-[8px] uppercase">
                <th className="bg-blue-50/20 text-blue-600">Start Time</th>
                <th className="bg-blue-50/20 text-blue-600">End Time</th>
                <th className="bg-yellow-50/20 text-yellow-600">W/ Labor</th>
                <th className="bg-yellow-50/20 text-yellow-600">W/ Part</th>
                <th className="bg-yellow-50/20 text-yellow-600">Repair</th>
                <th className="bg-yellow-50/20 text-yellow-600">Other</th>
                <th className="font-black text-red-600 bg-yellow-100/50">Final DT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredHistory.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 transition-colors divide-x divide-slate-100 uppercase">
                  <td className="px-2 py-4 text-blue-600 font-black underline text-center">{log.id}</td>
                  <td className="px-2 py-4 font-black text-slate-800 tracking-tighter">{log.type}</td>
                  <td className="px-2 py-4 font-black text-slate-800 tracking-tighter">{log.name}</td>
                  <td className="px-2 py-4 text-center text-slate-400 font-bold">{log.loc}</td>
                  <td className="px-2 py-4 font-black text-slate-800 tracking-tighter">{log.system}</td>
                  <td className="px-4 py-4 text-red-600 font-bold">{log.failureType}</td>
                  <td className="px-4 py-4 text-slate-600 font-bold">{log.actionType}</td>
                  <td className="px-2 py-4 text-blue-700 font-black text-[9px] leading-tight">{log.staff}</td>
                  <td className="px-2 py-4 font-mono text-[9px] text-slate-600 bg-blue-50/10">{log.start}</td>
                  <td className="px-2 py-4 font-mono text-[9px] text-slate-600 bg-blue-50/10">{log.end}</td>
                  <td className="px-2 py-4 text-center font-bold">{log.labor.toFixed(1)}</td>
                  <td className="px-2 py-4 text-center font-bold">{log.part.toFixed(1)}</td>
                  <td className="px-2 py-4 text-center font-bold">{log.repair.toFixed(1)}</td>
                  <td className="px-2 py-4 text-center font-bold">{log.other.toFixed(1)}</td>
                  <td className="px-2 py-4 text-center bg-yellow-50/40 font-black text-red-600 text-xs shadow-inner">{log.final.toFixed(1)}</td>
                  <td className="px-2 py-4 text-center font-black text-blue-600 bg-blue-50/20">{log.target.toFixed(1)}</td>
                  <td className="px-3 py-4 text-center"><span className={`px-2 py-1 rounded-[4px] font-black uppercase text-[8px] border shadow-sm ${log.status.includes('ACHIEVED') ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>{log.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      
    </div>
  );
};

export default MonitoringPerforma;