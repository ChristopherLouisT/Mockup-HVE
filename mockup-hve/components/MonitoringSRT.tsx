"use client";
import { useState, useMemo } from 'react';
import { 
  BarChart3, Search, Download, X, 
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

  const laporanBreakdownList = [
    { id: "LOG-2026-001", date: "2026-10-03", downtime: "2026-10-02 16:42", reporter: "Bowo", details: "Alat tidak bisa nyala"},
  ];
  const laporanMekanikList = [
    { id: "LOG-2026-002", date: "2026-10-02", reporter: "Joko", details: "Perbaikan rutin", notes: "[2026/10/04 - Toni] Diperbaiki pada next PM" },
    { id: "LOG-2026-005", date: "2026-10-05", reporter: "Vin", details: "Oli netes dari engine", notes: "[2026/10/07 - Toni] Perlu rutin tambah oli, perbaikan pada next PM" }
  ];
  const pmMasterList = [
    { id: "PM-500", currentHM: 490, hmTarget: "487 - 587", avgHM: 14, datePrediction: "17 March 2026 - 24 March 2026"}
  ];

  const [isDocOpen, setIsDocOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<any>(null);
  const openDocumentation = (data: any) => {
    setSelectedDoc(data);
    setIsDocOpen(true);
  };

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
      <div className="space-y-6 animate-in fade-in duration-500">
      {/* Warning Banner */}
      {/* <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg flex items-start gap-3 shadow-sm">
        <AlertTriangle className="text-red-600 shrink-0" size={20} />
        <div>
          <h4 className="text-red-800 font-bold text-sm uppercase tracking-tight">Warning! High Priority Overdue:</h4>
          <p className="text-red-700 text-xs mt-0.5">• [SPK-001] HVE AMB 01 / JATAYU (-) exceeds SRT Target by 2.0h.</p>
        </div>
      </div> */}

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
          <table className="w-full text-[10px] border-collapse table-fixed">
            <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase tracking-tighter text-left">
              <tr className="divide-x divide-slate-100">
                <th onClick={() => requestSort('id')} className="px-2 py-2 cursor-pointer hover:bg-slate-100">NO. SPK</th>
                <th className="px-2 py-2">EQUIP TYPE</th>
                <th onClick={() => requestSort('name')} className="px-2 py-2 cursor-pointer hover:bg-slate-100">EQUIP NAME</th>
                <th className="px-2 py-2 text-center">LOCATION</th>
                {/* <th className="px-2 py-2">DETAILS</th> */}
                <th className="px-4 py-4">SYSTEM</th>
                <th className="px-4 py-4 text-red-600">FAILURE TYPE</th>
                <th className="px-4 py-4 text-slate-600">ACTION TYPE</th>
                <th className="px-2 py-2 text-blue-800">MECHANIC & HELPER</th>
                <th className="px-2 py-2">START TIME (DT)</th>
                <th onClick={() => requestSort('current')} className="px-2 py-2 text-center bg-red-50/30 cursor-pointer">CURRENT DT (H)</th>
                <th className="px-2 py-2 text-center">STATUS SRT</th>
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
                      {log.system.split('| ').map((system: string, i: number) => (
                        <div key={i} className="leading-tight border-b border-slate-100 last:border-0 pb-1 last:pb-0">{system.trim()}</div>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-4 font-black text-red-600 text-[10px]">
                    <div className="flex flex-col gap-1">
                      {log.failureType.split('| ').map((fail:string, i:number) => (
                        <div key={i} className="leading-tight border-b border-red-50 last:border-0 pb-1 last:pb-0">{fail.trim()}</div>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-4 font-medium text-slate-500 text-[10px]">
                    <div className="flex flex-col gap-1">
                      {log.actionType.split('| ').map((action:string, i:number) => (
                        <div key={i} className="leading-tight border-b border-red-50 last:border-0 pb-1 last:pb-0">{action.trim()}</div>
                      ))}
                    </div>
                  </td>
                  {/* For Detail if only want 1 col */}
                  {/* <td className="px-4 py-4 text-[10px] leading-tight">
                    <div className="space-y-1">
                      <div>
                        <span className="font-bold text-slate-700">SYS:</span> {log.system}</div>
                      <div><span className="font-bold text-red-600">FAIL:</span> {log.failureType}</div>
                      <div><span className="font-bold text-slate-500">ACT:</span> {log.actionType}</div>
                    </div>
                  </td> */}
                  <td className="px-4 py-4 font-bold text-blue-800">
                    {log.staff.split(', ').map((staff:string, i:number) => (
                        <div key={i} className="leading-tight border-b border-red-50 last:border-0 pb-1 last:pb-0">{staff.trim()}</div>
                      ))}
                  </td>
                  {/* If want no new line */}
                  {/* <td className="px-3 py-3 text-[10px] font-bold text-blue-800">
                    {log.staff.split(', ').slice(0,2).join(', ')}
                    {log.staff.split(', ').length > 2 && ' +'}
                  </td> */}
                  <td className="px-4 py-4 font-mono text-slate-700 bg-slate-50/50">{log.start}</td>
                  <td className="px-4 py-4 text-center bg-red-50/20 font-black text-red-600 text-base leading-none">
                    {log.current.toFixed(1)} <br/><span className="text-[8px] text-slate-400 font-bold uppercase">Target: {log.target}h</span>
                  </td>
                  <td className="px-4 py-4 text-center"><span className={`px-2 py-1 rounded text-[9px] font-black uppercase shadow-sm animate-flicker ${log.status === 'OVERDUE' ? 'bg-red-600 text-white' : 'bg-green-100 text-green-700 border border-green-200'}`}>{log.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className='flex flex-col gap-5 mb-10'>
        {/* Laporan Breakdown Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 px-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <h3 className="text-xs font-black text-slate-600 uppercase tracking-widest flex items-center gap-2">
              <BarChart3 size={16} /> Laporan Breakdown
            </h3>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <input type="text" placeholder="Search Report..." className="pl-8 pr-4 py-1.5 text-[10px] border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 w-64" />
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
                  <th className="px-4 py-3">No. Laporan</th>
                  <th className="px-4 py-3">Tanggal Laporan</th>
                  <th className="px-4 py-3">Pelapor</th>
                  <th className="px-4 py-3">Downtime</th>
                  <th className="px-4 py-3">Detail Laporan</th>
                  <th className="px-4 py-3 text-center">Doc</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 font-bold">
                {laporanBreakdownList.map((lb) => (
                  <tr
                    key={lb.id}
                    className={`cursor-pointer hover:bg-blue-50 transition-colors`}>
                    <td className="px-4 py-3 font-bold text-blue-700">{lb.id}</td>
                    <td className="px-4 py-3">{lb.date}</td>
                    <td className="px-4 py-3 text-red-600 font-bold">{lb.reporter}</td>
                    <td className="px-4 py-3">{lb.downtime}</td>
                    <td className="px-4 py-3">{lb.details}</td>
                    <td className="px-4 py-3 text-center">
                      <button onClick={(e) => { e.stopPropagation(); openDocumentation(lb);}}
                        className="bg-blue-500 text-white px-2 py-1 rounded text-[10px] hover:bg-blue-700 transition-colors">
                        Lihat
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Laporan Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 px-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <h3 className="text-xs font-black text-slate-600 uppercase tracking-widest flex items-center gap-2">
              <BarChart3 size={16} /> Laporan Mekanik
            </h3>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <input type="text" placeholder="Search Report..." className="pl-8 pr-4 py-1.5 text-[10px] border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 w-64" />
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
                  <th className="px-4 py-3">No. Laporan</th>
                  <th className="px-4 py-3">Tanggal Laporan</th>
                  <th className="px-4 py-3">Pelapor</th>
                  <th className="px-4 py-3">Detail Laporan</th>
                  <th className="px-4 py-3">Keterangan Pre-Check</th>
                  <th className="px-4 py-3 text-center">Doc</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 font-bold">
                {laporanMekanikList.map((lap) => (
                  <tr key={lap.id} className={`cursor-pointer hover:bg-blue-50 transition-colors`}>
                    <td className="px-4 py-3 font-bold text-blue-700">{lap.id}</td>
                    <td className="px-4 py-3 font-medium">{lap.date}</td>
                    <td className="px-4 py-3 text-red-600 font-bold">{lap.reporter}</td>
                    <td className="px-4 py-3">{lap.details}</td>
                    <td className="px-4 py-3">{lap.notes}</td>
                    <td className="px-4 py-3 text-center">
                      <button onClick={(e) => { e.stopPropagation(); openDocumentation(lap);}}
                        className="bg-blue-500 text-white px-2 py-1 rounded text-[10px] hover:bg-blue-700 transition-colors">
                        Lihat
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Preventive Maintenance Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 px-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <h3 className="text-xs font-black text-slate-600 uppercase tracking-widest flex items-center gap-2">
              <BarChart3 size={16} /> Preventive Maintenance
            </h3>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <input type="text" placeholder="Search PM..." className="pl-8 pr-4 py-1.5 text-[10px] border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 w-64" />
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
                  <th className="px-4 py-3">PM Type</th>
                  <th className="px-4 py-3">Current HM</th>
                  <th className="px-4 py-3">HM Target</th>
                  <th className="px-4 py-3">AVG HM / Day</th>
                  <th className="px-4 py-3">Next Date Prediction</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 font-bold">
                {pmMasterList.map((pm) => (
                  <tr
                    key={pm.id}
                    className={`cursor-pointer hover:bg-blue-50 transition-colors`}>
                    <td className="px-4 py-3 font-bold text-blue-700">{pm.id}</td>
                    <td className="px-4 py-3">{pm.currentHM}</td>
                    <td className="px-4 py-3">{pm.hmTarget}</td>
                    <td className="px-4 py-3">{pm.avgHM}</td>
                    <td className="px-4 py-3">{pm.datePrediction}</td>  
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-1">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
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
        </div>


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

    {/* Documentation Modal */}
    {isDocOpen && selectedDoc && (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[70]">
        <div className="bg-white w-[600px] rounded-lg shadow-xl overflow-hidden">
          
          <div className="bg-slate-900 text-white p-4 flex justify-between items-center">
            <h2 className="font-bold text-sm">Documentation</h2>
            <button className='bg-slate-600 hover:bg-slate-700 rounded-lg p-1' onClick={() => setIsDocOpen(false)}>
              <X size={18} />
            </button>
          </div>

          <div className="p-5 text-sm space-y-3">

            <div>
              <span className="font-bold">No Laporan:</span> {selectedDoc.id}
            </div>

            <div>
              <span className="font-bold">Tanggal:</span> {selectedDoc.date}
            </div>

            <div>
              <span className="font-bold">Pelapor:</span> {selectedDoc.reporter}
            </div>

            <div>
              <span className="font-bold">Detail:</span> {selectedDoc.details}
            </div>

            {/* khusus breakdown */}
            {selectedDoc.downtime && (
              <div>
                <span className="font-bold">Downtime:</span> {selectedDoc.downtime}
              </div>
            )}

            {/* khusus mekanik */}
            {selectedDoc.notes && (
              <div>
                <span className="font-bold">Notes:</span> {selectedDoc.notes}
              </div>
            )}

          </div>

          <div className="p-4 bg-slate-50 flex justify-end">
            <button onClick={() => setIsDocOpen(false)} className="px-4 py-2 bg-blue-500 text-white rounded text-xs hover:bg-blue-700 transition-colors">
              Close
            </button>
          </div>

        </div>
      </div>
    )}
    </div>
  );
};

export default MonitoringSRT;