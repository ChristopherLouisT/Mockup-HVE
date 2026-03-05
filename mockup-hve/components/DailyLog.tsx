"use client";
import { useState, useMemo } from 'react';
import { 
  Plus, Save, X, Settings, 
  FileText, Clock, Wrench, Users,
  Search, RotateCcw, UserPlus, Package, 
  Minus, ChevronLeft, AlertCircle } from 'lucide-react';

const DailyLogActivity = () => {
  const [activities, setActivities] = useState<any[]>([]);
  const [mechanics, setMechanics] = useState<string[]>([]);
  const [helpers, setHelpers] = useState<string[]>([]);

  // Equipment & Code State ---
  const [equipName, setEquipName] = useState("");
  const [noSPK, setNoSPK] = useState("");
  const [noBPB, setNoBPB] = useState("");
  const [noLOKB, setNoLOKB] = useState("");
  const [noLOKK, setNoLOKK] = useState("");

  // Additional Timing State ---
  const [waitLabor, setWaitLabor] = useState("");
  const [waitPart, setWaitPart] = useState("");
  const [timeRepair, setTimeRepair] = useState("");

  // Form state
  const [mechInput, setMechInput] = useState("");
  const [helperInput, setHelperInput] = useState("");
  const [mainComp, setMainComp] = useState("");
  const [failType, setFailType] = useState("");
  const [actType, setActType] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);

  // Auto-fill Mapping ---
  const equipRegistry: any = {
    "Reach Stacker": { spk: "SPK-RS-2026-001", bpb: "BPB-RS-101", lokb: "LOKB-A1", lokk: "LOKK-X9" },
    "Trailer": { spk: "SPK-TR-2026-042", bpb: "BPB-TR-205", lokb: "LOKB-B2", lokk: "LOKK-Y8" },
    "Forklift": { spk: "SPK-FL-2026-015", bpb: "BPB-FL-309", lokb: "LOKB-C3", lokk: "LOKK-Z7" },
    "Kereta Tempel": { spk: "SPK-KT-2026-088", bpb: "BPB-KT-404", lokb: "LOKB-D4", lokk: "LOKK-W6" },
    "Side Loader": { spk: "SPK-SL-2026-112", bpb: "BPB-SL-505", lokb: "LOKB-E5", lokk: "LOKK-V5" },
    "Top Loader": { spk: "SPK-TL-2026-003", bpb: "BPB-TL-606", lokb: "LOKB-F6", lokk: "LOKK-U4" },
    "Tronton": { spk: "SPK-TN-2026-221", bpb: "BPB-TN-707", lokb: "LOKB-G7", lokk: "LOKK-T3" }
  };

  const handleEquipChange = (name: string) => {
    setEquipName(name);
    if (equipRegistry[name]) {
      setNoSPK(equipRegistry[name].spk);
      setNoBPB(equipRegistry[name].bpb);
      setNoLOKB(equipRegistry[name].lokb);
      setNoLOKK(equipRegistry[name].lokk);
    } else {
      setNoSPK(""); setNoBPB(""); setNoLOKB(""); setNoLOKK("");
    }
  };

  // --- MASTER DATA FROM EXCEL ---
  const masterStandardData = [
    { component: "[0-0] SCHEDULED MAINT. (PM)", failures: ["Unit Kotor", "General Check", "Greasing Berkala", "Preventive Maintenance"], actions: ["Cuci Unit", "General Check", "Greasing Komponen", "Preventive Maintenance"] },
    { component: "[01-0] AC (CAB & BODY)", failures: ["Ac Kurang Dingin"], actions: ["Cleaning Ac"] },
    { component: "[01-1] CAB STRUCTURE & GLASS (CAB & BODY)", failures: ["Wiper Tersendat", "Kaca Kabin Pecah", "Pintu Tidak Bisa Lock"], actions: ["Cek Motor Wiper", "Ganti Kaca Akrilik", "Perbaikan Engsel / Mekanisme Lock"] },
    { component: "[08-1] STRUCTURE & EXT. (TRAILER)", failures: ["Rumah Lock Rusak", "Tangga Patah", "Spakbor Patah"], actions: ["Las / Ganti Rumah Lock", "Repair Tangga", "Las Spakbor"] },
    { component: "[09-0] HOIST WINCH (CRANE)", failures: ["Pin Rem Cargo Lepas", "Kawat Boom & Cargo Aus", "Ganti Sling Cargo"], actions: ["Perbaiki Pin Rem Drum Cargo", "Greasing Kawat", "Ganti Sling Cargo"] }
  ];

  // Dynamic Filtering Logic
  const availableFailures = useMemo(() => {
    if (!mainComp) return Array.from(new Set(masterStandardData.flatMap(d => d.failures)));
    return masterStandardData.find(d => d.component === mainComp)?.failures || [];
  }, [mainComp]);

  const availableActions = useMemo(() => {
    if (!mainComp) return Array.from(new Set(masterStandardData.flatMap(d => d.actions)));
    return masterStandardData.find(d => d.component === mainComp)?.actions || [];
  }, [mainComp]);

  // Spare Part Logic
  const sparePartsList = [
    { name: "228C0-80012 CYLINDER ASSY LIFT", stock: 12 },
    { name: "91B40-20021 HYDRAULIC PUMP", stock: 5 },
    { name: "01111-54210 ENGINE MOUNTING", stock: 500 },
    { name: "5421-22220 GASKET SET", stock: 125 }
  ];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showQtySelection, setShowQtySelection] = useState(false);
  const [targetActivityIndex, setTargetActivityIndex] = useState<number | null>(null);
  const [tempSelectedPart, setTempSelectedPart] = useState("");
  const [qtyValue, setQtyValue] = useState(1);
  const [currentMaxStock, setCurrentMaxStock] = useState(0);

  const addPerson = (type: 'mechanic' | 'helper') => {
    const val = type === 'mechanic' ? mechInput : helperInput;
    if (!val) return;
    if (type === 'mechanic') {
      if (!mechanics.includes(val)) setMechanics([...mechanics, val]);
      setMechInput("");
    } else {
      if (!helpers.includes(val)) setHelpers([...helpers, val]);
      setHelperInput("");
    }
  };

  const removePerson = (type: 'mechanic' | 'helper', index: number) => {
    if (type === 'mechanic') setMechanics(mechanics.filter((_, i) => i !== index));
    else setHelpers(helpers.filter((_, i) => i !== index));
  };

  const handleAddActivity = () => {
    if (!mainComp || !failType) return;
    const systemMatch = mainComp.match(/\(([^)]+)\)/);
    const systemStr = systemMatch ? systemMatch[1] : "";
    const subSystemStr = mainComp.replace(/\s*\([^)]+\)/, "").trim();
    const newActivity = { system: systemStr, subSystem: subSystemStr, failure: failType, action: actType, spareParts: [] };
    if (editingId !== null) {
      const updated = [...activities];
      updated[editingId] = { ...updated[editingId], ...newActivity };
      setActivities(updated);
      setEditingId(null);
    } else {
      setActivities([...activities, newActivity]);
    }
    setMainComp(""); setFailType(""); setActType("");
  };

  const handleEdit = (index: number) => {
    const act = activities[index];
    setEditingId(index);
    setMainComp(`${act.subSystem} (${act.system})`);
    setFailType(act.failure);
    setActType(act.action);
  };

  const initiateQtySelection = (part: any) => {
    setTempSelectedPart(part.name);
    setCurrentMaxStock(part.stock);
    setQtyValue(1);
    setShowQtySelection(true);
  };

  const finalizePartAddition = () => {
    if (targetActivityIndex !== null) {
      const updated = [...activities];
      updated[targetActivityIndex].spareParts.push({ name: tempSelectedPart, qty: qtyValue });
      setActivities(updated);
      setIsModalOpen(false);
      setShowQtySelection(false);
      setTargetActivityIndex(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <datalist id="unified-master">{masterStandardData.map((d, i) => <option key={i} value={d.component} />)}</datalist>
      <datalist id="failure-types">{availableFailures.map((f, i) => <option key={i} value={f} />)}</datalist>
      <datalist id="action-types">{availableActions.map((a, i) => <option key={i} value={a} />)}</datalist>

      <main className="max-w-7xl mx-auto p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2"><FileText className="text-blue-600" size={24} />Daily Log Activity</h2>
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Create Mode</span>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-8">
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2"><Settings size={16} /> Equipment Details</h3>
              <div className="grid grid-cols-3 gap-4 items-center"><label className="text-sm font-semibold text-slate-600">Lokasi</label><select className="col-span-2 bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"><option>SPIL Kalianak</option><option>Depo 4</option><option>Depo Tambak Langon</option><option>Depo Japfa</option><option>Depo Yon</option><option>Depo Tanjung Batu</option></select></div>
              <div className="grid grid-cols-3 gap-4 items-center"><label className="text-sm font-semibold text-slate-600">Equip Name</label><select value={equipName} onChange={(e) => handleEquipChange(e.target.value)} className="col-span-2 bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"><option value="">Pilih Alat...</option><option>Reach Stacker</option><option>Trailer</option><option>Forklift</option><option>Kereta Tempel</option><option>Side Loader</option><option>Top Loader</option><option>Tronton</option></select></div>
              {/* AUTO FILL INPUTS */}
              <div className="grid grid-cols-3 gap-4 items-center"><label className="text-xs font-bold text-slate-400 uppercase tracking-tight">No. SPK</label><input disabled value={noSPK} className="col-span-2 bg-slate-100 border border-slate-200 rounded-lg p-2 text-sm font-mono text-blue-700" /></div>
              <div className="grid grid-cols-3 gap-4 items-center"><label className="text-xs font-bold text-slate-400 uppercase tracking-tight">No. BPB</label><input disabled value={noBPB} className="col-span-2 bg-slate-100 border border-slate-200 rounded-lg p-2 text-sm font-mono text-blue-700" /></div>
              <div className="grid grid-cols-3 gap-4 items-center"><label className="text-xs font-bold text-slate-400 uppercase tracking-tight">No. LOKB</label><input disabled value={noLOKB} className="col-span-2 bg-slate-100 border border-slate-200 rounded-lg p-2 text-sm font-mono text-blue-700" /></div>
              <div className="grid grid-cols-3 gap-4 items-center"><label className="text-xs font-bold text-slate-400 uppercase tracking-tight">No. LOKK</label><input disabled value={noLOKK} className="col-span-2 bg-slate-100 border border-slate-200 rounded-lg p-2 text-sm font-mono text-blue-700" /></div>
              <div className="grid grid-cols-3 gap-4 items-center"><label className="text-sm font-semibold text-slate-600">Activity Type</label><select className="col-span-2 bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"><option>01. Maintenance</option><option>02. Breakdown</option><option>05. PM 250</option></select></div>
            </div>
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2"><Clock size={16} /> Operational Data</h3>
              <div className="grid grid-cols-3 gap-4 items-center"><label className="text-sm font-semibold text-slate-600">Equip Code</label><input disabled defaultValue="HVE AMB" className="col-span-2 bg-slate-100 border border-slate-200 rounded-lg p-2 text-sm text-slate-500 font-mono" /></div>
              <div className="grid grid-cols-3 gap-4 items-center"><label className="text-sm font-semibold text-slate-600">HMU</label><input type="number" placeholder="0.0" className="col-span-2 bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" /></div>
              <div className="grid grid-cols-3 gap-4 items-center"><label className="text-sm font-semibold text-slate-600">Start Time</label><input type="datetime-local" className="col-span-2 bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none font-bold" /></div>
              {/* TIME INPUTS */}
              <div className="grid grid-cols-3 gap-4 items-center"><label className="text-sm font-semibold text-slate-600 italic">Waiting Labor</label><input type="number" placeholder="Hrs" value={waitLabor} onChange={(e) => setWaitLabor(e.target.value)} className="col-span-2 bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" /></div>
              <div className="grid grid-cols-3 gap-4 items-center"><label className="text-sm font-semibold text-slate-600 italic">Waiting Part</label><input type="number" placeholder="Hrs" value={waitPart} onChange={(e) => setWaitPart(e.target.value)} className="col-span-2 bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" /></div>
              <div className="grid grid-cols-3 gap-4 items-center"><label className="text-sm font-semibold text-slate-600 italic">Time Repair</label><input type="number" placeholder="Hrs" value={timeRepair} onChange={(e) => setTimeRepair(e.target.value)} className="col-span-2 bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" /></div>
            </div>
          </div>
          <hr className="border-slate-100" />
          <div className="p-6 bg-slate-50/50">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2"><Users size={16} /> Manpower Allocation</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-tight">Mekanik</label>
                <div className="flex flex-wrap gap-2 p-2 bg-white border border-slate-200 rounded-lg min-h-[42px] focus-within:ring-2 focus-within:ring-blue-500">
                  {mechanics.map((name, index) => (<span key={index} className="flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-xs font-bold border border-blue-100">{name}<button onClick={() => removePerson('mechanic', index)} className="hover:text-red-500"><X size={14} /></button></span>))}
                  <div className="flex-1 flex gap-2"><select onChange={(e) => setMechInput(e.target.value)} value={mechInput} className="flex-1 bg-transparent text-sm outline-none cursor-pointer"><option value="">+ Pilih Mekanik</option><option value="Budiono">Budiono</option><option value="Slamet">Slamet</option><option value="Anto">Anto</option><option value="Hadi">Hadi</option></select><button onClick={() => addPerson('mechanic')} className="p-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"><UserPlus size={16}/></button></div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-tight">Helper</label>
                <div className="flex flex-wrap gap-2 p-2 bg-white border border-slate-200 rounded-lg min-h-[42px] focus-within:ring-2 focus-within:ring-blue-500">
                  {helpers.map((name, index) => (<span key={index} className="flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded-md text-xs font-bold border border-green-100">{name}<button onClick={() => removePerson('helper', index)} className="hover:text-red-500"><X size={14} /></button></span>))}
                  <div className="flex-1 flex gap-2"><select onChange={(e) => setHelperInput(e.target.value)} value={helperInput} className="flex-1 bg-transparent text-sm outline-none cursor-pointer"><option value="">+ Pilih Helper</option><option value="Joko">Joko</option><option value="Randi">Randi</option><option value="Eko">Eko</option><option value="Dedi">Dedi</option></select><button onClick={() => addPerson('helper')} className="p-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"><UserPlus size={16}/></button></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-6">
          <div className="bg-slate-800 p-3 px-6"><h3 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2"><Wrench size={14} /> Input Activity Details</h3></div>
          <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-3"><input list="unified-master" value={mainComp} onChange={(e) => setMainComp(e.target.value)} placeholder="Main Component..." className="border border-slate-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" /><input list="failure-types" value={failType} onChange={(e) => setFailType(e.target.value)} placeholder="Failure Type..." className="border border-slate-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" /><input list="action-types" value={actType} onChange={(e) => setActType(e.target.value)} placeholder="Action Type..." className="border border-slate-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" /></div>
          <div className="px-4 pb-4 flex justify-end gap-2">{editingId !== null && (<button onClick={() => { setEditingId(null); setMainComp(""); setFailType(""); setActType(""); }} className="bg-slate-500 hover:bg-slate-600 text-white px-6 py-2 rounded-lg text-sm font-bold flex items-center gap-2"><RotateCcw size={18} /> CANCEL</button>)}<button onClick={handleAddActivity} className={`${editingId !== null ? 'bg-orange-500 hover:bg-orange-600' : 'bg-green-600 hover:bg-green-700'} text-white px-6 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors`}>{editingId !== null ? <Save size={18} /> : <Plus size={18} />}{editingId !== null ? 'UPDATE ACTIVITY' : 'ADD ACTIVITY'}</button></div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse"><thead className="bg-[#005a32] text-white font-bold border-y border-slate-200 tracking-tighter"><tr><th className="px-6 py-3 uppercase">System</th><th className="px-6 py-3 uppercase">Sub-system</th><th className="px-6 py-3 uppercase text-red-100">Failure Type</th><th className="px-6 py-3 uppercase text-green-100">Action Type</th><th className="px-6 py-3 uppercase">Spare Parts</th><th className="px-6 py-3 text-center uppercase">Qty</th><th className="px-6 py-3 text-right uppercase">Action</th></tr></thead><tbody className="font-bold uppercase">{activities.length === 0 ? (<tr><td colSpan={7} className="px-6 py-12 text-center text-slate-400 italic">Belum ada data aktivitas</td></tr>) : (activities.map((act, index) => (<tr key={index} className="border-b border-slate-100 hover:bg-slate-50 transition-colors"><td className="px-6 py-4 text-blue-800">{act.system}</td><td className="px-6 py-4">{act.subSystem}</td><td className="px-6 py-4 text-red-700">{act.failure}</td><td className="px-6 py-4 text-green-700">{act.action}</td><td className="px-6 py-4"><div className="flex flex-col gap-1">{act.spareParts.map((p: any, i: number) => (<span key={i} className="text-[10px] bg-slate-50 px-2 py-0.5 rounded border border-slate-100">{p.name}</span>))}</div></td><td className="px-6 py-4 text-center"><div className="flex flex-col gap-1">{act.spareParts.map((p: any, i: number) => (<span key={i} className="text-[10px] font-black text-blue-600 px-2 py-0.5">x{p.qty}</span>))}</div></td><td className="px-6 py-4 text-right"><div className="flex flex-col gap-1 items-end"><button onClick={() => handleEdit(index)} className="bg-orange-500 text-white px-3 py-1 rounded text-[10px] w-20">EDIT</button><button onClick={() => { setTargetActivityIndex(index); setIsModalOpen(true); }} className="bg-blue-600 text-white px-3 py-1 rounded text-[10px] w-20">+ PART</button><button onClick={() => setActivities(activities.filter((_, i) => i !== index))} className="bg-red-600 text-white px-3 py-1 rounded text-[10px] w-20">DEL</button></div></td></tr>)))}</tbody></table>
          </div>
        </div>

        <div className="flex gap-3 justify-end items-center">
          <button className="px-6 py-2.5 rounded-lg text-white text-sm font-bold bg-red-500 hover:bg-red-600 transition-colors flex items-center gap-2"><X size={18} /> CANCEL</button>
          <button className="px-6 py-2.5 rounded-lg text-sm font-bold bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 transition-colors">SAVE & CLOSE</button>
          <button className="px-8 py-2.5 rounded-lg text-sm font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all flex items-center gap-2"><Save size={18} /> SAVE ALL</button>
        </div>
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            {!showQtySelection ? (
              <><div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white"><h2 className="text-blue-700 font-bold uppercase tracking-tight flex items-center gap-2"><Search size={18} /> Item Search</h2><button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-red-500 transition-colors"><X size={20} /></button></div><div className="bg-[#005a32] text-white p-3 font-bold text-xs uppercase flex justify-between"><span className="w-2/3">Nama Barang</span><span className="w-1/6 text-center">Stock</span><span className="w-1/6 text-right">Action</span></div><div className="max-h-96 overflow-y-auto">{sparePartsList.map((item, idx) => (<div key={idx} className="p-4 flex justify-between items-center border-b border-slate-50 hover:bg-slate-50 transition-colors"><span className="text-sm font-medium text-slate-700 w-2/3">{item.name}</span><span className={`text-xs font-black w-1/6 text-center ${item.stock < 10 ? 'text-red-600' : 'text-slate-500'}`}>{item.stock}</span><div className="w-1/6 text-right"><button onClick={() => initiateQtySelection(item)} className="bg-[#005a32] hover:bg-green-800 text-white px-4 py-1.5 rounded text-[10px] font-bold uppercase tracking-tighter shadow-sm active:scale-95 transition-all">SELECT</button></div></div>))}</div></>
            ) : (
              <div className="p-8 text-center space-y-6">
                <div className="mx-auto w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center shadow-inner"><Package size={32} /></div>
                <div className="space-y-1"><h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">Set Quantity</h3><p className="text-xs text-slate-500 font-bold uppercase tracking-widest">{tempSelectedPart}</p></div>
                <div className="space-y-2"><div className="flex items-center justify-center gap-6"><button onClick={() => setQtyValue(Math.max(1, qtyValue - 1))} className="p-3 bg-slate-100 rounded-xl hover:bg-slate-200 active:scale-90 transition-all text-slate-600 shadow-sm"><Minus size={24} strokeWidth={3}/></button><div className="flex flex-col items-center"><input type="number" value={qtyValue} onChange={(e) => { const val = parseInt(e.target.value) || 1; setQtyValue(val > currentMaxStock ? currentMaxStock : val); }} className="w-24 text-center text-3xl font-black text-blue-600 outline-none bg-transparent" /><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Limit: {qtyValue} / <span className="text-blue-500">{currentMaxStock}</span></span></div><button onClick={() => setQtyValue(qtyValue < currentMaxStock ? qtyValue + 1 : qtyValue)} className={`p-3 rounded-xl transition-all shadow-sm ${qtyValue >= currentMaxStock ? 'bg-slate-50 text-slate-300' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 active:scale-90'}`}><Plus size={24} strokeWidth={3}/></button></div>{qtyValue >= currentMaxStock && (<p className="text-[9px] text-red-500 font-bold uppercase flex items-center justify-center gap-1"><AlertCircle size={10} /> Maximum stock reached</p>)}</div>
                <div className="flex gap-3 pt-4"><button onClick={() => setShowQtySelection(false)} className="flex-1 px-6 py-3 rounded-xl text-xs font-black bg-slate-100 text-slate-500 uppercase hover:bg-slate-200 flex items-center justify-center gap-2"><ChevronLeft size={16}/> Back</button><button onClick={finalizePartAddition} className="flex-1 px-6 py-3 rounded-xl text-xs font-black bg-blue-600 text-white uppercase hover:bg-blue-700 shadow-lg shadow-blue-200 flex items-center justify-center gap-2"><Save size={16}/> Add Part</button></div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DailyLogActivity;