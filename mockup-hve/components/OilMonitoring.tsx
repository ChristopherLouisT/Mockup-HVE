"use client";
import React, { useState, useMemo } from 'react';
import { 
  Droplets, 
  BarChart3, Calendar, Filter, Database, 
  AlertCircle, TrendingUp, Search, Download
} from 'lucide-react';

const OilMonitoring = () => {
  const [dateRange, setDateRange] = useState({ start: "2026-03-01", end: "2026-03-30" });

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
    { date: "08-03-2026", unit: "HVE SBY 14", type: "SHELL SPIRAX S2 G 90", cat: "Oli Project / OH", qty: 80, loc: "Surabaya"}
  ];

  const OilInData = [
    { date: "10-03-2026", unit: "HVE AMB 01", type: "TELLUS 68", cat: "Stok Reguler Oli", qty: 60, loc: "Ambon"},
    { date: "09-03-2026", unit: "HVE JKT 05", type: "RIMULA X 15 W 40", cat: "Stok Reguler Oli", qty: 25, loc: "Jakarta"},
    { date: "08-03-2026", unit: "HVE SBY 14", type: "SHELL SPIRAX S2 G 90", cat: "Stok Reguler Oli", qty: 100, loc: "Surabaya"}
  ];

  const filteredOut = useMemo(() => {
    if (selectedLocation === "National") return OilOutData;
    return OilOutData.filter(d => d.loc === selectedLocation);
  }, [selectedLocation]);

  const filteredIn = useMemo(() => {
    if (selectedLocation === "National") return OilInData;
    return OilInData.filter(d => d.loc === selectedLocation);
  }, [selectedLocation]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header & Global Filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
          <div>
            <h2 className="text-2xl font-black flex items-center gap-2 text-slate-800 uppercase tracking-tight">
              <Droplets className="text-blue-600" size={28} />
              Oil Monitoring
            </h2>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Analytics & Inventory Control</p>
          </div>
          
          <div className="flex items-center gap-3 bg-white p-2 rounded-xl shadow-sm border border-slate-200">
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 uppercase tracking-tighter text-sm">
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
            </div>

            <div className="flex items-center gap-2 px-3 border-r border-slate-100">
              <Calendar size={16} className="text-slate-400" />
              <input type="date" onChange={(e) => setDateRange({...dateRange, start: e.target.value})} className="text-[10px] font-bold outline-none bg-slate-100 p-2 rounded-lg" />
              <span className="text-slate-300">-</span>
              <input type="date" onChange={(e) => setDateRange({...dateRange, end: e.target.value})} className="text-[10px] font-bold outline-none bg-slate-100 p-2 rounded-lg" />
            </div>
            <button className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors">
              <Filter size={16} />
            </button>
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
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {oilStock.map((oil, i) => (
            <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm min-w-[160px]">
              <div className="flex justify-between items-start mb-3">
                <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><Droplets size={16} /></div>
                <span className={`text-[9px] font-black ${oil.trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                  {oil.trend}
                </span>
              </div>
              <div className="h-10 mb-2 flex flex-col justify-end">
                {/* Category Part (Bigger) */}
                <span className="text-[11px] font-black text-slate-800 uppercase leading-none">
                  {oil.name.split(' - ')[0]}
                </span>
                {/* Brand/Type Part (Smaller) */}
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
        </div>

        {/* MIDDLE ROW: Efficiency & Bad Actors */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Efficiency Wasteful vs Efficient */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
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
          </div>

          {/* Usage by Category */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Consumption Category</h3>
            <div className="flex items-center justify-center py-4">
              {/* Mockup Donut Chart */}
              <div className="relative w-40 h-40 rounded-full border-[16px] border-blue-500 border-t-red-500 border-l-orange-500 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-black text-slate-800">583</div>
                  <div className="text-[9px] font-bold text-slate-400 uppercase">Total Liters</div>
                </div>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              {categoryStats.map((cat, i) => (
                <div key={i} className="flex items-center justify-between text-[10px] font-bold uppercase">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${cat.color}`}></div>
                    <span className="text-slate-500">{cat.label}</span>
                  </div>
                  <span className="text-slate-800">{cat.liters} L ({cat.p}%)</span>
                </div>
              ))}
            </div>
          </div>

          {/* Critical Alerts */}
          <div className="bg-slate-900 p-6 rounded-2xl shadow-xl shadow-slate-200 text-white relative overflow-hidden">
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
          </div>

        </div>

        {/* Oil OUT Log */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 px-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <h3 className="text-xs font-black text-slate-600 uppercase tracking-widest flex items-center gap-2">
              <BarChart3 size={16} /> Monthly Oil Usage Log (OUT)
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
            <table className="w-full text-left text-[11px] border-collapse">
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
              <BarChart3 size={16} /> Monthly Oil IN Log
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
            <table className="w-full text-left text-[11px] border-collapse">
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
    </div>
  );
};

export default OilMonitoring;