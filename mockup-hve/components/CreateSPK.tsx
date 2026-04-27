"use client";
import { useState} from 'react';
import { Save, X, Settings, FileText, CheckSquare, Square,
  BarChart3,Search, Download} from 'lucide-react';
import { useRouter } from "next/navigation";

const CreateSPK = () => {
  const router = useRouter();

  // Equipment & Code State
  const [equipName, setEquipName] = useState("");
  const [noSPK, setNoSPK] = useState("");

  // --- Laporan Selection State ---
  const [isLaporanModalOpen, setIsLaporanModalOpen] = useState(false);
  const [selectedLaporan, setSelectedLaporan] = useState<string[]>([]);
  const [isDocOpen, setIsDocOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<any>(null);

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

  const openDocumentation = (data: any) => {
    setSelectedDoc(data);
    setIsDocOpen(true);
  };

  // PM Selection
  const [selectedPM, setSelectedPM] = useState<string[]>([]);
  const togglePMSelection = (id: string) => {
    let updated: string[];

    if (selectedPM.includes(id)) {
      updated = selectedPM.filter(item => item !== id);
    } else {
      updated = [...selectedPM, id];
    }

    setSelectedPM(updated);
  };

  const toggleLaporanSelection = (id: string) => {

    let updated: string[];

    if (selectedLaporan.includes(id)) {
      updated = selectedLaporan.filter(item => item !== id);
    } else {
      updated = [...selectedLaporan, id];
    }

    setSelectedLaporan(updated);

    if (updated.length > 0) {
      const random = Math.floor(Math.random() * 999);
      setNoSPK(`SPK-${new Date().getFullYear()}-${random.toString().padStart(3,'0')}`);
    } else {
      setNoSPK("");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <main className="max-w-7xl mx-auto p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2"><FileText className="text-blue-600" size={24}/>Create SPK</h2>
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Create Mode</span>
        </div>

        {/* <div className='flex flex-col gap-5 mb-10'> */}
          {/* Laporan Breakdown Table */}
          {/* <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
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
                      onClick={() => toggleLaporanSelection(lb.id)}
                      className={`cursor-pointer hover:bg-blue-50 transition-colors ${
                        selectedLaporan.includes(lb.id) ? 'bg-blue-50/50' : ''
                      }`}>
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
          </div> */}

          {/* Laporan Table */}
          {/* <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
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
                    <tr key={lap.id} onClick={() => toggleLaporanSelection(lap.id)} className={`cursor-pointer hover:bg-blue-50 transition-colors ${selectedLaporan.includes(lap.id) ? 'bg-blue-50/50' : ''}`}>
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
          </div> */}

          {/* Preventive Maintenance Table */}
          {/* <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
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
                      onClick={() => togglePMSelection(pm.id)}
                      className={`cursor-pointer hover:bg-blue-50 transition-colors ${
                        selectedPM.includes(pm.id) ? 'bg-blue-50/50' : ''
                      }`}>
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
        </div> */}

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-8">
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">

            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2"><Settings size={16} /> Equipment Details</h3>
              
              <div className="grid grid-cols-3 gap-4 items-center">
                <label className="text-sm font-semibold text-slate-600">Location</label>
                <select className="col-span-2 bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none">
                  <option>SPIL Kalianak</option>
                  <option>Depo 4</option>
                  <option>Depo Tambak Langon</option>
                </select>
              </div>

              <div className="grid grid-cols-3 gap-4 items-center">
                <label className="text-sm font-semibold text-slate-600">Equip Name</label>
                <select value={equipName} onChange={(e) => setEquipName(e.target.value)} 
                className="col-span-2 bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none">
                  <option value="">Pilih Alat...</option>
                  <option>Reach Stacker</option>
                  <option>Trailer</option>
                  <option>Forklift</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-9 flex items-center gap-4"></h3>
              <div className="grid grid-cols-3 gap-4 items-center">
                <label className="text-sm font-semibold text-slate-600">Work Plan</label>
                <input type="date" className="col-span-2 bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none font-bold" />
              </div>

              <div className="grid grid-cols-3 gap-4 items-center">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-tight">No. Laporan</label>
                <div onClick={() => setIsLaporanModalOpen(true)} 
                className="col-span-2 bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm font-mono text-blue-600 cursor-pointer 
                hover:border-blue-400 transition-colors min-h-[38px] flex items-center flex-wrap gap-1">
                  {(selectedLaporan.length > 0 || selectedPM.length > 0) ? (
                    <>
                      {selectedLaporan.map(id => (
                        <span key={id} className="bg-blue-100 px-1.5 py-0.5 rounded text-[10px] font-bold border border-blue-200">
                          {id}
                        </span>
                      ))}
                      {selectedPM.map(pm => (
                        <span key={pm} className="bg-green-100 text-green-700 px-1.5 py-0.5 rounded text-[10px] font-bold border border-green-200">
                          {pm}
                        </span>
                      ))}
                    </>
                    ) 
                    : 
                    (
                    <span className="text-slate-400 italic">Pilih Laporan / PM...</span>
                     )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center mt-6 mb-5 gap-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-tight mb-1">
              No. SPK
            </label>
            <input readOnly value={noSPK}
              className="w-64 text-center bg-slate-100 border border-slate-200 rounded-lg p-2 text-sm font-mono text-blue-700"/>
            <button className="mt-3 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-wider shadow-sm"
              onClick={() => {
                alert("SPK Saved");
                router.push("/");
              }}>
              <Save size={14}/>Save SPK
            </button>
          </div>

          <hr className="border-slate-100" />
        </div>
      </main>

      {/* --- LAPORAN POPUP MODAL --- */}
      {isLaporanModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-5xl max-h-[100vh] flex flex-col border-2 border-blue-600">
            <div className="p-4 bg-blue-600 text-white flex justify-between items-center">
              <h2 className="font-bold uppercase tracking-tight flex items-center gap-2"><FileText size={18} /> Pilih No. Laporan</h2>
              <button onClick={() => setIsLaporanModalOpen(false)} className="hover:bg-blue-700 rounded-full p-1"><X size={20} /></button>
            </div>

            {/* Laporan Breakdown Table */}
            <div className="border-t border-slate-200">
              <div className="p-3 bg-slate-50 font-bold text-xs uppercase tracking-wider text-slate-500">
                Laporan Breakdown
              </div>

              <div className="overflow-auto max-h-[200px]">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-100 text-slate-600 font-bold border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3">No. Laporan</th>
                      <th className="px-4 py-3">Tanggal Laporan</th>
                      <th className="px-4 py-3">Pelapor</th>
                      <th className="px-4 py-3">Downtime</th>
                      <th className="px-4 py-3">Detail Laporan</th>
                      <th className="px-4 py-3 text-center">Doc</th>
                      <th className="px-4 py-3 text-center w-12">Select</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {laporanBreakdownList.map((lb) => (
                      <tr
                        key={lb.id}
                        onClick={() => toggleLaporanSelection(lb.id)}
                        className={`cursor-pointer hover:bg-blue-50 transition-colors ${
                          selectedLaporan.includes(lb.id) ? 'bg-blue-50/50' : ''
                        }`}>
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
                        <td className="px-4 py-3 text-center">
                          {selectedLaporan.includes(lb.id)
                            ? <CheckSquare size={18} className="text-blue-600 mx-auto" />
                            : <Square size={18} className="text-slate-300 mx-auto" />
                          }
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>

            {/* Laporan Table */}
            <div className="border-t border-slate-200">
              <div className="p-3 bg-slate-50 font-bold text-xs uppercase tracking-wider text-slate-500">
                  Laporan Mekanik
                </div>
              <div className="overflow-auto max-h-[150px]">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-100 text-slate-600 font-bold border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3">No. Laporan</th>
                      <th className="px-4 py-3">Tanggal Laporan</th>
                      <th className="px-4 py-3">Pelapor</th>
                      <th className="px-4 py-3">Detail Laporan</th>
                      <th className="px-4 py-3 text-center">Keterangan Pre-Check</th>
                      <th className="px-4 py-3 text-center">Doc</th>
                      <th className="px-4 py-3 text-center w-12">Select</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {laporanMekanikList.map((lap) => (
                      <tr key={lap.id} onClick={() => toggleLaporanSelection(lap.id)} className={`cursor-pointer hover:bg-blue-50 transition-colors ${selectedLaporan.includes(lap.id) ? 'bg-blue-50/50' : ''}`}>
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
                        <td className="px-4 py-3 text-center">{selectedLaporan.includes(lap.id) ? <CheckSquare size={18} className="text-blue-600 mx-auto" /> : <Square size={18} className="text-slate-300 mx-auto" />}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Preventive Maintenance Table */}
            <div className="border-t border-slate-200">
              <div className="p-3 bg-slate-50 font-bold text-xs uppercase tracking-wider text-slate-500">
                Preventive Maintenance
              </div>

              <div className="overflow-auto max-h-[200px]">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-100 text-slate-600 font-bold border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3">PM Type</th>
                      <th className="px-4 py-3">Current HM</th>
                      <th className="px-4 py-3">HM Target</th>
                      <th className="px-4 py-3">AVG HM / Day</th>
                      <th className="px-4 py-3">Date Prediction</th>
                      <th className="px-4 py-3 text-center w-12">Select</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {pmMasterList.map((pm) => (
                      <tr
                        key={pm.id}
                        onClick={() => togglePMSelection(pm.id)}
                        className={`cursor-pointer hover:bg-blue-50 transition-colors ${
                          selectedPM.includes(pm.id) ? 'bg-blue-50/50' : ''
                        }`}>
                        <td className="px-4 py-3 font-bold text-blue-700">{pm.id}</td>
                        <td className="px-4 py-3">{pm.currentHM}</td>
                        <td className="px-4 py-3">{pm.hmTarget}</td>
                        <td className="px-4 py-3">{pm.avgHM}</td>
                        <td className="px-4 py-3">{pm.datePrediction}</td>
                        <td className="px-4 py-3 text-center">
                          {selectedPM.includes(pm.id)
                            ? <CheckSquare size={18} className="text-blue-600 mx-auto" />
                            : <Square size={18} className="text-slate-300 mx-auto" />
                          }
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
              <button onClick={() => setIsLaporanModalOpen(false)} className="px-6 py-2 bg-blue-600 text-white rounded text-[10px] font-bold uppercase tracking-widest hover:bg-blue-700 shadow-md">Confirm Selection</button>
            </div>
          </div>
        </div>
      )}

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

export default CreateSPK;