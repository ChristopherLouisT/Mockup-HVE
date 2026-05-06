"use client";
import { useState } from "react";
import { FileText, Settings, Search } from "lucide-react";

const MutationSparepart = () => {

  // 🔹 Sparepart data
  const [spareparts, setSpareparts] = useState([
    { id: 1, code: "228C0-80012", name: "Cylinder Assy Lift", category: "Mesin Lain-Lain", category_code: "MSLL", port: "SBY", location: "Depo 4", 
        stock: 10, satuan: "PCS", eta: "2 Jam" },
    { id: 2, code: "HVE.GSKT.800619", name: "Gasket Kit 80-0619 BOSPOM PF6", category: "Heavy Equipment", category_code: "HVE", port: "JKT", location: "Depo Marunda",
        stock: 3, satuan: "SET", eta: "4 Hari" },
    { id: 3, code: "KWLS2.5SUPERSETE", name: "MAC Super Steel 🚫 2.5MM", category: "Kawat Las", category_code: "KWLS", port: "BPP", location: "Balikpapan",
        stock: 0, satuan: "KG", eta: "-" },
    { id: 4, code: "HOSE.HREL3X3", name: 'HOSE RADIATOR ELBOW 🚫 3" X 3"',  category_code: "HOSE", category: "SELANG / HOSE", port: "JKT", location: "Depo Merak",
        stock: 5, satuan: "MTR", eta: "5 Hari" },
    { id: 5, code: "NIS.260.AA21002", name: "159620-6821002 ACTUATOR ASSY GOVERNOR NISSAN EURO PK260", category_code: "NIS PK260", category: "MESIN NISSAN EURO PK260", port: "SBY", location: "Depo T.Langon",
        stock: 23, satuan: "MTR", eta: "1 Jam" },
  ]);

  // Port To Location Data
  const portLocationMap: Record<string, string[]> = {
    SBY: ["DEPO 4", "DEPO JAPFA", "DEPO T.LANGON", "TERMINAL TELUK LAMONG"],
    JKT: ["JAKARTA", "DEPO MARUNDA", "DEPO PRIOK", "DEPO MERAK"],
    BPP: ["BALIKPAPAN"],
    BMS: ["BANJARMASIN"],
    BLW: ["BELAWAN"]
  };

  const [selectedPort, setSelectedPort] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");

  const [requests, setRequests] = useState<any[]>([]);

  // 🔹 Modal state
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [qty, setQty] = useState(0);
  const [reason, setReason] = useState("");

  // 🔹 Toast
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  };

  // No Mutasi format: MTS-YYYYMMDD-RND
  const generateId = () => {
    const now = new Date();

    const datePart = now.toISOString().slice(0,10).replace(/-/g, ""); 
    // 20260506

    const randomPart = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0"); 
    // 042

    return `MTS-${datePart}-${randomPart}`;
  };

  // 🔹 Submit Request
  const submitRequest = () => {
    if (!selectedItem || qty <= 0 || qty > selectedItem.stock) {
      showToast("Qty tidak valid");
      return;
    }

    if (!reason) {
      showToast("Alasan / Keterangan pengajuan wajib diisi");
      return;
    }

    const newRequest = {
      id: generateId(),
      code: selectedItem.code,
      sparepart: selectedItem.name,
      category: selectedItem.category,
      category_code: selectedItem.category_code,
      from_port: "SBY",
      from_location: "Depo JAPFA",
      to_port: selectedItem.port,
      to_location: selectedItem.location,
      qty,
      reason,
      unit: selectedItem.satuan,
      status: "pending"
    };

    setRequests(prev => [...prev, newRequest]);
    setSelectedItem(null);
    setQty(0);
    setReason("");
    showToast("Request berhasil dibuat");
  };

  // 🔹 Approve / Reject + deduct stock
  const updateStatus = (id: number, status: string) => {
    setRequests(prev =>
      prev.map(r => {
        if (r.id === id) {
          if (status === "approved") {
            setSpareparts(sp =>
              sp.map(s =>
                s.name === r.sparepart && s.location === r.from_location && s.port === r.from_port
                  ? { ...s, stock: s.stock - r.qty }
                  : s
              )
            );
          }
          return { ...r, status };
        }
        return r;
      })
    );

    showToast(`Request ${status}`);
  };

  const statusStyle: any = {
    pending: "bg-yellow-100 text-yellow-700",
    approved: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700"
  };

  const filteredSpareparts = spareparts.filter(item => {
    const matchPort = selectedPort
      ? item.port?.toLowerCase() === selectedPort.toLowerCase()
      : true;

    const matchLocation = selectedLocation
      ? item.location?.toLowerCase() === selectedLocation.toLowerCase()
      : true;

    return matchPort && matchLocation;
  });

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <main className="max-w-7xl mx-auto p-5">

        {/* HEADER */}
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <FileText className="text-green-600"/> Request Mutasi Sparepart
        </h2>

        {/* ================= REQUEST ================= */}
        <div className="bg-white rounded-xl border p-6 mb-8">

          <h3 className="text-sm font-bold text-slate-400 mb-4 flex gap-2">
            <Settings size={16}/> Pencarian Sparepart
          </h3>

          <div className="flex gap-2 mb-4 items-center">
            <Search size={16}/>
            <input className="border p-2 text-sm w-full rounded" placeholder="Cari Sparepart..." />

            {/* PORT */}
            <select value={selectedPort}
              onChange={(e) => {
                setSelectedPort(e.target.value);
                setSelectedLocation("");
              }} className="border p-2 text-xs rounded bg-white">
              <option value="">All Port</option>
              {Object.keys(portLocationMap).map(port => (
                <option key={port} value={port}>{port}</option>
              ))}
            </select>

            {/* LOCATION: Only works when a port is selected */}
            <select value={selectedLocation} onChange={(e) => setSelectedLocation(e.target.value)}
              disabled={!selectedPort} className="border p-2 text-xs rounded bg-white disabled:bg-slate-100">
              <option value="">All Location</option>
              {selectedPort &&
                portLocationMap[selectedPort].map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))
              }
            </select>
          </div>

          <table className="w-full text-xs border">
            <thead className="bg-slate-100">
              <tr>
                <th className="p-2">Part Code</th>
                <th className="p-2">Part Name</th>
                <th className="p-2">Part Category</th>
                <th className="p-2">Category Code</th>
                <th className="p-2">Port</th>
                <th className="p-2">Location</th>
                <th className="p-2">Stock</th>
                <th className="p-2">Unit</th>
                <th className="p-2">ETA</th>
                <th className="p-2">Action</th>
              </tr>
            </thead>

            <tbody className="text-center">
              {filteredSpareparts.map(item => (
                <tr key={item.id} className="border-t">
                  <td className="p-2">{item.code}</td>
                  <td className="p-2">
                    <div className="line-clamp-3 whitespace-normal break-words">
                      {item.name}
                    </div>
                  </td>
                  <td className="p-2">{item.category}</td>
                  <td className="p-2">{item.category_code}</td>
                  <td className="p-2">{item.port}</td>
                  <td className="p-2">{item.location}</td>
                  <td className={`p-2 font-bold ${item.stock === 0 ? "text-red-500" : "text-green-600"}`}>
                    {item.stock}
                  </td>
                  <td className="p-2">{item.satuan}</td>
                  <td className="p-2">
                    <span className="bg-green-100 text-green-600 px-0.5 py-1 rounded text-[10px]">
                      ⏱ {item.eta}
                    </span>
                  </td>
                  <td className="p-2">
                    <button onClick={() => setSelectedItem(item)} disabled={item.stock === 0}
                      className="bg-green-500 text-white px-2 py-1 rounded text-[10px] disabled:opacity-50">
                      Request
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* REQUEST LIST FOR REQUESTER TO SEE THE ALL THE REQUEST THEY HAVE DONE  */}
        <div className="bg-white rounded-xl border mb-10">
          <div className="p-4 font-bold text-sm text-slate-500 border-b">
            Riwayat Pengajuan Mutasi
          </div>
          <table className="w-full text-xs">
            <thead className="bg-slate-100">
              <tr>
                <th rowSpan={2} className="p-2">No Mutasi</th>
                <th rowSpan={2} className="p-2">Part Code</th>
                <th rowSpan={2} className="p-2">Part Name</th>
                <th rowSpan={2} className="p-2">Part Category</th>

                <th colSpan={2} className="p-2">Asal Mutasi</th>
                <th colSpan={2} className="p-2">Tujuan Mutasi</th>

                <th rowSpan={2} className="p-2">Reason</th>
                <th rowSpan={2} className="p-2">Qty</th>
                <th rowSpan={2} className="p-2">Unit</th>
                <th rowSpan={2} className="p-2">Status</th>
              </tr>

              <tr>
                <th className="p-2">Port</th>
                <th className="p-2">Location</th>
                <th className="p-2">Port</th>
                <th className="p-2">Location</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {requests.map(item => (
                <tr key={item.id} className="border-t">
                  <td className="p-2">{item.id}</td>
                  <td className="p-2">{item.code}</td>
                  <td className="p-2">{item.sparepart}</td>
                  <td className="p-2">{item.category}</td>
                  <td className="p-2">{item.from_port}</td>
                  <td className="p-2">{item.from_location}</td>
                  <td className="p-2">{item.to_port}</td>
                  <td className="p-2">{item.to_location}</td>
                  <td className="p-2">
                    <div className="line-clamp-3 break-words">
                      {item.reason}
                    </div>
                  </td>
                  <td className="p-2">{item.qty}</td>
                  <td className="p-2">{item.unit}</td>
                  <td className="p-2">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold ${statusStyle[item.status]}`}>
                      {item.status.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <FileText className="text-green-600"/> Approval Mutasi
        </h2>

        {/* ================= REQUEST LIST FOR APPROVERS ================= */}
        <div className="bg-white rounded-xl border">
          <div className="p-4 font-bold text-sm text-slate-500 border-b">
            Approval Mutasi
          </div>
          <table className="w-full text-xs">
            <thead className="bg-slate-100">
              <tr>
                <th rowSpan={2} className="p-2">No Mutasi</th>
                <th rowSpan={2} className="p-2">Part Name</th>
                <th rowSpan={2} className="p-2">Part Category</th>

                <th colSpan={2} className="p-2">Asal Mutasi</th>
                <th colSpan={2} className="p-2">Tujuan Mutasi</th>

                <th rowSpan={2} className="p-2">Reason</th>
                <th rowSpan={2} className="p-2">Qty</th>
                <th rowSpan={2} className="p-2">Unit</th>
                <th rowSpan={2} className="p-2">Process</th>
                <th rowSpan={2} className="p-2">Action</th>
              </tr>

              <tr>
                <th className="p-2">Port</th>
                <th className="p-2">Location</th>
                <th className="p-2">Port</th>
                <th className="p-2">Location</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {requests.map(item => (
                <tr key={item.id} className="border-t">
                  <td className="p-2">{item.id}</td>
                  <td className="p-2">{item.sparepart}</td>
                  <td className="p-2">{item.category}</td>
                  <td className="p-2">{item.from_port}</td>
                  <td className="p-2">{item.from_location}</td>
                  <td className="p-2">{item.to_port}</td>
                  <td className="p-2">{item.to_location}</td>
                  <td className="p-2">
                    <div className="line-clamp-3 whitespace-normal break-words">
                      {item.reason}
                    </div>
                  </td>
                  <td className="p-2 font-bold">{item.qty}</td>
                  <td className="p-2">{item.unit}</td>
                  <td className="p-2">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold ${statusStyle[item.status]}`}>
                      {item.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-2 text-center">
                    {item.status === "pending" && (
                      <div className="flex gap-2 justify-center">
                        <button onClick={() => updateStatus(item.id, "approved")}
                          className="bg-green-500 text-white px-2 py-1 text-[10px] rounded">
                          Approve
                        </button>
                        <button onClick={() => updateStatus(item.id, "rejected")}
                          className="bg-red-500 text-white px-2 py-1 text-[10px] rounded">
                          Reject
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </main>

      {/* ================= MODAL / POP UP ================= */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

          <div className="bg-white rounded-xl p-6 w-80">
            <h3 className="font-bold mb-3">Request Sparepart</h3>
            <p className="text-sm mb-2">{selectedItem.name}</p>
            <p className="text-xs text-slate-500 mb-4">
              Stock: {selectedItem.stock}
            </p>

            <input type="number" className="border w-full p-2 rounded text-sm mb-4"
              placeholder="Qty" onChange={(e) => setQty(Number(e.target.value))}/>

            <textarea className="border w-full p-2 rounded text-sm mb-4 overflow-hidden"
              rows={1} placeholder="Alasan / Keterangan Pengajuan"
              onInput={(e: any) => {
                e.target.style.height = "auto";
                e.target.style.height = e.target.scrollHeight + "px";
              }} 
              onChange={(e) => setReason(e.target.value)}/>

            <div className="flex justify-end gap-2">
              <button onClick={() => setSelectedItem(null)}
                className="px-3 py-1 text-sm">
                Cancel
              </button>
              <button onClick={submitRequest}
                className="bg-blue-500 text-white px-3 py-1 rounded text-sm">
                Submit
              </button>
            </div>
          </div>

        </div>
      )}

      {/* ================= TOAST / NOTIFICATION ================= */}
      {toast && (
        <div className="fixed bottom-5 left-5 bg-black text-white px-4 py-2 rounded text-sm shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
};

export default MutationSparepart;