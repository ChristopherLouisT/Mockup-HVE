"use client";
import { useState, useMemo } from 'react';
import { 
  Plus, Save, X, Settings, FileText, Clock, Wrench, Users,
  Search, RotateCcw, UserPlus, Package, Minus, ChevronLeft, AlertCircle, CheckSquare, Square 
} from 'lucide-react';

const DailyLogActivity = () => {
  const [activities, setActivities] = useState<any[]>([]);
  const [mechanics, setMechanics] = useState<string[]>([]);
  const [helpers, setHelpers] = useState<string[]>([]);

  // Equipment & Code State
  const [equipName, setEquipName] = useState("");
  const [noSPK, setNoSPK] = useState("");
  const [noLOKB, setNoLOKB] = useState("");
  const [noLOKK, setNoLOKK] = useState("");

  const [isRefurbished, setIsRefurbished] = useState(false);
  const [partMode, setPartMode] = useState<"install" | "remove">("install");

  // Master Data From EXCEL
  const masterStandardData = [
    { component: "[0-0] SCHEDULED MAINT. (PM)", failures: ["Unit Kotor", "General Check", "Greasing Berkala", "Preventive Maintenance"], actions: ["Cuci Unit", "General Check", "Greasing Komponen", "Preventive Maintenance"] },
    { component: "[01-0] AC (CAB & BODY)", failures: ["Ac Kurang Dingin"], actions: ["Cleaning Ac"] },
    { component: "[01-1] CAB STRUCTURE & GLASS (CAB & BODY)", failures: ["Wiper Tersendat", "Kaca Kabin Pecah", "Pintu Tidak Bisa Lock"], actions: ["Cek Motor Wiper", "Ganti Kaca Akrilik", "Perbaikan Engsel / Mekanisme Lock"] },
    { component: "[08-1] STRUCTURE & EXT. (TRAILER)", failures: ["Rumah Lock Rusak", "Tangga Patah", "Spakbor Patah"], actions: ["Las / Ganti Rumah Lock", "Repair Tangga", "Las Spakbor"] },
    { component: "[09-0] HOIST WINCH (CRANE)", failures: ["Pin Rem Cargo Lepas", "Kawat Boom & Cargo Aus", "Ganti Sling Cargo"], actions: ["Perbaiki Pin Rem Drum Cargo", "Greasing Kawat", "Ganti Sling Cargo"] }
  ];

  // --- Laporan Selection State ---
  const [isLaporanModalOpen, setIsLaporanModalOpen] = useState(false);
  const [selectedLaporan, setSelectedLaporan] = useState<string[]>([]);
  const laporanMasterList = [
    { id: "LOG-2026-001", date: "2026-10-01", reporter: "Budi", category: "Breakdown", details: "Alat tidak bisa nyala", notes: "" },
    { id: "LOG-2026-002", date: "2026-10-02", reporter: "Joko", category: "Maintenance", details: "Perbaikan rutin", notes: "[2026/10/04 - Toni] Diperbaiki pada next PM" },
    { id: "LOG-2026-003", date: "2026-10-03", reporter: "Tono", category: "Breakdown", details: "SLING CARGO PUTUS", notes: "" },
    { id: "LOG-2026-004", date: "2026-10-04", reporter: "Anto", category: "Breakdown", details: "Steering berat", notes: "" },
    { id: "LOG-2026-005", date: "2026-10-05", reporter: "Vin", category: "Maintenance", details: "Oli netes dari engine", notes: "[2026/10/07 - Toni] Perlu rutin tambah oli, perbaikan pada next PM" }
  ];

  // PM
  const [selectedPM, setSelectedPM] = useState<string[]>([]);
  const pmMasterList = [
    {
      id: "PM-500",
      currentHM: 490,
      hmTarget: "487 - 587",
      avgHM: 14,
      datePrediction: "17 March 2026 - 24 March 2026"
    }
  ];

  const generateRandomReports = () => {
    const randomLaporan =
      laporanMasterList[Math.floor(Math.random() * laporanMasterList.length)];

    const randomPM =
      pmMasterList[Math.floor(Math.random() * pmMasterList.length)];

    setSelectedLaporan([randomLaporan.id]);
    setSelectedPM([randomPM.id]);
  };

  const combinedReports = [...selectedLaporan, ...selectedPM];

  // Timing State
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
  
  // Search Recommendation Logic
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const [workType, setWorkType] = useState("");

  const flattenedData = useMemo(() => {
    const result: any[] = [];

    masterStandardData.forEach((item) => {
      item.failures.forEach((failure, idx) => {
        result.push({
          component: item.component,
          failure: failure,
          action: item.actions[idx] || item.actions[0] || ""
        });
      });
    });

    return result;
  }, []);

  useMemo(() => {
    if (!searchQuery) {
      setSearchResults([]);
      return;
    }

    const q = searchQuery.toLowerCase();

    const filtered = flattenedData.filter((item) =>
      item.component.toLowerCase().includes(q) ||
      item.failure.toLowerCase().includes(q) ||
      item.action.toLowerCase().includes(q)
    );

    setSearchResults(filtered.slice(0, 8)); // limit results
  }, [searchQuery, flattenedData]);

  const handleSelectSearch = (item: any) => {
    setMainComp(item.component);
    setFailType(item.failure);
    setActType(item.action);

    setSearchQuery("");
    setSearchResults([]);
  };

  // Auto-fill Mapping
  const equipRegistry: any = {
    "Reach Stacker": {},
    "Trailer": {},
    "Forklift": {},
    "Kereta Tempel": {},
    "Side Loader": {},
    "Top Loader": {},
    "Tronton": {}
  };

  const handleEquipChange = (name: string) => {
    setEquipName(name);
    if (equipRegistry[name]) {
      generateRandomReports();
      setNoSPK(`SPK-${new Date().getFullYear()}-${Math.floor(Math.random() * 999).toString().padStart(3,'0')}`);
    } else {
      setNoSPK("");
    }
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

  // BPB State
  const [isBPBModalOpen, setIsBPBModalOpen] = useState(false);
  const [bpbSelections, setBpbSelections] = useState<any[]>([]);
  const [lockedRows, setLockedRows] = useState<number[]>([]);
  const [generatedBPB, setGeneratedBPB] = useState<string | null>(null);
  const [bpbList, setBpbList] = useState<any[]>([
    {
      noBPB: "BPB/123456/HVE/01/25",
      part: "HYDRAULIC PUMP",
      qty: 2,
      activity: "HOIST WINCH - Pin Rem Cargo Lepas",
      target: "LOKB-2026-001",
      spk: "SPK-2026-101"
    }
  ]);

  // BPB Generate Logic
  const generateBPBPreview = () => {
    const rows:any[] = [];

    activities.forEach((act, actIndex) => {
      act.installedParts.forEach((part:any, partIndex:number) => {

        if (part.needPurchase && !part.inBPB) {
          rows.push({
            activityIndex: actIndex,
            partIndex: partIndex,
            name: part.name,
            qty: Math.max(0, part.qty - part.stock),
            shortage: Math.max(0, part.qty - part.stock), 
            keterangan: `${noSPK} | ${act.subSystem} | ${act.failure}`,
            checked: true, // auto checked
            inBPB: false
          });
        }

      });
    });

    setBpbSelections(rows);
    setIsBPBModalOpen(true);
  };

  // BPB Checkbox Logic
  const toggleBPBCheckbox = (index:number) => {
    const updated = [...bpbSelections];
    updated[index].checked = !updated[index].checked;
    setBpbSelections(updated);
  };

  // BPB Save Logic
  const saveBPB = () => {
    const checked = bpbSelections.filter(r => r.checked);

    if (checked.length === 0) {
      alert("Pilih minimal 1 barang");
      return;
    }

    const updatedActivities = [...activities];
    const bpbNumber = `BPB/${Math.floor(Math.random()*999999)}/HVE/01/25`;
    const newEntries:any[] = [];

    checked.forEach(row => {
      const act = updatedActivities[row.activityIndex];
      updatedActivities[row.activityIndex]
        .installedParts[row.partIndex]
        .inBPB = true;

      let target = "-";
      if (act.docNumber?.startsWith("LOKB")) target = act.docNumber;
      else if (act.docNumber?.startsWith("LOKK")) target = act.docNumber;
      else target = "SELF";

      newEntries.push({
        noBPB: bpbNumber,
        part: row.name,
        qty: row.qty,
        activity: `${act.subSystem} - ${act.failure}`,
        target: target,
        spk: `SPK-${new Date().getFullYear()}-${Math.floor(Math.random() * 999).toString().padStart(3,'0')}`
      });
    });

    setActivities(updatedActivities);

    const locked = checked.map(r => r.activityIndex);
    setLockedRows(prev => [...new Set([...prev, ...locked])]);
    setBpbList(prev => [...prev, ...newEntries]);
    setGeneratedBPB(bpbNumber);
    setIsBPBModalOpen(false);
  };

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
    { code: "228C0-80012", name: "CYLINDER ASSY LIFT", stock: 12 },
    { code: "[RFB] 228C0-80012", name: "[RFB]CYLINDER ASSY LIFT", stock: 12 },
    { code: "91B40-20021", name: " HYDRAULIC PUMP", stock: 5 },
    { code: "[RFB] 91B40-20021", name: "[RFB]HYDRAULIC PUMP", stock: 5 },
    { code: "8302F-83CX7", name: "A PART", stock: 0 },
    { code: "01111-54210", name: "ENGINE MOUNTING", stock: 500 }
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
      if (!mechanics.includes(val)) setMechanics([...mechanics, val]); setMechInput(""); 
    }
    else { 
      if (!helpers.includes(val)) setHelpers([...helpers, val]); setHelperInput(""); 
    }
  };

  const removePerson = (type: 'mechanic' | 'helper', index: number) => {
    if (type === 'mechanic') setMechanics(mechanics.filter((_, i) => i !== index));
    else setHelpers(helpers.filter((_, i) => i !== index));
  };

  const generateDocNumber = (type: string) => {
    const random = Math.floor(Math.random() * 999)
      .toString()
      .padStart(3, "0");

    if (type === "other_dept") {
      return `LOKB-${new Date().getFullYear()}-${random}`;
    }

    if (type === "vendor") {
      return `LOKK-${new Date().getFullYear()}-${random}`;
    }

    return ""; // self → kosong
  };

  const handleAddActivity = () => {
    if (!mainComp || !failType || !actType || !workType) return;

    const systemMatch = mainComp.match(/\(([^)]+)\)/);
    const systemStr = systemMatch ? systemMatch[1] : "";
    const subSystemStr = mainComp.replace(/\s*\([^)]+\)/, "").trim();
    const docNumber = generateDocNumber(workType);

    const newActivity = { 
      system: systemStr, subSystem: subSystemStr, 
      failure: failType, action: actType, 
      docNumber: docNumber, installedParts: [], removedParts: [] };

    if (editingId !== null) {
       const updated = [...activities]; 
       updated[editingId] = { ...updated[editingId], ...newActivity }; 
       setActivities(updated); setEditingId(null); 
    }
    else { 
      setActivities([...activities, newActivity]); 
    }

    setMainComp(""); 
    setFailType(""); 
    setActType("");
    setWorkType("");
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

      const needPurchase = qtyValue > currentMaxStock || currentMaxStock === 0;
        
      updated[targetActivityIndex].installedParts.push({ 
        name: tempSelectedPart, 
        qty: qtyValue, 
        stock: currentMaxStock,
        needPurchase: needPurchase,
        inBPB: false 
      }); 

      setActivities(updated); 
      setIsModalOpen(false); 
      setShowQtySelection(false); 
      setTargetActivityIndex(null); 
      setIsRefurbished(false);
    }
  };

  const finalizeRemovePart = () => {
    if (targetActivityIndex === null || !tempSelectedPart || !workType) return;

    const updated = [...activities];

    updated[targetActivityIndex].removedParts.push({
      name: tempSelectedPart,
      qty: qtyValue,
      condition: workType
    });

    setActivities(updated);

    // reset
    setIsModalOpen(false);
    setTempSelectedPart("");
    setQtyValue(1);
    setWorkType("");
  };

  return (
    
    <div className="min-h-screen font-sans text-slate-900">
      <datalist id="unified-master">{masterStandardData.map((d, i) => <option key={i} value={d.component} />)}</datalist>
      <datalist id="failure-types">{availableFailures.map((f, i) => <option key={i} value={f} />)}</datalist>
      <datalist id="action-types">{availableActions.map((a, i) => <option key={i} value={a} />)}</datalist>

      <main className="max-w-7xl mx-auto p-8">

        <div className="flex gap-2 mb-5">
          <select className="bg-[#0b6b3a] text-white px-3 py-1 text-xs font-bold">
            <option>TRANSAKSI</option>
            <option>Create SPK</option>
            <option>Daily Log</option>
          </select>

          <select className="bg-[#0b6b3a] text-white px-3 py-1 text-xs font-bold">
            <option>REPORT</option>
          </select>

          <select className="bg-[#0b6b3a] text-white px-3 py-1 text-xs font-bold">
            <option>MONITORING</option>
            <option>SRT</option>
            <option>Oil</option>
            <option>Fuel</option>
          </select>
        </div>

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2"><FileText className="text-blue-600" size={24}/>Daily Log Activity</h2>
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Create Mode</span>
        </div>

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
                <select value={equipName} onChange={(e) => handleEquipChange(e.target.value)} 
                className="col-span-2 bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none">
                  <option value="">Pilih Alat...</option>
                  <option>Reach Stacker</option>
                  <option>Trailer</option>
                  <option>Forklift</option>
                </select>
              </div>

              <div className="grid grid-cols-3 gap-4 items-center">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-tight">No. SPK</label>
                <input disabled value={noSPK} className="col-span-2 bg-slate-100 border border-slate-200 rounded-lg p-2 text-sm font-mono text-blue-700" placeholder="Select Equipment & Location First..."/>
              </div>

              <div className="grid grid-cols-3 gap-4 items-center">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-tight">No. Laporan</label>
                <div 
                className="col-span-2 bg-slate-100 border border-slate-200 rounded-lg p-2 text-sm font-mono text-blue-600 cursor-pointer 
                hover:border-blue-400 transition-colors min-h-[38px] flex items-center flex-wrap gap-1">
                  {combinedReports.length > 0 ? (
                    combinedReports.map((id) => (
                      <span key={id} className={`px-1.5 py-0.5 rounded text-[10px] font-bold border
                        ${id.startsWith("PM")
                          ? "bg-green-100 border-green-200 text-green-700"
                          : "bg-blue-100 border-blue-200 text-blue-700"
                        }`}>
                        {id}
                      </span>
                    ))
                  ) 
                  :
                  (
                    <span className="text-slate-400 italic">
                      Select Equipment & Location First...
                    </span>
                  )}
                </div>
              </div>
{/* 
              <div className="grid grid-cols-3 gap-4 items-center">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-tight">No. LOKB</label>
                <input disabled value={noLOKB} className="col-span-2 bg-slate-100 border border-slate-200 rounded-lg p-2 text-sm font-mono text-blue-700" placeholder="Select Equipment & Location First..."/>
              </div>

              <div className="grid grid-cols-3 gap-4 items-center">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-tight">No. LOKK</label>
                <input disabled value={noLOKK} className="col-span-2 bg-slate-100 border border-slate-200 rounded-lg p-2 text-sm font-mono text-blue-700" placeholder="Select Equipment & Location First..."/>
              </div> */}
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2"><Clock size={16} /> Operational Data</h3>
              <div className="grid grid-cols-3 gap-4 items-center">
                <label className="text-sm font-semibold text-slate-600">Activity Type</label>
                <select className="col-span-2 bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none">
                  <option>01. Maintenance</option>
                  <option>02. Breakdown</option>
                  <option>05. PM 250</option>
                </select>
              </div>
              <div className="grid grid-cols-3 gap-4 items-center">
                <label className="text-sm font-semibold text-slate-600">HMU</label>
                <input type="number" placeholder="0.0" className="col-span-2 bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div className="grid grid-cols-3 gap-4 items-center">
                <label className="text-sm font-semibold text-slate-600">Start Time</label>
                <input type="datetime-local" className="col-span-2 bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none font-bold" />
              </div>
              <div className="grid grid-cols-3 gap-4 items-center">
                <label className="text-sm font-semibold text-slate-600 italic">Waiting Labor</label>
                <input type="number" placeholder="Hrs" value={waitLabor} onChange={(e) => setWaitLabor(e.target.value)} 
                className="col-span-2 bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div className="grid grid-cols-3 gap-4 items-center">
                <label className="text-sm font-semibold text-slate-600 italic">Waiting Part</label>
                <input type="number" placeholder="Hrs" value={waitPart} onChange={(e) => setWaitPart(e.target.value)} 
                className="col-span-2 bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div className="grid grid-cols-3 gap-4 items-center">
                <label className="text-sm font-semibold text-slate-600 italic">Time Repair</label>
                <input type="number" placeholder="Hrs" value={timeRepair} onChange={(e) => setTimeRepair(e.target.value)} 
                className="col-span-2 bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
            </div>

          </div>

          <hr className="border-slate-100" />
          <div className="p-6 bg-slate-50/50">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2"><Users size={16} /> Manpower Allocation</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-tight">Mekanik</label>
                <div className="flex flex-wrap gap-2 p-2 bg-white border border-slate-200 rounded-lg min-h-[42px] focus-within:ring-2 focus-within:ring-blue-500">
                  {mechanics.map((name, index) => (
                    <span key={index} className="flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-xs font-bold border border-blue-100">{name}
                      <button onClick={() => removePerson('mechanic', index)} className="hover:text-red-500"><X size={14} />
                      </button>
                    </span>))}
                  <div className="flex-1 flex gap-2">
                    <select onChange={(e) => setMechInput(e.target.value)} value={mechInput} className="flex-1 bg-transparent text-sm outline-none cursor-pointer">
                      <option value="">+ Pilih Mekanik</option>
                      <option>Budiono</option>
                      <option>Slamet</option>
                      <option>Hadi</option>
                      <option>Anto</option>
                    </select>
                    <button onClick={() => addPerson('mechanic')} className="p-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"><UserPlus size={16}/>
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-tight">Helper</label>
                <div className="flex flex-wrap gap-2 p-2 bg-white border border-slate-200 rounded-lg min-h-[42px] focus-within:ring-2 focus-within:ring-blue-500">
                  {helpers.map((name, index) => (
                    <span key={index} className="flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded-md text-xs font-bold border border-green-100">{name}
                      <button onClick={() => removePerson('helper', index)} className="hover:text-red-500"><X size={14} /></button>
                    </span>))}
                  <div className="flex-1 flex gap-2">
                    <select onChange={(e) => setHelperInput(e.target.value)} value={helperInput} className="flex-1 bg-transparent text-sm outline-none cursor-pointer">
                      <option value="">+ Pilih Helper</option>
                      <option>Joko</option>
                      <option>Randi</option>
                      <option>Eko</option>
                      <option>Dedi</option>
                    </select>
                    <button onClick={() => addPerson('helper')} className="p-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"><UserPlus size={16}/>
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-6">
          <div className="bg-slate-800 p-3 px-6"><h3 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2"><Wrench size={14} /> Input Activity Details</h3></div>
          <div className="p-4 space-y-3">
            <div className="relative">
              <input
                value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search component / failure / action..."
                className="w-full border border-slate-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"/>
              {searchResults.length > 0 && (
                <div className="absolute z-50 w-full bg-white border border-slate-200 rounded-lg shadow-lg mt-1 max-h-60 overflow-auto">
                  {searchResults.map((item, index) => (
                    <div key={index} onClick={() => handleSelectSearch(item)}
                      className="p-3 hover:bg-blue-50 cursor-pointer border-b last:border-none">
                      <div className="text-xs font-bold text-blue-700">
                        {item.component}
                      </div>
                      <div className="text-xs text-red-600">
                        {item.failure}
                      </div>
                      <div className="text-xs text-green-600">
                        {item.action}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input list="unified-master" value={mainComp} onChange={(e) => setMainComp(e.target.value)} placeholder="Main Component..."
                className="border border-slate-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"/>

              <input list="failure-types" value={failType} onChange={(e) => setFailType(e.target.value)} placeholder="Failure Type..."
                className="border border-slate-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"/>

              <input list="action-types" value={actType} onChange={(e) => setActType(e.target.value)} placeholder="Action Type..."
                className="border border-slate-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"/>
            </div>
          </div>
          
          <div className='grid grid-cols-4 ml-4 gap-2 '>
            <div className='flex'>
              <input required type="radio" name='workType' id='self' value="self" checked={workType === "self"} onChange={(e) => setWorkType(e.target.value)}></input>
              <label htmlFor='self' className="text-xs font-bold text-slate-500 uppercase tracking-tight ml-2 flex items-center gap-1">Dikerjakan Sendiri</label>
            </div>
 
            <div className='flex'>
              <input required type="radio" name='workType' value="other_dept"  id='other_dept' checked={workType === "other_dept"} onChange={(e) => setWorkType(e.target.value)}></input>
              <label htmlFor='other_dept' className="text-xs font-bold text-slate-500 uppercase tracking-tight ml-2 flex items-center gap-1">Dikerjakan oleh Departemen Lain</label>
            </div>

            <div className='flex'>
              <input required type="radio" name='workType' value="vendor" id='vendor' checked={workType === "vendor"} onChange={(e) => setWorkType(e.target.value)}></input>
              <label htmlFor='vendor' className="text-xs font-bold text-slate-500 uppercase tracking-tight ml-2 flex items-center gap-1">Dikerjakan oleh Vendor</label>
            </div>

            <div className="px-4 pb-4 flex justify-end gap-2">{editingId !== null && (
              <button onClick={() => {setEditingId(null); setMainComp(""); setFailType(""); setActType("");}} 
                className="bg-slate-500 hover:bg-slate-600 text-white px-6 py-2 rounded-lg text-sm font-bold flex items-center gap-2"><RotateCcw size={18} /> CANCEL</button>)}
              <button onClick={handleAddActivity} className={`${editingId !== null ? 'bg-orange-500 hover:bg-orange-600' : 'bg-green-600 hover:bg-green-700'} text-white px-6 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors`}>
                {editingId !== null ? <Save size={18} /> : <Plus size={18} />}{editingId !== null ? 'UPDATE ACTIVITY' : 'ADD ACTIVITY'}
              </button>
            </div>
          </div>  

          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead className="bg-[#005a32] text-white font-bold border-y border-slate-200 tracking-tighter">
                <tr>
                  <th className="px-2 py-3 uppercase">System</th>
                  <th className="px-6 py-3 uppercase">Sub-system</th>
                  <th className="px-6 py-3 uppercase">Failure Type</th>
                  <th className="px-6 py-3 uppercase">Action Type</th>
                  <th className="px-6 py-3 uppercase">No. Docs</th>
                  <th className="px-6 py-3 uppercase">Installed Parts</th>
                  <th className="px-6 py-3 uppercase">Removed Parts</th>
                  {/* <th className="px-6 py-3 text-center uppercase">Qty</th> */}
                  <th className="px-4 py-3 text-center uppercase">Parts Action</th>
                  <th className="px-2 py-3 text-center uppercase">Action</th>
                </tr>
              </thead>
            <tbody className="font-bold uppercase">{activities.length === 0 ? 
            (
            <tr>
              <td colSpan={7} className="px-6 py-12 text-center text-slate-400 italic">Belum ada data aktivitas</td>
            </tr>) : (activities.map((act, index) => (
              <tr key={index} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                <td className="px-2 py-4 text-blue-800">{act.system}</td>
                <td className="px-6 py-4">{act.subSystem}</td>
                <td className="px-6 py-4 text-red-700">{act.failure}</td>
                <td className="px-6 py-4 text-green-700">{act.action}</td>
                <td className="px-6 py-4">{act.docNumber}</td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1">
                    {act.installedParts.map((p: any, i: number) => (
                      <span key={i} className="text-[10px] bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                      {p.name} x{p.qty}
                      {p.needPurchase && (
                        <span className="ml-2 text-red-600 font-bold">
                          (AJUKAN)
                        </span>
                      )}
                      </span>))}
                  </div>
                </td>
                <td className="px-6 py-4">
                  {act.removedParts.map((p: any, i: number) => (
                    <div key={i} className="text-[10px] text-orange-600">
                      {p.name} x{p.qty} ({p.condition})
                    </div>
                  ))}
                </td>
                {/* <td className="px-6 py-4 text-center">
                  <div className="flex flex-col gap-1">
                    {act.spareParts.map((p: any, i: number) => (<span key={i} className="text-[10px] font-black text-blue-600 px-2 py-0.5">x{p.qty}</span>))}
                  </div>
                </td> */}
                <td className="px-4 py-4 text-right">
                  <div className="flex flex-col gap-1">
                      <button onClick={() => { setPartMode("install"); setTargetActivityIndex(index); setIsModalOpen(true); }}
                        className="bg-blue-600 text-white px-3 py-1 w-20 rounded text-[10px]">
                        + INSTALL
                      </button>

                      <button onClick={() => { 
                        setPartMode("remove"); setTargetActivityIndex(index); setIsModalOpen(true); 
                        setTempSelectedPart(""); setQtyValue(1); setWorkType("");}}
                        className="bg-orange-500 text-white px-3 py-1 w-20 rounded text-[10px]">
                        + REMOVE
                      </button>
                    </div>
                </td>
                <td className="px-2 py-4 text-right">
                  <div className="flex flex-col gap-1 items-end">
                    <button disabled={lockedRows.includes(index)} onClick={() => handleEdit(index)} 
                      className={`px-3 py-1 rounded text-[10px] w-20 ${lockedRows.includes(index) ? "bg-gray-300 cursor-not-allowed" : "bg-green-500 text-white"}`}>
                        EDIT
                    </button>

                    <button disabled={lockedRows.includes(index)} onClick={() => setActivities(activities.filter((_, i) => i !== index))}
                      className={`px-3 py-1 rounded text-[10px] w-20 ${lockedRows.includes(index) ? "bg-gray-300 cursor-not-allowed" : "bg-red-600 text-white"}`}>
                      DELETE
                    </button>
                  </div>
                </td>
              </tr>)))}
            </tbody>
          </table>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 mt-8 overflow-hidden">
          <div className="bg-[#005a32] p-3 px-6">
            <h3 className="text-xs font-bold text-white uppercase tracking-widest">
              BPB LIST
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead className="bg-slate-100 text-slate-600 font-bold">
                <tr>
                  <th className="px-4 py-3">No BPB</th>
                  <th className="px-4 py-3">Part</th>
                  <th className="px-4 py-3">Qty</th>
                  <th className="px-4 py-3">Activity</th>
                  <th className="px-4 py-3">Target</th>
                  <th className="px-4 py-3">SPK</th>
                </tr>
              </thead>

              <tbody>
                {bpbList.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-6 text-slate-400 italic">
                      No BPB data yet
                    </td>
                  </tr>
                ) : (
                  bpbList.map((item, index) => (
                    <tr key={index} className="border-b hover:bg-slate-50">
                      <td className="px-4 py-3 font-mono text-blue-700">{item.noBPB}</td>
                      <td className="px-4 py-3">{item.part}</td>
                      <td className="px-4 py-3 font-bold">{item.qty}</td>
                      <td className="px-4 py-3 text-xs">{item.activity}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-xs font-bold
                          ${item.target === "SELF"
                            ? "bg-gray-100 text-gray-600"
                            : item.target.startsWith("LOKB")
                            ? "bg-blue-100 text-blue-700"
                            : "bg-orange-100 text-orange-700"
                          }`}>
                          {item.target}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-green-700 font-mono">{item.spk}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex gap-3 justify-end items-center">
          <button onClick={generateBPBPreview} className="px-6 py-2.5 rounded-lg text-sm font-bold bg-green-600 text-white hover:bg-green-700">Generate BPB</button>
          <button className="px-6 py-2.5 rounded-lg text-white text-sm font-bold bg-red-500 hover:bg-red-600 transition-colors flex items-center gap-2"><X size={18} /> CANCEL</button>
          <button className="px-6 py-2.5 rounded-lg text-sm font-bold bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 transition-colors">SAVE & CLOSE</button>
          <button className="px-8 py-2.5 rounded-lg text-sm font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200 flex items-center gap-2"><Save size={18} /> SAVE ALL</button>
        </div>
      </main>

      {/* --- LAPORAN POPUP MODAL --- */}
      {isLaporanModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl overflow-hidden border-2 border-blue-600 animate-in fade-in zoom-in-95 duration-200">
            <div className="p-4 bg-blue-600 text-white flex justify-between items-center">
              <h2 className="font-bold uppercase tracking-tight flex items-center gap-2"><FileText size={18} /> Pilih No. Laporan</h2>
              <button onClick={() => setIsLaporanModalOpen(false)} className="hover:bg-blue-700 rounded-full p-1"><X size={20} /></button>
            </div>
            <div className="overflow-x-auto max-h-[400px]">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-100 text-slate-600 font-bold border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3 text-center w-12">Select</th>
                    <th className="px-10 py-3">No. Laporan</th>
                    <th className="px-10 py-3">Tanggal Laporan</th>
                    <th className="px-4 py-3">Pelapor</th>
                    <th className="px-4 py-3">Kategori</th>
                    <th className="px-4 py-3">Detail Laporan</th>
                    <th className="px-10 py-3">Keterangan Mekanik</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {laporanMasterList.map((lap) => (
                    <tr key={lap.id} onClick={() => toggleLaporanSelection(lap.id)} className={`cursor-pointer hover:bg-blue-50 transition-colors ${selectedLaporan.includes(lap.id) ? 'bg-blue-50/50' : ''}`}>
                      <td className="px-4 py-3 text-center">{selectedLaporan.includes(lap.id) ? <CheckSquare size={18} className="text-blue-600 mx-auto" /> : <Square size={18} className="text-slate-300 mx-auto" />}</td>
                      <td className="px-4 py-3 font-bold text-blue-700">{lap.id}</td>
                      <td className="px-4 py-3 font-medium">{lap.date}</td>
                      <td className="px-4 py-3 text-red-600 font-bold">{lap.reporter}</td>
                      <td className="px-4 py-3">{lap.category}</td>
                      <td className="px-4 py-3">{lap.details}</td>
                      <td className="px-4 py-3">{lap.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
              <button onClick={() => setIsLaporanModalOpen(false)} className="px-6 py-2 bg-blue-600 text-white rounded text-[10px] font-bold uppercase tracking-widest hover:bg-blue-700 shadow-md">Confirm Selection</button>
            </div>
          </div>
        </div>
      )}

      {/* --- SPARE PART MODAL -- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-xl overflow-hidden border border-slate-200">
            {partMode === "install" ? (
              !showQtySelection ? (
                <><div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white">
                    <h2 className="text-blue-700 font-bold uppercase tracking-tight flex items-center gap-2"><Search size={18} /> Item Search</h2>
                    <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-red-500 transition-colors"><X size={20} /></button>
                  </div>
                  <div className="bg-[#005a32] text-white p-3 font-bold text-xs uppercase flex justify-between">
                    <span className="w-2/5">Kode Barang</span>
                    <span className="w-2/5 text-left">Nama Barang</span>
                    <span className="w-1/5 text-center">Stock</span>
                    <span className="w-1/5 text-center">Action</span>
                  </div>
                  <div className="max-h-96 overflow-y-auto">{sparePartsList.map((item, idx) => (
                    <div key={idx} className="p-4 flex justify-between items-center border-b border-slate-50 hover:bg-slate-50 transition-colors">
                      <span className="text-sm font-medium text-slate-700 w-2/5">{item.code}</span>
                      <span className="text-sm font-medium text-slate-700 w-2/5">{item.name}</span>
                      <span className={`text-xs font-black w-1/5 text-center ${item.stock < 10 ? 'text-red-600' : 'text-slate-500'}`}>{item.stock}</span>
                      <div className="w-1/5 text-right">
                        <button onClick={() => initiateQtySelection(item)} className="bg-[#005a32] hover:bg-green-800 text-white px-4 py-1.5 rounded text-[10px] font-bold uppercase tracking-tighter shadow-sm">SELECT</button>
                      </div>
                    </div>))}
                  </div></>
              ) : (
                <div className="p-8 text-center space-y-6">
                  <div className="mx-auto w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center shadow-inner">
                    <Package size={32} />
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">Set Quantity</h3>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">{tempSelectedPart}</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-center gap-6">
                      <button onClick={() => setQtyValue(Math.max(1, qtyValue - 1))} className="p-3 bg-slate-100 rounded-xl hover:bg-slate-200 active:scale-90 transition-all text-slate-600 shadow-sm">
                        <Minus size={24} strokeWidth={3}/>
                      </button>
                      <div className="flex flex-col items-center">
                        <input type="number" value={qtyValue} onChange={(e) => { const val = parseInt(e.target.value) || 1; setQtyValue(val); }} className="w-24 text-center text-3xl font-black text-blue-600 outline-none bg-transparent" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Limit: {qtyValue} / 
                          <span className="text-blue-500">{currentMaxStock}</span>
                        </span>
                      </div>
                      <button onClick={() => setQtyValue(qtyValue + 1)} className={`p-3 rounded-xl transition-all shadow-sm bg-slate-100 text-slate-600 hover:bg-slate-200 active:scale-90`}>
                        <Plus size={24} strokeWidth={3}/>
                      </button>
                    </div>{qtyValue >= currentMaxStock && (<p className="text-[9px] text-red-500 font-bold uppercase flex items-center justify-center gap-1"><AlertCircle size={10} /> Maximum stock reached</p>)}
                    {/* <div className="flex items-center justify-center gap-2 mt-5">
                      <input type="checkbox" id="refurbished" checked={isRefurbished} onChange={(e) => setIsRefurbished(e.target.checked)} className='form-checkbox h-5 w-5 text-blue-600'/>
                      <label htmlFor="refurbished" className="text-lg font-medium text-slate-700">Refurbished</label>
                    </div> */}
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button onClick={() => setShowQtySelection(false)} className="flex-1 px-6 py-3 rounded-xl text-xs font-black bg-slate-100 text-slate-500 uppercase hover:bg-slate-200 flex items-center justify-center gap-2"><ChevronLeft size={16}/> Back</button>
                    <button onClick={finalizePartAddition} className="flex-1 px-6 py-3 rounded-xl text-xs font-black bg-blue-600 text-white uppercase hover:bg-blue-700 shadow-lg shadow-blue-200 flex items-center justify-center gap-2"><Save size={16}/> Add Part</button>
                  </div>
                </div>
              )
            ) : (
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-orange-600 font-bold">Remove Part</h2>
                  <button onClick={() => setIsModalOpen(false)}>
                    <X size={20}/>
                  </button>
                </div>

                <select required value={tempSelectedPart} onChange={(e) => setTempSelectedPart(e.target.value)} className="w-full border p-2 rounded">
                  <option value="">Select Part</option>
                  {sparePartsList.map((item, idx) => (
                    <option key={idx} value={item.name}>
                      {item.name}
                    </option>
                  ))}
                </select>

                <input required type="number" value={qtyValue} className="w-full border p-2 rounded"
                  onChange={(e) => setQtyValue(parseInt(e.target.value) || 1)}/>

                <select required value={workType} onChange={(e) => setWorkType(e.target.value)} className="w-full border p-2 rounded">
                  <option value="">Condition</option>
                  <option value="refurbish">Refurbish</option>
                  <option value="repair">Repair</option>
                  <option value="scrap">Scrap</option>
                </select>

                <button onClick={finalizeRemovePart} className="w-full bg-orange-600 text-white py-2 rounded">
                  Add Removed Part
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- BPB PREVIEW MODAL -- */}
      {isBPBModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-[700px]">

            <div className="mb-4">
              <div>No BPB : {generatedBPB ?? "-"}</div>
              <div>BPB Created On : {new Date().toLocaleDateString()}</div>
            </div>

            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th>Nama Barang</th>
                  <th>Jumlah</th>
                  <th>Keterangan</th>
                  <th>Ajukan Pengadaan</th>
                </tr>
              </thead>

              <tbody>
              {bpbSelections.map((row, i)=>(
                <tr key={i} className="border-b">
                  <td>{row.name}</td>
                  <td>{row.qty}</td>
                  <td>{row.keterangan}</td>
                  <td className="text-center">
                    {row.inBPB ? (
                      <span className="text-xs text-gray-400 italic">Processed</span>) 
                      : (
                      <input type="checkbox" checked={row.checked} onChange={() => toggleBPBCheckbox(i)}/>
                    )}
                  </td>
                </tr>
              ))}
              </tbody>
            </table>

            <div className="flex justify-end mt-4 gap-3">
              <button onClick={()=>setIsBPBModalOpen(false)} className="px-5 py-2 bg-gray-300 rounded">Cancel</button>
              <button onClick={saveBPB} className="px-5 py-2 bg-blue-600 text-white rounded">Simpan</button>
            </div>

          </div>
        </div>
        )}
    </div>
  );
};

export default DailyLogActivity;