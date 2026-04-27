"use client";
import { useState, useMemo, useEffect } from 'react';
import { 
  Plus, Save, X, Settings, FileText, Clock, Wrench, Users,
  Search, RotateCcw, UserPlus, Package, Minus, ChevronLeft, AlertCircle, CheckSquare, Square, 
  Edit,
} from 'lucide-react';

const DailyLogActivity = () => {
  const [activities, setActivities] = useState<any[]>([]);
  const [mechanics, setMechanics] = useState<string[]>([]);
  const [helpers, setHelpers] = useState<string[]>([]);

  // Equipment & Code State
  const [equipName, setEquipName] = useState("");
  const [noSPK, setNoSPK] = useState("");

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
  const [selectedReports, setSelectedReports] = useState<any[]>([]);
  const [selectedReportDetail, setSelectedReportDetail] = useState<any>(null);
  const [isReportDetailOpen, setIsReportDetailOpen] = useState(false);
  const [autoReports, setAutoReports] = useState<string[]>([]);
  const [isDocOpen, setIsDocOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<any>(null);
  const selectedPM = selectedReports.find(r => r.type === "pm");

  const laporanMasterList = [
    { id: "LOG-2026-001", date: "2026-10-01", reporter: "Budi", category: "Breakdown", details: "Alat tidak bisa nyala", notes: "" },
    { id: "LOG-2026-002", date: "2026-10-02", reporter: "Joko", category: "Maintenance", details: "Perbaikan rutin", notes: "[2026/10/04 - Toni] Diperbaiki pada next PM" },
    { id: "LOG-2026-003", date: "2026-10-03", reporter: "Tono", category: "Breakdown", details: "SLING CARGO PUTUS", notes: "" },
    { id: "LOG-2026-004", date: "2026-10-04", reporter: "Anto", category: "Breakdown", details: "Steering berat", notes: "" },
    { id: "LOG-2026-005", date: "2026-10-05", reporter: "Vin", category: "Maintenance", details: "Oli netes dari engine", notes: "[2026/10/07 - Toni] Perlu rutin tambah oli, perbaikan pada next PM" }
  ];

  // For Activity 
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

  const pmPackages = {
    "PM-500": {
      component: "[0-0] SCHEDULED MAINT. (PM)",
      failure: "Preventive Maintenance",
      action: "Preventive Maintenance",
      parts: [
        {
          name: "GREASE STANDARD",
          field_name: "GREASE",
          satuan: "KG",
          qty: 2,
          stock: 100,
          needPurchase: false
        }
      ]
    }
  };

  useEffect(() => {
    const selectedPM = selectedReports.find(r => r.type === "pm");

    if (selectedPM) {
      const pmData = pmPackages[selectedPM.id];

      if (pmData) {
        setMainComp(pmData.component);
        setFailType(pmData.failure);
        setActType(pmData.action);
      }
    }
  }, [selectedReports]);

  const handleOpenReportDetail = (id: string) => {
    const breakdown = laporanBreakdownList.find(r => r.id === id);
    const mekanik = laporanMekanikList.find(r => r.id === id);
    const pm = pmMasterList.find(r => r.id === id);

    if (breakdown) {
      setSelectedReportDetail({ ...breakdown, type: "breakdown" });
    } else if (mekanik) {
      setSelectedReportDetail({ ...mekanik, type: "mekanik" });
    } else if (pm) {
      setSelectedReportDetail({ ...pm, type: "pm" });
    }

    setIsReportDetailOpen(true);
  };

  const openDocumentation = (data: any) => {
    setSelectedDoc(data);
    setIsDocOpen(true);
  };

  const generateRandomReports = () => {
    const randomLaporan =
      laporanMasterList[Math.floor(Math.random() * laporanMasterList.length)];

    const randomPM =
      pmMasterList[Math.floor(Math.random() * pmMasterList.length)];

    const result = [randomLaporan.id, randomPM.id];

    setAutoReports(result);

    return result;
  };

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
  const [partSearch, setPartSearch] = useState("");
  const [categorySearch, setCategorySearch] = useState("");

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

  useEffect(() => {
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

  const handleEquipChange = (name: string) => {
    setEquipName(name);
    if (name) {
      const reports = generateRandomReports();
      setNoSPK(`SPK-${new Date().getFullYear()}-${Math.floor(Math.random() * 999).toString().padStart(3,'0')}`);
    } else {
      setNoSPK("");
      setAutoReports([]);
    }
  };

  const toggleReportSelection = (item: any, type: "laporan" | "pm") => {
    const exists = selectedReports.find(r => r.id === item.id);

    if (exists) {
      setSelectedReports(prev => prev.filter(r => r.id !== item.id));
    } else {
      setSelectedReports(prev => [...prev, { ...item, type }]);
    }
  };

  // Locked Rows
  const [lockedRows, setLockedRows] = useState<number[]>([]);

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
    { code: "228C0-80012", name: "CYLINDER ASSY LIFT", field_name: "CYLINDER ASSY LIFT", 
      category_code: "MSLL", category: "MESIN LAIN - LAIN", satuan: "PCS", status:"NORMAL",  stock: 12 },
    { code: "[RFB] 228C0-80012", name: "[RFB]CYLINDER ASSY LIFT", field_name: "CYLINDER ASSY LIFT", 
      category_code: "MSLL", category: "MESIN LAIN - LAIN", satuan: "PCS", status:"NORMAL",  stock: 12 },
    { code: "HVE.GSKT.800619", name: "GASKET KIT 80-0619 BOSPOM PF6", field_name: "80-0619 REPAIRKIT BOSCHPUMP PF-6", 
      category_code: "HVE", category: "HEAVY EQUIPMENT", satuan: "SET",status:"CRITICAL", stock: 5 },
    { code: "KWLS2.5SUPERSETE", name: "MAC SUPER STEEL 🚫 2.5MM", field_name: "MAC SUPER STEEL A 2.5MM", 
      category_code: "KWLS", category: "KAWAT LAS", satuan: "KG", status:"CRITICAL", stock: 5 },
    { code: "NIS.260.AA21002", name: "159620-6821002 ACTUATOR ASSY GOVERNOR NISSAN EURO PK260", field_name: "GOVERNOR PK 260", 
      category_code: "NIS PK260", category: "MESIN NISSAN EURO PK260", satuan: "PCS", status:"NORMAL", stock: 0 },
    { code: "HOSE.HREL3X3", name: 'HOSE RADIATOR ELBOW 🚫 3" X 3"', field_name: 'HOSE RADIATOR ELBOW A 3" X 3"', 
      category_code: "HOSE", category: "SELANG / HOSE", satuan: "MTR", status:"NORMAL", stock: 500 }
  ];
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showQtySelection, setShowQtySelection] = useState(false);
  const [targetActivityIndex, setTargetActivityIndex] = useState<number | null>(null);
  const [targetPartIndex, setTargetPartIndex] = useState<number | null>(null);
  const [tempSelectedPart, setTempSelectedPart] = useState<any>(null);
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
    if (!mainComp || !failType || !actType || selectedReports.length === 0) return;

    let newActivity;

    if (selectedPM) {
      const pmData = pmPackages[selectedPM.id];

      const systemMatch = pmData.component.match(/\(([^)]+)\)/);
      const systemStr = systemMatch ? systemMatch[1] : "";
      const subSystemStr = pmData.component.replace(/\s*\([^)]+\)/, "").trim();

      newActivity = {
        report: [...selectedReports],
        system: systemStr,
        subSystem: subSystemStr,
        failure: pmData.failure,
        action: pmData.action,
        docNumber: generateDocNumber(workType),
        installedParts: pmData.parts || [],
        isPM: true
      };

    } else {
      const systemMatch = mainComp.match(/\(([^)]+)\)/);
      const systemStr = systemMatch ? systemMatch[1] : "";
      const subSystemStr = mainComp.replace(/\s*\([^)]+\)/, "").trim();

      newActivity = {
        report: [...selectedReports],
        system: systemStr,
        subSystem: subSystemStr,
        failure: failType,
        action: actType,
        docNumber: generateDocNumber(workType),
        installedParts: [],
        isPM: false
      };
    }

    if (editingId !== null) {
       const updated = [...activities]; 
       updated[editingId] = { ...newActivity, installedParts: updated[editingId].installedParts || [],};
       setActivities(updated); setEditingId(null); 
    }
    else { 
      setActivities([...activities, newActivity]); 
    }

    setMainComp(""); 
    setFailType(""); 
    setActType("");
    setSelectedReports([]);
  };

  const handleEdit = (index: number) => {
    const act = activities[index]; 
    setEditingId(index); 
    setMainComp(`${act.subSystem} (${act.system})`); 
    setFailType(act.failure); 
    setActType(act.action);
    setSelectedReports(act.report);
  };

  const handleDeletePart = (activityIndex: number, partIndex: number) => {
    const updated = [...activities];

    updated[activityIndex].installedParts.splice(partIndex, 1);

    setActivities(updated);
  };

  const filteredParts = sparePartsList.filter((item) => {
    const qPart = partSearch.toLowerCase();
    const qCategory = categorySearch.toLowerCase();

    const matchPart = [item.code, item.name]
      .some(field => field?.toLowerCase().includes(qPart));

    const matchCategory = [item.category_code, item.category]
      .some(field => field?.toLowerCase().includes(qCategory));

    return matchPart && matchCategory;
  });

  const initiateQtySelection = (part: any) => { 
    setTempSelectedPart(part); 
    setCurrentMaxStock(part.stock); 
    setQtyValue(1); 
    setShowQtySelection(true); 
  };

  const finalizePartAddition = () => {
    if (targetActivityIndex !== null) { 
      const updated = [...activities]; 

      const needPurchase = qtyValue > currentMaxStock || currentMaxStock === 0;
        
      if (targetPartIndex !== null) {
        // ✅ EDIT MODE
        updated[targetActivityIndex].installedParts[targetPartIndex] = {
          name: tempSelectedPart.name,
          field_name: tempSelectedPart.field_name,
          satuan: tempSelectedPart.satuan,
          qty: qtyValue,
          stock: currentMaxStock,
          needPurchase
        };
      } else {
        updated[targetActivityIndex].installedParts.push({ 
          name: tempSelectedPart.name, 
          field_name: tempSelectedPart.field_name, // ✅ FIX
          satuan: tempSelectedPart.satuan, 
          qty: qtyValue, 
          stock: currentMaxStock,
          needPurchase: needPurchase,
        }); 
        setTargetPartIndex(null);
      }

      setActivities(updated); 
      setIsModalOpen(false); 
      setShowQtySelection(false); 
      setTargetActivityIndex(null);
      setTargetPartIndex(null);
    }
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
              {/* <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2"><Settings size={16} /> Equipment Details</h3> */}
              
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
                  <option value="">Choose Equipment...</option>
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
                  {autoReports.length > 0 ? (
                    autoReports.map((id) => (
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

              <div className="grid grid-cols-3 gap-4 items-center">
                <label className="text-sm font-semibold text-slate-600">Activity Type</label>
                <select className="col-span-2 bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none">
                  <option>01. Maintenance</option>
                  <option>02. Breakdown</option>
                  <option>05. PM 250</option>
                </select>
              </div>
            </div>

            <div className="space-y-3">
              {/* <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2"><Clock size={16} /> Operational Data</h3> */}
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

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <input list="unified-master" value={mainComp} onChange={(e) => setMainComp(e.target.value)} placeholder="Main Component..."
                className="border border-slate-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"/>

              <input list="failure-types" value={failType} onChange={(e) => setFailType(e.target.value)} placeholder="Failure Type..."
                className="border border-slate-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"/>

              <input list="action-types" value={actType} onChange={(e) => setActType(e.target.value)} placeholder="Action Type..."
                className="border border-slate-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"/>

              <div onClick={() => setIsLaporanModalOpen(true)}
                className="bg-slate-100 border border-slate-200 rounded-lg p-2 text-sm font-mono text-blue-600 cursor-pointer 
                hover:border-blue-400 transition-colors min-h-[38px] flex gap-0.5 items-center">
                {selectedReports.length > 0 ? (
                  selectedReports.map((item) => (
                    <span key={item.id} className={`px-1 py-0.5 rounded text-[10px] font-bold border
                        ${item.type === "pm"
                          ? "bg-green-100 border-green-200 text-green-700"
                          : "bg-blue-100 border-blue-200 text-blue-700"
                        }`}>
                      {item.id}
                    </span>
                  ))
                ) : (
                  <span className="text-slate-400">
                    Select Laporan...
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <div className='grid grid-cols-1 ml-4 gap-2 '>
            {/* <div className='flex'>
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
            </div> */}

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
                <tr className=''>
                  <th className="px-2 py-3 text-center uppercase">Report ID</th>
                  <th className="px-2 py-3 text-center uppercase">System</th>
                  {/* <th className="px-6 py-3 uppercase">Sub-system</th> */}
                  <th className="px-2 py-3 text-center uppercase">Failure Type</th>
                  <th className="px-2 py-3 text-center uppercase">Action Type</th>
                  {/* <th className="px-6 py-3 uppercase">No. Docs</th> */}
                  <th className="px-2 py-3 text-center uppercase">Part Name</th>
                  <th className="px-2 py-3 text-center uppercase">Part Field Name</th>
                  {/* <th className="px-6 py-3 uppercase">Removed Parts</th> */}
                  <th className="px-6 py-3 text-center uppercase">Qty</th>
                  {/* <th className="px-4 py-3 text-center uppercase">Parts Action</th> */}
                  <th className="px-2 py-3 text-center uppercase">Action</th>
                </tr>
              </thead>
            <tbody className="font-bold uppercase">{activities.length === 0 ? 
            (
            <tr className=''> 
              <td colSpan={8} className="px-6 py-12 text-center text-slate-400 italic">Belum ada data aktivitas</td>
            </tr>) : (activities.map((act, index) => (
              <tr key={index} className="border-b border-slate-100 hover:bg-slate-50 transition-colors divide-x divide-slate-300">
                <td className='px-2 py-4'>
                  <div className='flex flex-col gap-1'>
                    {act.report.map((item: any) => (
                      <span key={item.id} onClick={() => handleOpenReportDetail(item.id)} 
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold border text-center cursor-pointer
                        ${item.type === "pm"
                          ? "bg-green-100 border-green-200 text-green-700"
                          : "bg-blue-100 border-blue-200 text-blue-700"
                        }`}>
                      {item.id}
                    </span>
                    ))}
                  </div>
                  
                </td>
                <td className="px-2 py-4 text-blue-800">
                  <div className='flex flex-col gap-1'>
                    <span>{act.system}</span> 
                    <span className='overflow-hidden text-ellipsis'>{act.subSystem}</span>
                  </div>
                </td>
                {/* <td className="px-6 py-4">{act.subSystem}</td> */}
                <td className="px-2 py-4 text-red-700">{act.failure}</td>
                <td className="px-2 py-4 text-green-700">{act.action}</td>
                <td className="px-2 py-4">
                  <div className='flex flex-col gap-1'>
                    {act.installedParts.map((p: any, i: number) => (
                      <div key={i} className="flex justify-between items-center text-[10px] bg-slate-50 px-2 py-1 rounded border border-slate-100">
                        <span>{p.name}</span>
                      </div>
                      ))}
                  </div>
                </td>
                <td className="px-2 py-4">
                  <div className="flex flex-col gap-1">
                    {act.installedParts.map((p: any, i: number) => (
                      <div key={i} className="flex justify-between items-center text-[10px] bg-slate-50 px-2 py-1 rounded border border-slate-100">
                        <span>{p.field_name}</span>
                      </div>
                      ))}
                  </div>
                </td>
                <td className="px-2 py-4">
                  {act.installedParts.map((p: any, i: number) => (
                    <div key={i} className="flex justify-between items-center text-[10px] bg-slate-50 px-2 py-1 rounded border border-slate-100">
                      <span>{p.qty} {p.satuan} </span>

                      <div className='flex gap-1'>
                        <button disabled={act.isPM} onClick={() => {setTargetActivityIndex(index);
                          setTargetPartIndex(i); setTempSelectedPart(p);
                          setQtyValue(p.qty); setCurrentMaxStock(p.stock);
                          setShowQtySelection(true); setIsModalOpen(true)}} 
                          className={`flex justify-center py-1 w-5 rounded ${act.isPM ? "bg-gray-300 text-gray-600 cursor-not-allowed" : "bg-green-500"}`} >
                          <Edit size={18} className='text-white'/>
                        </button>

                        <button disabled={act.isPM} onClick={() => handleDeletePart(index, i)} 
                        className={`flex justify-center py-1 w-5 rounded ${act.isPM ? "bg-gray-300 text-gray-600 cursor-not-allowed" : "bg-red-500"}`}>
                          <X size={18} className='text-white'/>
                        </button>
                      </div>
                    </div>
                    ))}
                </td>
                <td className="px-2 py-4">
                  <div className="flex flex-col gap-1 items-center">
                    <button disabled={act.isPM} onClick={() => {setTargetActivityIndex(index); setIsModalOpen(true); }}
                        className={`px-3 py-1 w-20 text-[10px] rounded ${act.isPM ? "bg-gray-300 text-gray-600 cursor-not-allowed" : "bg-blue-600 text-white"}`}>
                        ADD PARTS
                      </button>

                    <button disabled={lockedRows.includes(index) || act.isPM} onClick={() => handleEdit(index)} 
                      className={`px-3 py-1 rounded text-[10px] w-20 ${lockedRows.includes(index) || act.isPM ? "bg-gray-300 text-gray-600 cursor-not-allowed" : "bg-green-500 text-white"}`}>
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

        <div className="flex gap-3 justify-end items-center">
          <button className="px-6 py-2.5 rounded-lg text-white text-sm font-bold bg-red-500 hover:bg-red-600 transition-colors flex items-center gap-2"><X size={18} /> CANCEL</button>
          <button className="px-6 py-2.5 rounded-lg text-sm font-bold bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 transition-colors">SAVE & CLOSE</button>
          <button className="px-8 py-2.5 rounded-lg text-sm font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200 flex items-center gap-2"><Save size={18} /> SAVE ALL</button>
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
                      <th className="px-4 py-3 text-center w-12">Select</th>
                      <th className="px-4 py-3">No. Laporan</th>
                      <th className="px-4 py-3">Tanggal Laporan</th>
                      <th className="px-4 py-3">Pelapor</th>
                      <th className="px-4 py-3">Downtime</th>
                      <th className="px-4 py-3">Detail Laporan</th>
                      <th className="px-4 py-3 text-center">Doc</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {laporanBreakdownList.map((lb) => (
                      <tr
                        key={lb.id}
                        onClick={() => toggleReportSelection(lb, "laporan")}
                        className={`cursor-pointer hover:bg-blue-50 transition-colors ${
                          selectedReports.some(r => r.id === lb.id && r.type === "laporan") ? 'bg-blue-50/50' : ''
                        }`}>
                        <td className="px-4 py-3 text-center">
                          {selectedReports.some(r => r.id === lb.id && r.type === "laporan")
                            ? <CheckSquare size={18} className="text-blue-600 mx-auto" />
                            : <Square size={18} className="text-slate-300 mx-auto" />
                          }
                        </td>
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
            <div className="border-t border-slate-200">
              <div className="p-3 bg-slate-50 font-bold text-xs uppercase tracking-wider text-slate-500">
                  Laporan Mekanik
                </div>
              <div className="overflow-auto max-h-[150px]">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-100 text-slate-600 font-bold border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3 text-center w-12">Select</th>
                      <th className="px-4 py-3">No. Laporan</th>
                      <th className="px-4 py-3">Tanggal Laporan</th>
                      <th className="px-4 py-3">Pelapor</th>
                      <th className="px-4 py-3">Detail Laporan</th>
                      <th className="px-4 py-3 text-center">Keterangan Pre-Check</th>
                      <th className="px-4 py-3 text-center">Doc</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {laporanMekanikList.map((lap) => (
                      <tr key={lap.id} onClick={() => toggleReportSelection(lap, "laporan")} className={`cursor-pointer hover:bg-blue-50 transition-colors ${selectedReports.some(r => r.id === lap.id && r.type === "laporan") ? 'bg-blue-50/50' : ''}`}>
                        <td className="px-4 py-3 text-center">{selectedReports.some(r => r.id === lap.id && r.type === "laporan") ? <CheckSquare size={18} className="text-blue-600 mx-auto" /> : <Square size={18} className="text-slate-300 mx-auto" />}</td>
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
            <div className="border-t border-slate-200">
              <div className="p-3 bg-slate-50 font-bold text-xs uppercase tracking-wider text-slate-500">
                Preventive Maintenance
              </div>

              <div className="overflow-auto max-h-[200px]">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-100 text-slate-600 font-bold border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3 text-center w-12">Select</th>
                      <th className="px-4 py-3">PM Type</th>
                      <th className="px-4 py-3">Current HM</th>
                      <th className="px-4 py-3">HM Target</th>
                      <th className="px-4 py-3">AVG HM / Day</th>
                      <th className="px-4 py-3">Date Prediction</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {pmMasterList.map((pm) => (
                      <tr
                        key={pm.id}
                        onClick={() => toggleReportSelection(pm, "pm")}
                        className={`cursor-pointer hover:bg-blue-50 transition-colors ${
                          selectedReports.some(r => r.id === pm.id && r.type === "pm") ? 'bg-blue-50/50' : ''
                        }`}>
                        <td className="px-4 py-3 text-center">
                          {selectedReports.some(r => r.id === pm.id && r.type === "pm")
                            ? <CheckSquare size={18} className="text-blue-600 mx-auto" />
                            : <Square size={18} className="text-slate-300 mx-auto" />
                          }
                        </td>
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

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
              <button onClick={() => setIsLaporanModalOpen(false)} className="px-6 py-2 bg-blue-600 text-white rounded text-[10px] font-bold uppercase tracking-widest hover:bg-blue-700 shadow-md">Confirm Selection</button>
            </div>
          </div>
        </div>
      )}

      {/* Popup Report ID */}
      {isReportDetailOpen && selectedReportDetail && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[500px] shadow-xl">

            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-lg text-blue-700">
                {selectedReportDetail.id}
              </h2>
              <button onClick={() => setIsReportDetailOpen(false)}>
                <X />
              </button>
            </div>

            <div className="text-sm space-y-2">

              {/* ===== LAPORAN UMUM ===== */}
              {selectedReportDetail.type === "laporan" && (
                <>
                  <p><b>Tanggal:</b> {selectedReportDetail.date}</p>
                  <p><b>Pelapor:</b> {selectedReportDetail.reporter}</p>
                  <p><b>Kategori:</b> {selectedReportDetail.category}</p>
                  <p><b>Detail:</b> {selectedReportDetail.details}</p>
                  <p><b>Catatan:</b> {selectedReportDetail.notes || "-"}</p>
                </>
              )}

              {/* ===== BREAKDOWN ===== */}
              {selectedReportDetail.type === "breakdown" && (
                <>
                  <p><b>Tanggal:</b> {selectedReportDetail.date}</p>
                  <p><b>Pelapor:</b> {selectedReportDetail.reporter}</p>
                  <p><b>Downtime:</b> {selectedReportDetail.downtime}</p>
                  <p><b>Detail:</b> {selectedReportDetail.details}</p>
                </>
              )}

              {/* ===== MEKANIK ===== */}
              {selectedReportDetail.type === "mekanik" && (
                <>
                  <p><b>Tanggal:</b> {selectedReportDetail.date}</p>
                  <p><b>Pelapor:</b> {selectedReportDetail.reporter}</p>
                  <p><b>Detail:</b> {selectedReportDetail.details}</p>
                  <p><b>Notes:</b> {selectedReportDetail.notes || "-"}</p>
                </>
              )}

              {/* ===== PM ===== */}
              {selectedReportDetail.type === "pm" && (
                <>
                  <p><b>PM Type:</b> {selectedReportDetail.id}</p>
                  <p><b>Current HM:</b> {selectedReportDetail.currentHM}</p>
                  <p><b>HM Target:</b> {selectedReportDetail.hmTarget}</p>
                  <p><b>AVG HM / Day:</b> {selectedReportDetail.avgHM}</p>
                  <p><b>Prediction:</b> {selectedReportDetail.datePrediction}</p>
                </>
              )}

            </div>

          </div>
        </div>
      )}

      {/* Documentation Modals */}
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

      {/* --- SPARE PART MODAL -- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`bg-white rounded-lg shadow-2xl w-full overflow-hidden border border-slate-200
            ${showQtySelection ? 'max-w-xl' : 'max-w-[75rem]'}`}>
            {!showQtySelection ? (
                <><div className="p-2 flex justify-between items-center bg-white">
                    <h2 className="text-blue-700 font-bold uppercase tracking-tight flex items-center gap-2"><Search size={18} /> Item Search</h2>
                    <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-red-500 transition-colors"><X size={20} /></button>
                  </div>
                  <div className="p-2 bg-white flex flex-col gap-2">
                    {/* Search Item */}
                    <input type="text" placeholder="Cari kode / nama barang..." value={partSearch}
                      onChange={(e) => setPartSearch(e.target.value)}
                      className="w-full border border-slate-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"/>

                    {/* Search Category */}
                    <input type="text" placeholder="Cari kode / nama kategori..." value={categorySearch}
                      onChange={(e) => setCategorySearch(e.target.value)}
                      className="w-full border border-slate-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-green-500 outline-none"/>
                  </div>
                  <div className="bg-[#005a32] text-white p-3 font-bold text-xs uppercase 
                  grid grid-cols-[1.5fr_2.5fr_2.5fr_1.5fr_1.5fr_1fr_0.7fr_0.8fr_0.8fr] gap-2">
                    <span>Part Code</span>
                    <span>Part Name</span>
                    <span>Part Field Name</span>
                    <span>Category Code</span>
                    <span>Part Category</span>
                    <span>Unit</span>
                    <span>Status</span>
                    <span className="text-center">Stock</span>
                    <span className="text-center">Action</span>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {filteredParts.map((item, idx) => (
                    <div key={idx} className="p-3 grid grid-cols-[1.5fr_2.5fr_2.5fr_1.5fr_1.5fr_1fr_0.7fr_0.8fr_0.8fr] gap-2 items-center border-b border-slate-50 hover:bg-slate-50 transition-colors">
                      <span className="text-sm font-medium text-slate-700">{item.code}</span>
                      <span className="text-sm font-medium text-slate-700">{item.name}</span>
                      <span className="text-sm font-medium text-slate-700">{item.field_name}</span>
                      <span className="text-sm font-medium text-slate-700">{item.category_code}</span>
                      <span className="text-sm font-medium text-slate-700">{item.category}</span>
                      <span className="text-sm font-medium text-slate-700">{item.satuan}</span>
                      <span className="text-sm font-medium text-slate-700">{item.status}</span>
                      <span className={`text-xs font-black text-center ${item.stock < 10 ? 'text-red-600' : 'text-slate-500'}`}>{item.stock}</span>
                      <div className="text-right">
                        <button onClick={() => initiateQtySelection(item)} className="bg-[#005a32] hover:bg-green-800 text-white px-4 py-1.5 rounded text-[10px] font-bold uppercase tracking-tighter shadow-sm">SELECT</button>
                      </div>
                    </div>))}
                    {filteredParts.length === 0 && (
                      <div className="p-4 text-center text-slate-400 text-sm italic">
                        No parts found
                      </div>
                    )}
                  </div></>
              ) : (
                <div className="p-8 text-center space-y-6">
                  <div className="mx-auto w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center shadow-inner">
                    <Package size={32} />
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">Set Quantity</h3>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">{tempSelectedPart.name}</p>
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
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button onClick={() => setShowQtySelection(false)} className="flex-1 px-6 py-3 rounded-xl text-xs font-black bg-slate-100 text-slate-500 uppercase hover:bg-slate-200 flex items-center justify-center gap-2"><ChevronLeft size={16}/> Back</button>
                    <button onClick={finalizePartAddition} className="flex-1 px-6 py-3 rounded-xl text-xs font-black bg-blue-600 text-white uppercase hover:bg-blue-700 shadow-lg shadow-blue-200 flex items-center justify-center gap-2"><Save size={16}/> Add Part</button>
                  </div>
                </div>
              )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DailyLogActivity;