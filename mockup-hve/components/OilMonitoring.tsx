"use client";
import { useState, useMemo } from 'react';
import { Droplets, BarChart3,Search, Download } from 'lucide-react';
import {
  ResponsiveContainer, BarChart, Bar,
  Line, XAxis, YAxis,
  Tooltip, Legend, CartesianGrid,
} from "recharts";

const OilMonitoring = () => {
  const [dateRange, setDateRange] = useState({ start: "2026-03-01", end: "2026-03-30" });
  const [selectedType, setSelectedType] = useState("All");
  const [viewMode, setViewMode] = useState("monthly");
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  } | null>(null);

  // 1. Specific Oil Types & Inventory Data
  const oilStock = [
    { name: "Oli Mesin - RIMULA X 15 W 40", stock: 450, capacity: 1000, trend: "+5%" },
    { name: "Oli Transmisi - SHELL SPIRAX S4 ATF HDX", stock: 120, capacity: 500, trend: "-2%" },
    { name: "Oli Hydraulic - TELLUS 68", stock: 890, capacity: 1500, trend: "+12%" },
    { name: "Oli Gardan - SHELL SPIRAX S2 A85W140", stock: 45, capacity: 200, trend: "-8%" },
    { name: "Oli Transmisi - SUPER MARINE S3 15W-40", stock: 310, capacity: 600, trend: "0%" },
    { name: "Oli Brake - SHELL SPIRAX S4 TXM", stock: 85, capacity: 300, trend: "-15%" },
    { name: "Oli Transmisi - SHELL SPIRAX S2 G 90", stock: 180, capacity: 400, trend: "+3%" }
  ];

  // 2. Efficiency Ranking (Liters / HMU)
  const efficiencyData = [
    { id: "HVE AMB 01", ratio: 0.12, status: "Efficient", color: "text-green-600" },
    { id: "HVE JKT 05", ratio: 0.45, status: "Wasteful", color: "text-red-600" },
    { id: "HVE SBY 14", ratio: 0.18, status: "Normal", color: "text-blue-600" },
    { id: "HVE AMB 02", ratio: 0.52, status: "Critical Leak", color: "text-red-700" }
  ];

  // 3. Category Breakdown (PM vs Leaks vs Projects)
  const categoryStats = [
    { label: "Tambah Oli / Kebocoran", liters: 145, color: "bg-red-500", p: 25 },
    { label: "Oli Service / PM", liters: 340, color: "bg-blue-500", p: 58 },
    { label: "Oli Project / OH", liters: 98, color: "bg-orange-500", p: 17 }
  ];

  const [selectedLocation, setSelectedLocation] = useState("National");
  const locationSummary = [
    { name: "National", in: 185, out: 137 },
    { name: "Jakarta", in: 120, out: 90 },
    { name: "Surabaya", in: 40, out: 30 },
    { name: "Ambon", in: 25, out: 17 },
    { name: "Balikpapan", in: 60, out: 42 },
    { name: "Makassar", in: 55, out: 38 },
    { name: "Medan", in: 70, out: 50 },
  ];


  const OilOutData = [
    { date: "10-03-2026", unit: "HVE AMB 01", type: "TELLUS 68", cat: "Oli Service / PM", qty: 45, loc: "Ambon"},
    { date: "09-03-2026", unit: "HVE JKT 05", type: "RIMULA X 15 W 40", cat: "Tambah Oli / Kebocoran", qty: 12, loc: "Jakarta"},
    { date: "09-03-2026", unit: "HVE SBY 03", type: "SUPER MARINE S3", cat: "Tambah Oli / Kebocoran", qty: 15, loc: "Surabaya"},
    { date: "09-03-2026", unit: "HVE SBY 07", type: "SHELL SPIRAX S4 TXM", cat: "Tambah Oli / Kebocoran", qty: 10, loc: "Surabaya"},
    { date: "08-03-2026", unit: "HVE SBY 14", type: "SHELL SPIRAX S2 G 90", cat: "Oli Project / OH", qty: 80, loc: "Surabaya"}
  ];

  const OilInData = [
    { date: "10-03-2026", unit: "HVE AMB 01", type: "TELLUS 68", cat: "Stok Reguler Oli", qty: 60, loc: "Ambon"},
    { date: "09-03-2026", unit: "HVE JKT 05", type: "RIMULA X 15 W 40", cat: "Stok Reguler Oli", qty: 25, loc: "Jakarta"},
    { date: "08-03-2026", unit: "HVE SBY 14", type: "SHELL SPIRAX S2 G 90", cat: "Stok Reguler Oli", qty: 100, loc: "Surabaya"}
  ];

  const fleetData = [
    { id: "HVE-RS-001", type: "Reach Stacker", hmu: 1250, oil: 8200, loc: "Surabaya" },
    { id: "HVE-RS-004", type: "Reach Stacker", hmu: 1100, oil: 9500, loc: "Surabaya" },
    { id: "HVE-RS-002", type: "Reach Stacker", hmu: 1300, oil: 9600, loc: "Surabaya" },
    { id: "HVE-RS-003", type: "Reach Stacker", hmu: 1400, oil: 9200, loc: "Surabaya" },
    { id: "HVE-RS-005", type: "Reach Stacker", hmu: 1500, oil: 9300, loc: "Surabaya" },
    { id: "HVE-RS-006", type: "Reach Stacker", hmu: 1600, oil: 9400, loc: "Surabaya" },
    { id: "HVE-TR-012", type: "Trailer", hmu: 2400, oil: 12000, loc: "Jakarta" },
    { id: "HVE-TR-015", type: "Trailer", hmu: 2100, oil: 10500, loc: "Jakarta" },
  ];

  const filteredOut = useMemo(() => {
    if (selectedLocation === "National") return OilOutData;
    return OilOutData.filter(d => d.loc === selectedLocation);
  }, [selectedLocation]);

  const filteredIn = useMemo(() => {
    if (selectedLocation === "National") return OilInData;
    return OilInData.filter(d => d.loc === selectedLocation);
  }, [selectedLocation]);

  const getMetrics = (oil: number, hmu: number) => ({
    lpHm: (oil / hmu).toFixed(2), // Liters per Hour (Lower is better)
    hmPl: (hmu / oil).toFixed(4), // Hours per Liter (Higher is better)
  });

  const filteredFleet = useMemo(() => {
    if (selectedType === "All") return fleetData;
    return fleetData.filter(f => f.type === selectedType);
  }, [selectedType]);

  const monthlyData = [
    { period: "Jan", y2025: 120, y2026: 150 },
    { period: "Feb", y2025: 100, y2026: 130 },
    { period: "Mar", y2025: 140, y2026: 170 },
    { period: "Apr", y2025: 90, y2026: 110 },
    { period: "May", y2025: 160, y2026: 190 },
    { period: "Jun", y2025: 130, y2026: 160 },
    { period: "Jul", y2025: 110, y2026: 140 },
    { period: "Aug", y2025: 150, y2026: 180 },
    { period: "Sep", y2025: 120, y2026: 150 },
    { period: "Oct", y2025: 170, y2026: 210 },
    { period: "Nov", y2025: 140, y2026: 170 },
    { period: "Dec", y2025: 160, y2026: 200 },
  ];

  const weeklyData = [
    { period: "W1", y2025: 30, y2026: 50 },
    { period: "W2", y2025: 45, y2026: 60 },
    { period: "W3", y2025: 20, y2026: 40 },
    { period: "W4", y2025: 35, y2026: 55 },
    { period: "W5", y2025: 40, y2026: 65 },
    { period: "W6", y2025: 30, y2026: 50 },
    { period: "W7", y2025: 45, y2026: 65 },
    { period: "W8", y2025: 35, y2026: 55 },
    { period: "W9", y2025: 40, y2026: 60 },
    { period: "W10", y2025: 30, y2026: 50 },

  ];

  const addYoY = (data: typeof monthlyData | typeof weeklyData) =>
    data.map(d => ({
      ...d,
      yoy: (((d.y2026 - d.y2025) / d.y2025) * 100).toFixed(1)
    }));

  const chartData = useMemo(() => {
    const base = viewMode === "monthly" ? monthlyData : weeklyData;
    return addYoY(base);
  }, [viewMode]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload) return null;

    return (
      <div className="bg-white p-3 border rounded shadow text-xs">
        <p className="font-bold">{label}</p>
        {payload.map((p, i) => (
          <p key={i}>
            {p.name}: {p.value}{p.name === "YoY %" ? "%" : " L"}
          </p>
        ))}
      </div>
    );
  };

  const requestSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';

    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }

    setSortConfig({ key, direction });
  };

  const sortedFleet = useMemo(() => {
    let sortable = [...filteredFleet];

    if (sortConfig !== null) {
      sortable.sort((a, b) => {
        let aValue, bValue;

        if (sortConfig.key === "efficiency") {
          aValue = parseFloat(getMetrics(a.oil, a.hmu).lpHm);
          bValue = parseFloat(getMetrics(b.oil, b.hmu).lpHm);
        } else {
          return 0;
        }

        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return sortable;
  }, [filteredFleet, sortConfig]);

  const paretoData = useMemo(() => {
    // 1. Filter only leakage category
    const leakData = OilOutData.filter(d =>
      d.cat.includes("Kebocoran")
    );

    // 2. Aggregate by unit
    const grouped = leakData.reduce((acc, curr) => {
      if (!acc[curr.unit]) {
        acc[curr.unit] = 0;
      }
      acc[curr.unit] += curr.qty;
      return acc;
    }, {} as Record<string, number>);

    // 3. Convert to array
    let result = Object.entries(grouped).map(([unit, total]) => ({
      unit,
      total
    }));

    // 4. Sort DESC (Pareto rule)
    result.sort((a, b) => b.total - a.total);

    // 5. Calculate cumulative %
    const totalAll = result.reduce((sum, r) => sum + r.total, 0);

    let cumulative = 0;
    result = result.map(r => {
      cumulative += r.total;
      return {
        ...r,
        cumulativePct: ((cumulative / totalAll) * 100).toFixed(1)
      };
    });

    return result;
  }, [OilOutData]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header & Global Filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
          <div>
            <h2 className="text-2xl font-black flex items-center gap-2 text-slate-800 uppercase tracking-tight">
              <Droplets className="text-green-600" size={28} />
              Oil Monitoring
            </h2>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Analytics & Inventory Control</p>
          </div>
          
          <div className="flex items-center gap-3 bg-white p-2 rounded-xl shadow-sm border border-slate-200">
            <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4 uppercase tracking-tighter text-sm">
              <div className="space-y-1">
                <label className="text-[10px] font-bold">Filter Lokasi</label>
                <select className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 outline-none">
                  <option>Semua Lokasi (Nasional)</option>
                  <option>Surabaya</option>
                  <option>Jakarta</option>
                  <option>Ambon</option>
                  <option>Medan</option>
                  <option>Balikpapan</option>
                  <option>Makassar</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold">Filter Jenis Alat</label>
                <select className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 outline-none">
                  <option>Semua Jenis Alat</option>
                  <option>Reach Stacker</option>
                  <option>Crane</option>
                  <option>Forklift</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold">Filter Nama Alat</label>
                <select className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 outline-none">
                  <option>Semua Alat</option>
                  <option>RS-001</option>
                  <option>TR-001</option>
                  <option>FL-001</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold">Filter Tipe Oli</label>
                <select className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 outline-none">
                  <option>Semua Tipe Oli</option>
                  <option>Oli Mesin</option>
                  <option>Oli Transmisi (SHELL S4)</option>
                  <option>Oli Hydraulic</option>
                  <option>Oli Gardan</option>
                  <option>Oli Transmisi (S Marine)</option>
                  <option>Oli Brake</option>
                  <option>Oli Transmisi (SHELL S2)</option>
                </select>
              </div>
            </div>

            {/* <div className="flex items-center gap-2 px-3 border-r border-slate-100">
              <Calendar size={16} className="text-slate-400" />
              <input type="date" onChange={(e) => setDateRange({...dateRange, start: e.target.value})} className="text-[10px] font-bold outline-none bg-slate-100 p-2 rounded-lg" />
              <span className="text-slate-300">-</span>
              <input type="date" onChange={(e) => setDateRange({...dateRange, end: e.target.value})} className="text-[10px] font-bold outline-none bg-slate-100 p-2 rounded-lg" />
            </div>
            <button className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors">
              <Filter size={16} />
            </button> */}
          </div>
        </div>

        {/* <div className="flex gap-4 overflow-x-auto pb-2">
          {locationSummary.map((loc, i) => (
            <div
              key={i}
              onClick={() => setSelectedLocation(loc.name)}
              className={`min-w-[180px] cursor-pointer p-4 rounded-xl border shadow-sm transition-all
                ${selectedLocation === loc.name 
                  ? "bg-blue-600 text-white border-blue-600" 
                  : "bg-white border-slate-200 hover:bg-blue-50"}`}>
              <div className="text-xs font-bold uppercase tracking-wider">
                {loc.name}
              </div>
            </div>
          ))}
        </div> */}

        {/* TOP ROW: Current Stock Levels (Horizontal Scrollable Cards) */}
        {/* <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {oilStock.map((oil, i) => (
            <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm min-w-[160px]">
              <div className="flex justify-between items-start mb-3">
                <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><Droplets size={16} /></div>
                <span className={`text-[9px] font-black ${oil.trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                  {oil.trend}
                </span>
              </div>
              <div className="h-10 mb-2 flex flex-col justify-end">
                <span className="text-[11px] font-black text-slate-800 uppercase leading-none">
                  {oil.name.split(' - ')[0]}
                </span>
                <span className="text-[9px] font-bold text-slate-400 uppercase leading-tight mt-1">
                  {oil.name.split(' - ')[1]}
                </span>
              </div>
              <div className="text-xl font-black text-slate-800">{oil.stock} <span className="text-[10px] text-slate-400">L</span></div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
                <div 
                  className={`h-full ${(oil.stock/oil.capacity) < 0.2 ? 'bg-red-500' : 'bg-blue-600'}`} 
                  style={{ width: `${(oil.stock/oil.capacity) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div> */}

        {/* Double Bar With Line Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm w-full">
  
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xs font-black uppercase text-slate-600 tracking-widest">
              Oil Consumption YoY
            </h3>

            {/* Toggle */}
            <div className="flex bg-slate-100 rounded-lg p-1 text-[10px] font-bold">
              <button onClick={() => setViewMode("monthly")}
                className={`px-3 py-1 rounded ${viewMode === "monthly" ? "bg-white shadow" : ""}`}>
                Monthly
              </button>
              <button onClick={() => setViewMode("weekly")}
                className={`px-3 py-1 rounded ${viewMode === "weekly" ? "bg-white shadow" : ""}`}>
                Weekly
              </button>
            </div>
          </div>

          {/* Chart */}
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="period" />
              <YAxis yAxisId="left" tickFormatter={(value) => `${value} L`} />
              <YAxis yAxisId="right" orientation="right" tickFormatter={(value) => `${value} %`} />

              <Tooltip content={<CustomTooltip />} />
              <Legend />

              <defs>
                <linearGradient id="bar2025" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#000000" />
                  <stop offset="100%" stopColor="#66676d" />
                </linearGradient>
              </defs>

              {/* BAR 2025 */}
              <Bar fill='url(#bar2025)' yAxisId="left" dataKey="y2025" name="2025" radius={[2, 2, 0, 0]}/>
              
              <defs>
                <linearGradient id="bar2026" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#68a53d" />
                  <stop offset="100%" stopColor="#acd38f" />
                </linearGradient>
              </defs>

              {/* BAR 2026 */}
              <Bar fill='url(#bar2026)' yAxisId="left" dataKey="y2026" name="2026" radius={[2, 2, 0, 0]}/>

              {/* LINE YoY */}
              <Line yAxisId="right" type="monotone" dataKey="yoy" name="YoY %" strokeWidth={2}/>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Efficiency & Bad Actors */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm col-span-2">
            <h3 className="text-xs font-black uppercase text-slate-600 tracking-widest mb-4">
              Pareto - Leakage (YTD)
            </h3>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={paretoData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="unit" />
                
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />

                <Tooltip />
                <Legend />

                {/* BAR = total leakage */}
                <Bar fill='#66676d' yAxisId="left" dataKey="total" name="Leakage (L)" />

                {/* LINE = cumulative % */}
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="cumulativePct"
                  name="Cumulative %"
                  strokeWidth={2}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          {/* Efficiency Wasteful vs Efficient */}
          {/* <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <TrendingUp size={16} /> Equipment Efficiency (L/HMU)
            </h3>
            <div className="space-y-5 flex-1">
              {efficiencyData.map((unit, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-24 text-[10px] font-black text-slate-700">{unit.id}</div>
                  <div className="flex-1 bg-slate-50 h-3 rounded-full overflow-hidden border border-slate-100">
                    <div 
                      className={`h-full ${unit.ratio > 0.4 ? 'bg-red-500' : 'bg-green-500'}`} 
                      style={{ width: `${unit.ratio * 100}%` }}
                    ></div>
                  </div>
                  <div className={`w-20 text-right text-[10px] font-bold ${unit.color}`}>{unit.status}</div>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-slate-50 text-[10px] text-slate-400 italic">
              * Wasteful status triggered if usage exceeds 0.4L per HMU.
            </div>
          </div> */}

          {/* Usage by Category */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center items-center">
            <h3 className="text-md font-black text-slate-400 uppercase tracking-widest mb-6">Consumption Category</h3>
            <div className="flex items-center justify-center py-4">
              {/* Mockup Donut Chart */}
              <div className="relative w-40 h-40 rounded-full border-[16px] border-blue-500 border-t-red-500 border-l-orange-500 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-black text-slate-800">583</div>
                  <div className="font-bold text-slate-400 uppercase">Total Liters</div>
                </div>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              {categoryStats.map((cat, i) => (
                <div key={i} className="flex items-center justify-between text-[12px] font-bold uppercase gap-5">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${cat.color}`}></div>
                    <span className="text-slate-500">{cat.label}</span>
                  </div>
                  <span className="text-slate-800">{cat.liters} L ({cat.p}%)</span>
                </div>
              ))}
            </div>
          </div>

          {/* Critical Alerts */}
          {/* <div className="bg-slate-900 p-6 rounded-2xl shadow-xl shadow-slate-200 text-white relative overflow-hidden">
            <Database className="absolute -right-4 -bottom-4 text-white/5" size={120} />
            <h3 className="text-xs font-black text-blue-400 uppercase tracking-widest mb-4">Stock Critical Alerts</h3>
            <div className="space-y-4 relative z-10">
              <div className="flex items-start gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
                <AlertCircle className="text-red-400 shrink-0" size={18} />
                <div>
                  <p className="text-[11px] font-bold">SHELL SPIRAX S2 A85W140</p>
                  <p className="text-[9px] text-slate-400">Current stock (45L) is below Safety Threshold.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
                <AlertCircle className="text-orange-400 shrink-0" size={18} />
                <div>
                  <p className="text-[11px] font-bold">SHELL SPIRAX S4 TXM</p>
                  <p className="text-[9px] text-slate-400">High consumption rate detected in Ambon.</p>
                </div>
              </div>
            </div>
            <button className="w-full mt-6 py-2 bg-blue-600 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all">
              Create Procurement Request
            </button>
          </div> */}

        </div>

        <div className='flex flex-col col-span-2 gap-5'>
          {/* Oil OUT Log */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-4 px-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <h3 className="text-xs font-black text-slate-600 uppercase tracking-widest flex items-center gap-2">
                  <BarChart3 size={16} className='text-green-600' /> Monthly Oil Usage Log (OUT)
                </h3>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                    <input type="text" placeholder="Search machine or oil type..." className="pl-8 pr-4 py-1.5 text-[10px] border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 w-64" />
                  </div>
                  <button className="bg-[#005a32] text-white px-3 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-2">
                    <Download size={14} /> EXPORT CSV
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-[12px] border-collapse">
                  <thead className="bg-slate-100/50 text-slate-500 font-black uppercase border-b border-slate-100">
                    <tr>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4">Equip Name</th>
                      <th className="px-6 py-4">Oil Type</th>
                      <th className="px-6 py-4">Category</th>
                      <th className="px-6 py-4 text-center">Qty (L)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 font-bold">
                    {filteredOut.map((row, i) => (
                      <tr key={i} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-6 py-4 text-slate-400 font-mono">{row.date}</td>
                        <td className="px-6 py-4 text-blue-800">{row.unit}</td>
                        <td className="px-6 py-4">{row.type}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-0.5 rounded text-[9px] ${row.cat.includes('Kebocoran') ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-slate-100 text-slate-600'}`}>
                            {row.cat}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center text-blue-600">{row.qty}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Oil IN Log */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-4 px-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <h3 className="text-xs font-black text-slate-600 uppercase tracking-widest flex items-center gap-2">
                  <BarChart3 size={16} className="text-green-600" /> Monthly Oil IN Log
                </h3>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                    <input type="text" placeholder="Search machine or oil type..." className="pl-8 pr-4 py-1.5 text-[10px] border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 w-64" />
                  </div>
                  <button className="bg-[#005a32] text-white px-3 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-2">
                    <Download size={14} /> EXPORT CSV
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-[12px] border-collapse">
                  <thead className="bg-slate-100/50 text-slate-500 font-black uppercase border-b border-slate-100">
                    <tr>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4">Equip Name</th>
                      <th className="px-6 py-4">Oil Type</th>
                      <th className="px-6 py-4">Category</th>
                      <th className="px-6 py-4 text-center">Qty (L)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 font-bold">
                    {filteredIn.map((row, i) => (
                      <tr key={i} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-6 py-4 text-slate-400 font-mono">{row.date}</td>
                        <td className="px-6 py-4 text-blue-800">{row.unit}</td>
                        <td className="px-6 py-4">{row.type}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-0.5 rounded text-[9px] ${row.cat.includes('Stok') ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-slate-100 text-slate-600'}`}>
                            {row.cat}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center text-blue-600">{row.qty}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        
        {/* Detailed Comparison Table */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm col-span-2">
          <div className="bg-[#005a32] text-white p-4 px-6 flex justify-between items-center">
            <h3 className="text-xs font-black uppercase tracking-widest">Fleet Efficiency Breakdown</h3>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" />
              <input type="text" placeholder="Search Unit ID..." className="bg-white/10 border-none rounded-full pl-9 pr-15 py-2 text-[12px] text-white placeholder-white/50 outline-none focus:ring-1 focus:ring-white/30" />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[12px] border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-black uppercase border-b border-slate-100">
                  <th className="px-6 py-4">Equip Name</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4 text-center">HM Total</th>
                  <th className="px-6 py-4 text-center">Oil (L)</th>
                  <th onClick={() => requestSort("efficiency")} className="px-6 py-4 cursor-pointer text-center text-blue-600">Efficiency (L/HM)</th>
                  {/* <th className="px-6 py-4 text-center">Economy (HM/L)</th> */}
                  <th className="px-6 py-4 text-center">Insight</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 font-bold uppercase">
                {sortedFleet.map((unit, i) => {
                  if (selectedLocation !== "National" && unit.loc !== selectedLocation) return null;
                  const m = getMetrics(unit.oil, unit.hmu);
                  const isInefficient = parseFloat(m.lpHm) > 7.0;
                  return (
                    <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 text-blue-700 font-black">{unit.id}</td>
                      <td className="px-6 py-4 text-slate-400">{unit.loc}</td>
                      <td className="px-6 py-4 text-center">{unit.hmu} h</td>
                      <td className="px-6 py-4 text-center">{unit.oil} L</td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                            <span className={isInefficient ? 'text-red-500' : 'text-green-600'}>{m.lpHm}</span>
                            <div className="w-12 h-1 bg-slate-100 rounded-full overflow-hidden">
                              <div className={`h-full ${isInefficient ? 'bg-red-500' : 'bg-green-500'}`} style={{ width: `${(parseFloat(m.lpHm)/10)*100}%` }}></div>
                            </div>
                        </div>
                      </td>
                      {/* <td className="px-6 py-4 text-center text-slate-500">{m.hmPl}</td> */}
                      <td className="px-6 py-4 text-center">
                        <span className={`px-2 py-0.5 rounded text-[9px] ${isInefficient ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-green-50 text-green-700 border border-green-100'}`}>
                          {isInefficient ? 'WASTEFUL' : 'EFFICIENT'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default OilMonitoring;