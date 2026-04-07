"use client";
import { useState, useMemo } from 'react';
import { 
  AlertTriangle, Search, Download, Filter, History, 
  ChevronUp, ChevronDown
} from 'lucide-react';

const MonitoringSRT = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPort, setSelectedPort] = useState("ALL PORTS");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'asc' });

  // --- DUMMY DATA ---
  const initialActiveLogs = [
    { id: 'SPK-001', type: 'REACH STACKER', name: 'HVE AMB 01 / JATAYU (-)', loc: 'AMBON', system: 'ENGINE | FUEL SYSTEM', failureType: 'OLI BOCOR | OVERHEAT | RPM DROP', actionType: 'GANTI SEAL | CLEAN RADIATOR/COOLER | CLEAN JALUR SOLAR', staff: 'Budi (M), Anto (H)', start: '03-03-2026 08:30', current: 6.0, target: 4.0, status: 'OVERDUE' },
    { id: 'SPK-002', type: 'FORKLIFT', name: 'HVE JKT 05 / FL TCM', loc: 'JAKARTA', system: 'TRANSMISSION', failureType: 'OVERHAUL | BOX FUSE LONGGAR', actionType: 'OVERHAUL & REPAIR POMPA TRANSMISI | GANTI BOX FUSE BARU', staff: 'Yanto (M), Rian (H)', start: '03-03-2026 14:15', current: 2.5, target: 5.0, status: 'ON TRACK' },
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
      {/* Warning Banner */}
      {/* <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg flex items-start gap-3 shadow-sm">
        <AlertTriangle className="text-red-600 shrink-0" size={20} />
        <div>
          <h4 className="text-red-800 font-bold text-sm uppercase tracking-tight">Warning! High Priority Overdue:</h4>
          <p className="text-red-700 text-xs mt-0.5">• [SPK-001] HVE AMB 01 / JATAYU (-) exceeds SRT Target by 2.0h.</p>
        </div>
      </div> */}

      {/* Live Filters */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-6 border-b pb-4 border-slate-100 uppercase tracking-tighter font-bold">
          <div className="flex items-center gap-2"><Filter size={18} className="text-blue-600" /> Filter Analysis</div>
          <button onClick={() => {setSearchQuery(""); setSelectedPort("ALL PORTS"); setStartDate(""); setEndDate("");}} className="text-[10px] text-blue-600 hover:underline">Reset All Filters</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
            <input type="text" placeholder="Search Equipment..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2.5 text-xs border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 font-medium" />
          </div>
          <select value={selectedPort} onChange={(e) => setSelectedPort(e.target.value)} className="text-xs border border-slate-200 rounded-lg p-2.5 outline-none bg-slate-50 focus:ring-2 focus:ring-blue-500 font-bold text-slate-700">
            <option value="ALL PORTS">ALL PORTS</option>
            <option value="SBY - SURABAYA">SURABAYA (SBY)</option>
            <option value="JKT - JAKARTA">JAKARTA (JKT)</option>
            <option value="AMB - AMBON">AMBON (AMB)</option>
          </select>
          {/* Date Period Filters */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 font-bold">
            <span className="text-[9px] text-slate-400 uppercase tracking-widest">From:</span>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="bg-transparent text-[10px] outline-none w-full cursor-pointer" />
          </div>
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 font-bold">
            <span className="text-[9px] text-slate-400 uppercase tracking-widest">To:</span>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="bg-transparent text-[10px] outline-none w-full cursor-pointer" />
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2 block">Active Downtime</span>
          <div className="text-4xl font-black text-red-600">{filteredActive.length} <span className="text-xs font-bold text-slate-400">UNIT</span></div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2 block">Active Overdue SRT</span>
          <div className="text-4xl font-black text-orange-500">{filteredActive.filter(l => l.status === 'OVERDUE').length} <span className="text-xs font-bold text-slate-400">KASUS</span></div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2 block">Compliance Rate</span>
          <div className="text-4xl font-black text-blue-600">66%</div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-4 overflow-hidden"><div className="bg-blue-600 h-full w-2/3"></div></div>
        </div>
      </div>

      {/* Active Downtime Table */}
      <section className="space-y-3">
        <div className="flex justify-between items-center">
          <h2 className="text-red-600 font-black italic flex items-center gap-2 text-sm tracking-tight uppercase">
            <span className="h-3 w-3 rounded-full bg-red-600 animate-pulse"></span> Active Downtime
          </h2>
          <button className="bg-[#005a32] text-white px-3 py-1.5 rounded text-[10px] font-bold shadow-sm uppercase"><Download size={14} className="inline mr-1" /> Export</button>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden overflow-x-auto">
          <table className="w-full text-[11px] border-collapse min-w-[1400px]">
            <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase tracking-tighter text-left">
              <tr className="divide-x divide-slate-100">
                <th onClick={() => requestSort('id')} className="px-4 py-4 cursor-pointer hover:bg-slate-100">NO. SPK<SortIcon field="id" /></th>
                <th className="px-4 py-4">EQUIP TYPE</th>
                <th onClick={() => requestSort('name')} className="px-4 py-4 cursor-pointer hover:bg-slate-100">EQUIP NAME <SortIcon field="name" /></th>
                <th className="px-4 py-4 text-center">LOCATION</th>
                <th className="px-4 py-4">SYSTEM</th>
                <th className="px-4 py-4 text-red-600">FAILURE TYPE</th>
                <th className="px-4 py-4 text-slate-600">ACTION TYPE</th>
                <th className="px-4 py-4 text-blue-800">MECHANIC & HELPER</th>
                <th className="px-4 py-4">START TIME (DT)</th>
                <th onClick={() => requestSort('current')} className="px-4 py-4 text-center bg-red-50/30 cursor-pointer">CURRENT DT (H) <SortIcon field="current" /></th>
                <th className="px-4 py-4 text-center">STATUS SRT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 font-medium uppercase">
              {filteredActive.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/80 transition-colors divide-x divide-slate-50">
                  <td className="px-4 py-4 text-blue-600 font-bold underline cursor-pointer">{log.id}</td>
                  <td className="px-4 py-4 text-slate-600">{log.type}</td>
                  <td className="px-4 py-4 font-black text-red-600 tracking-tighter">{log.name}</td>
                  <td className="px-4 py-4 text-center text-slate-400 font-bold">{log.loc}</td>
                  <td className="px-4 py-4 font-black text-slate-800 text-[10px] leading-tight">
                    <div className="flex flex-col gap-1">
                      {log.system.split(' | ').map((system, i) => (
                        <div key={i} className="leading-tight border-b border-slate-100 last:border-0 pb-1 last:pb-0">{system.trim()}</div>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-4 font-black text-red-600 text-[10px]">
                    <div className="flex flex-col gap-1">
                      {log.failureType.split(' | ').map((fail, i) => (
                        <div key={i} className="leading-tight border-b border-red-50 last:border-0 pb-1 last:pb-0">{fail.trim()}</div>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-4 font-medium text-slate-500 italic text-[10px]">
                    <div className="flex flex-col gap-1">
                      {log.actionType.split(' | ').map((action, i) => (
                        <div key={i} className="leading-tight border-b border-red-50 last:border-0 pb-1 last:pb-0">{action.trim()}</div>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-4 font-bold text-blue-800">
                    {log.staff.split(', ').map((staff, i) => (
                        <div key={i} className="leading-tight border-b border-red-50 last:border-0 pb-1 last:pb-0">{staff.trim()}</div>
                      ))}
                    </td>
                  <td className="px-4 py-4 font-mono text-slate-700 bg-slate-50/50">{log.start}</td>
                  <td className="px-4 py-4 text-center bg-red-50/20 font-black text-red-600 text-base leading-none">
                    {log.current.toFixed(1)} <br/><span className="text-[8px] text-slate-400 font-bold uppercase">Target: {log.target}h</span>
                  </td>
                  <td className="px-4 py-4 text-center"><span className={`px-2 py-1 rounded text-[9px] font-black uppercase shadow-sm ${log.status === 'OVERDUE' ? 'bg-red-600 text-white' : 'bg-green-100 text-green-700 border border-green-200'}`}>{log.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

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

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 pb-10">
        {/* <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Compliance Status</h3>
            <div className="flex gap-4">
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 bg-green-500 rounded-full"></div><span className="text-[9px] font-bold text-slate-500 uppercase">Comply</span></div>
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 bg-red-500 rounded-full"></div><span className="text-[9px] font-bold text-slate-500 uppercase">Overdue</span></div>
            </div>
          </div>
          <div className="h-[200px] flex items-end gap-12 px-8 border-b border-slate-100">
             {["SBY", "AMB", "JKT"].map((loc, i) => (
               <div key={i} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                  <div className={`w-full ${loc === "AMB" ? 'bg-red-500 h-[150px]' : 'bg-green-500 h-[80px]'} rounded-t-md transition-all hover:opacity-80`}></div>
                  <span className="text-[10px] font-bold text-slate-400">{loc}</span>
               </div>
             ))}
          </div>
        </div> */}


        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-6 text-xs font-black uppercase tracking-widest">
            <h3 className="text-slate-400">Equip Performance (Filtered)</h3>
            <div className="px-3 py-1 bg-slate-50 rounded text-[9px] text-blue-600 border border-blue-100">Compliance %</div>
          </div>
          <div className="space-y-4">
            {[{ id: 'HVE SBY 14', p: 100 }, { id: 'HVE JKT 05', p: 100 }, { id: 'HVE AMB 01', p: 40 }].map((item, idx) => (
              <div key={idx} className="flex items-center gap-4">
                <span className="text-[9px] font-black text-slate-400 w-20">{item.id}</span>
                <div className="flex-1 bg-slate-50 h-3.5 rounded-full overflow-hidden border border-slate-100"><div className="bg-blue-600 h-full" style={{ width: `${item.p}%` }}></div></div>
                <span className="text-[10px] font-black text-slate-700 w-8">{item.p}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonitoringSRT;