"use client";
import React, { useState, useMemo } from 'react';
import { 
  Fuel, Gauge, TrendingUp, Filter, Search, Download, 
  BarChart3, MapPin, Zap, CheckCircle2, AlertTriangle,
  ArrowRight, Activity
} from 'lucide-react';

const FuelMonitoring = () => {
  const [selectedType, setSelectedType] = useState("All");
  const [unitA, setUnitA] = useState("HVE-RS-001");
  const [unitB, setUnitB] = useState("HVE-RS-004");

  const [selectedLocation, setSelectedLocation] = useState("National");
  const locationSummary = [
    { name: "National", hmu: 12400, fuel: 8600 },

    { name: "Jakarta", hmu: 3200, fuel: 2200 },
    { name: "Surabaya", hmu: 2600, fuel: 1800 },
    { name: "Balikpapan", hmu: 1800, fuel: 1300 },
    { name: "Makassar", hmu: 1600, fuel: 1100 },
    { name: "Medan", hmu: 1500, fuel: 1050 },
    { name: "Ambon", hmu: 700, fuel: 550 },
  ];

  // Mock Data for Comparison
  const fleetData = [
    { id: "HVE-RS-001", type: "Reach Stacker", hmu: 1250, fuel: 8200, loc: "Surabaya" },
    { id: "HVE-RS-004", type: "Reach Stacker", hmu: 1100, fuel: 9500, loc: "Surabaya" },
    { id: "HVE-TR-012", type: "Trailer", hmu: 2400, fuel: 12000, loc: "Jakarta" },
    { id: "HVE-TR-015", type: "Trailer", hmu: 2100, fuel: 10500, loc: "Jakarta" },
  ];

  // Mock Data for graphs (Monthly Consumption for the last 6 months)
  const monthlyData = {
    "HVE-RS-001": [120, 140, 130, 150, 160, 170],
    "HVE-RS-004": [150, 160, 155, 170, 180, 190],
    "HVE-TR-012": [200, 210, 205, 220, 230, 240],
    "HVE-TR-015": [180, 175, 190, 200, 210, 220],
  };

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN"];

  // Calculation Logic
  const getMetrics = (fuel: number, hmu: number) => ({
    lpHm: (fuel / hmu).toFixed(2), // Liters per Hour (Lower is better)
    hmPl: (hmu / fuel).toFixed(4), // Hours per Liter (Higher is better)
  });

  const statsA = useMemo(() => {
    const data = fleetData
    .filter(u => selectedLocation === "National" || u.loc === selectedLocation)
    .find(u => u.id === unitA) || fleetData[0];
    return { ...data, ...getMetrics(data.fuel, data.hmu) };
  }, [unitA]);

  const statsB = useMemo(() => {
    const data = fleetData
      .filter(u => selectedLocation === "National" || u.loc === selectedLocation)
      .find(u => u.id === unitB) || fleetData[1];
    return { ...data, ...getMetrics(data.fuel, data.hmu) };
  }, [unitB]);

  const unitAWins = parseFloat(statsA.lpHm) < parseFloat(statsB.lpHm);
  
  const filteredFleet = useMemo(() => {
    if (selectedType === "All") return fleetData;
    return fleetData.filter(f => f.type === selectedType);
  }, [selectedType]);

  // Aggregating data by Equipment Type
  const aggregatedTrendData = useMemo(() => {
    const types = ["Reach Stacker", "Trailer", "Forklift"];
    
    return types.map(type => {
      // 1. Get all units belonging to this type
      const unitsOfType = fleetData.filter(f => f.type === type);
      
      // 2. Sum their monthly data [Jan, Feb, Mar, Apr, May, Jun]
      const summedData = [0, 0, 0, 0, 0, 0].map((_, monthIdx) => {
        return unitsOfType.reduce((sum, unit) => {
          return sum + (monthlyData[unit.id as keyof typeof monthlyData]?.[monthIdx] || 0);
        }, 0);
      });

      return { type, data: summedData };
    }).filter(group => {
      // If user selected a specific type, only show that line. If "All", show all.
      if (selectedType === "All") return true;
      return group.type === selectedType;
    });
  }, [selectedType, fleetData, monthlyData]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black flex items-center gap-2 text-slate-800 uppercase tracking-tight">
              <Activity className="text-blue-600" size={28} />
              Fuel Efficiency Analysis
            </h2>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Compare Performance Metrics</p>
          </div>
          
          <div className="flex items-center gap-3">
            <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500 shadow-sm">
              <option value="All">All Equipment</option>
              <option value="Reach Stacker">Reach Stacker</option>
              <option value="Trailer">Trailer</option>
              <option value="Forklift">Forklift</option>
            </select>
            <button className="bg-blue-600 text-white px-5 py-2 rounded-xl text-xs font-black shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all flex items-center gap-2">
              <Download size={16} /> EXPORT
            </button>
          </div>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-2">
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
              <div className="mt-2 text-lg px-2 py-0.5 rounded">
                {loc.fuel} <span className="text-[10px] font-black">Liter Fuel</span>
              </div>
              <div className="text-sm opacity-80 px-2 py-0.5 rounded">
                {loc.hmu} <span className="text-[15px] font-black">HM</span>
              </div>
            </div>
          ))}
        </div>

        {/* Efficiency KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest block mb-1">Total Consumption</span>
            <div className="text-3xl font-black text-slate-800">166,420 <span className="text-sm text-slate-400 font-bold">L</span></div>
            <div className="mt-2 text-[10px] font-bold text-green-500 flex items-center gap-1">
              <TrendingUp size={12} /> -2.4% vs Last Month
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest block mb-1">Avg Efficiency</span>
            <div className="text-3xl font-black text-blue-600">7.24 <span className="text-sm text-slate-400 font-bold">L / HM</span></div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
              <div className="bg-blue-600 h-full w-[70%]"></div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest block mb-1">Total Operational</span>
            <div className="text-3xl font-black text-slate-800">722,850 <span className="text-sm text-slate-400 font-bold">HM</span></div>
            <p className="mt-2 text-[10px] font-bold text-slate-400 uppercase">Across 32 Active Units</p>
          </div>
        </div>

        {/* COMPARISON UNIT BOXES */}
        <div className="grid grid-cols-1 lg:grid-cols-11 gap-4 items-center">
          
          {/* Unit A */}
          <div className={`lg:col-span-5 p-6 rounded-3xl border-2 transition-all ${unitAWins ? 'bg-blue-50/30 border-blue-500 shadow-xl shadow-blue-100' : 'bg-white border-slate-100 opacity-80'}`}>
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className={`text-[9px] font-black px-2 py-1 rounded uppercase ${unitAWins ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'}`}>Unit A</span>
                <select value={unitA} onChange={(e) => setUnitA(e.target.value)}
                  className="block mt-2 text-xl font-black bg-transparent outline-none cursor-pointer">
                  {filteredFleet
                    .filter(u => selectedLocation === "National" || u.loc === selectedLocation)
                    .map(u => (
                      <option key={u.id} value={u.id}>
                        {u.id}
                      </option>
                    ))
                  }
                </select>
                <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 mt-1 uppercase">
                   <MapPin size={10} /> {statsA.loc}
                </div>
              </div>
              {unitAWins && <div className="p-2 bg-blue-100 text-blue-600 rounded-full"><CheckCircle2 size={24} /></div>}
            </div>

            <div className="grid grid-cols-2 gap-4 border-y border-slate-100 py-6 my-2">
              <div className="text-center">
                <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Liters / HM</p>
                <p className={`text-2xl font-black ${unitAWins ? 'text-blue-600' : 'text-slate-700'}`}>{statsA.lpHm}</p>
              </div>
              <div className="text-center border-l border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase mb-1">HM / Liter</p>
                <p className="text-2xl font-black text-slate-700">{statsA.hmPl}</p>
              </div>
            </div>

            <div className="pt-4 flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase">
              <span>Total: {statsA.fuel} L</span>
              <span>Total: {statsA.hmu} HM</span>
            </div>
          </div>

          {/* VS Center */}
          <div className="lg:col-span-1 flex justify-center">
            <div className="h-12 w-12 rounded-full bg-slate-800 text-white flex items-center justify-center font-black italic shadow-lg">VS</div>
          </div>

          {/* Unit B */}
          <div className={`lg:col-span-5 p-6 rounded-3xl border-2 transition-all ${!unitAWins ? 'bg-blue-50/30 border-blue-500 shadow-xl shadow-blue-100' : 'bg-white border-slate-100 opacity-80'}`}>
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className={`text-[9px] font-black px-2 py-1 rounded uppercase ${!unitAWins ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'}`}>Unit B</span>
                <select value={unitB} onChange={(e) => setUnitB(e.target.value)}
                  className="block mt-2 text-xl font-black bg-transparent outline-none cursor-pointer">
                  {filteredFleet
                    .filter(u => selectedLocation === "National" || u.loc === selectedLocation)
                    .map(u => (
                      <option key={u.id} value={u.id}>
                        {u.id}
                      </option>
                    ))
                  }
                </select>
                <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 mt-1 uppercase">
                   <MapPin size={10} /> {statsB.loc}
                </div>
              </div>
              {!unitAWins && <div className="p-2 bg-blue-100 text-blue-600 rounded-full"><CheckCircle2 size={24} /></div>}
            </div>

            <div className="grid grid-cols-2 gap-4 border-y border-slate-100 py-6 my-2">
              <div className="text-center">
                <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Liters / HM</p>
                <p className={`text-2xl font-black ${!unitAWins ? 'text-blue-600' : 'text-slate-700'}`}>{statsB.lpHm}</p>
              </div>
              <div className="text-center border-l border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase mb-1">HM / Liter</p>
                <p className="text-2xl font-black text-slate-700">{statsB.hmPl}</p>
              </div>
            </div>

            <div className="pt-4 flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase">
              <span>Total: {statsB.fuel} L</span>
              <span>Total: {statsB.hmu} HM</span>
            </div>
          </div>
        </div>

        {/* LINE GRAPH SECTION */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <BarChart3 size={16} className="text-blue-600" /> Consumption Trend Analysis
            </h3>
            <div className="flex gap-4 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
              {aggregatedTrendData.map((group, i) => (
                <div key={group.type} className="flex items-center gap-1.5">
                  <div 
                    className="w-2 h-2 rounded-full" 
                    style={{ backgroundColor: i === 0 ? "#2563eb" : i === 1 ? "#16a34a" : i === 2 ? "#dc2626" : "#f59e0b" }} 
                  />
                  <span className="text-[10px] font-black text-slate-600 uppercase">{group.type}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="h-64 w-full relative pt-4">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 1000 200" preserveAspectRatio="none">
              {/* GRID LINES */}
              {[0, 50, 100, 150, 200].map((y, i) => (
                <line key={i} x1="0" x2="1000" y1={y} y2={y} stroke="#f1f5f9" strokeWidth="1" />
              ))}

              {/* DYNAMIC GRADIENT DEFS */}
              <defs>
                {filteredFleet.map((unit, i) => (
                  <linearGradient key={`grad-${unit.id}`} id={`grad-${unit.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor={i === 0 ? "#2563eb" : i === 1 ? "#16a34a" : i === 2 ? "#dc2626" : "#f59e0b"} stopOpacity="0.2" />
                    <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                  </linearGradient>
                ))}
              </defs>

              {hoveredIndex !== null && (
                <line 
                  x1={(hoveredIndex / (months.length - 1)) * 1000} 
                  x2={(hoveredIndex / (months.length - 1)) * 1000} 
                  y1="0" y2="200" 
                  stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4 4" 
                />
              )}

              {/* RENDERING LINES AND AREAS */}
              {aggregatedTrendData.map((group, i) => {
                const color = i === 0 ? "#2563eb" : i === 1 ? "#16a34a" : "#dc2626";
                
                // Dynamic max for high aggregated values
                const chartMax = Math.max(...aggregatedTrendData.flatMap(g => g.data), 100);
                
                // Custom Y calculation for this loop
                const getY = (val: number) => 200 - (val / chartMax) * 180;

                // Modified generatePath for aggregated values
                const pathData = group.data.map((val, idx) => {
                  const x = (idx / (months.length - 1)) * 1000;
                  const y = getY(val);
                  return `${idx === 0 ? "M" : "L"}${x},${y}`;
                }).join(" ");

                return (
                  <g key={group.type}>
                    <path d={pathData} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" />
                    {hoveredIndex !== null && (
                      <circle 
                        cx={(hoveredIndex / (months.length - 1)) * 1000} 
                        cy={getY(group.data[hoveredIndex])} 
                        r="5" fill={color} stroke="white" strokeWidth="2" 
                      />
                    )}
                  </g>
                );
              })}

              {months.map((_, idx) => (
                <rect key={idx} x={(idx / (months.length - 1)) * 1000 - 50} 
                  y="0" width="100" height="200" fill="transparent" className="cursor-crosshair"
                  onMouseEnter={() => setHoveredIndex(idx)} onMouseLeave={() => setHoveredIndex(null)}
                />
              ))}
            </svg>

            {hoveredIndex !== null && (
              <div className="absolute top-0 z-50 bg-white border border-slate-200 shadow-2xl rounded-xl p-3 pointer-events-none min-w-[140px]"
                style={{ 
                  left: `${(hoveredIndex / (months.length - 1)) * 100}%`, 
                  transform: `translateX(${hoveredIndex > 3 ? '-110%' : '10%'})` 
                }}>
                <p className="text-[10px] font-black text-slate-400 uppercase mb-2 border-b border-slate-50 pb-1">
                  {months[hoveredIndex]} Usage
                </p>
                
                <div className="space-y-1.5">
                  {aggregatedTrendData.map((group, i) => {
                    // 1. Get the specific value for this unit and this month
                    const value = group.data[hoveredIndex!];
                    
                    // 2. Define the color based on the unit's index (matching your lines)
                    const color = i === 0 ? "#2563eb" : i === 1 ? "#16a34a" : i === 2 ? "#dc2626" : "#f59e0b";

                    return (
                      <div key={group.type} className="flex justify-between items-center gap-4">
                        {/* Unit Identifier */}
                        <div className="flex items-center gap-1.5">
                          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
                          <span className="text-[10px] font-bold text-slate-600">{group.type}</span>
                        </div>
                        
                        {/* The Value */}
                        <span className="text-[11px] font-black text-slate-800">
                          {value.toLocaleString()} L
                        </span>
                      </div>
                    );
                  })}
                </div>

              </div>
            )}

            {/* X-AXIS LABELS */}
            <div className="flex justify-between border-t border-slate-100 mt-2">
              {["JAN", "FEB", "MAR", "APR", "MAY", "JUN"].map((m) => (
                <span key={m} className="text-[9px] font-black text-slate-400 tracking-tighter">{m}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Detailed Comparison Table */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="bg-[#005a32] text-white p-4 px-6 flex justify-between items-center">
            <h3 className="text-xs font-black uppercase tracking-widest">Fleet Efficiency Breakdown</h3>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" />
              <input type="text" placeholder="Search Unit ID..." className="bg-white/10 border-none rounded-full pl-9 pr-4 py-1.5 text-[10px] text-white placeholder-white/50 outline-none focus:ring-1 focus:ring-white/30" />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[11px] border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-black uppercase border-b border-slate-100">
                  <th className="px-6 py-4">Equip Name</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4 text-center">HM Total</th>
                  <th className="px-6 py-4 text-center">Fuel (L)</th>
                  <th className="px-6 py-4 text-center text-blue-600">Efficiency (L/HM)</th>
                  <th className="px-6 py-4 text-center">Economy (HM/L)</th>
                  <th className="px-6 py-4 text-right">Insight</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 font-bold uppercase">
                {filteredFleet.map((unit, i) => {
                  if (selectedLocation !== "National" && unit.loc !== selectedLocation) return null;
                  const m = getMetrics(unit.fuel, unit.hmu);
                  const isInefficient = parseFloat(m.lpHm) > 7.0;
                  return (
                    <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 text-blue-700 font-black">{unit.id}</td>
                      <td className="px-6 py-4 text-slate-400">{unit.loc}</td>
                      <td className="px-6 py-4 text-center">{unit.hmu} h</td>
                      <td className="px-6 py-4 text-center">{unit.fuel} L</td>
                      <td className="px-6 py-4 text-center">
                         <div className="flex items-center justify-center gap-2">
                            <span className={isInefficient ? 'text-red-500' : 'text-green-600'}>{m.lpHm}</span>
                            <div className="w-12 h-1 bg-slate-100 rounded-full overflow-hidden">
                               <div className={`h-full ${isInefficient ? 'bg-red-500' : 'bg-green-500'}`} style={{ width: `${(parseFloat(m.lpHm)/10)*100}%` }}></div>
                            </div>
                         </div>
                      </td>
                      <td className="px-6 py-4 text-center text-slate-500">{m.hmPl}</td>
                      <td className="px-6 py-4 text-right">
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

export default FuelMonitoring;