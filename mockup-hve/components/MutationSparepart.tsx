"use client";
import { useState } from "react";
import { FileText, Settings, Search } from "lucide-react";

const MutationSparepart = () => {

  // 🔹 Sparepart data
  const [spareparts, setSpareparts] = useState([
    { id: 1, code: "228C0-80012", name: "Cylinder Assy Lift", category: "Mesin Lain-Lain", category_code: "MSLL", location: "Surabaya - Depo 4", 
        stock: 10, satuan: "PCS", eta: "2 Jam" },
    { id: 2, code: "HVE.GSKT.800619", name: "Gasket Kit 80-0619 BOSPOM PF6", category: "Heavy Equipment", category_code: "HVE", location: "Jakarta - Depo C",
        stock: 3, satuan: "SET", eta: "4 Hari" },
    { id: 3, code: "KWLS2.5SUPERSETE", name: "MAC Super Steel 🚫 2.5MM", category: "Kawat Las", category_code: "KWLS", location: "Ambon - Depo A",
        stock: 0, satuan: "KG", eta: "-" },
  ]);

  const [requests, setRequests] = useState<any[]>([]);

  // 🔹 Modal state
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [qty, setQty] = useState(0);

  // 🔹 Toast
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  };

  // 🔹 Submit Request
  const submitRequest = () => {
    if (!selectedItem || qty <= 0 || qty > selectedItem.stock) {
      showToast("Qty tidak valid");
      return;
    }

    const newRequest = {
      id: Date.now(),
      code: selectedItem.code,
      sparepart: selectedItem.name,
      category: selectedItem.category,
      category_code: selectedItem.category_code,
      from: "Surabaya - Depo Tambak Langon",
      to: selectedItem.location,
      qty,
      unit: selectedItem.satuan,
      status: "pending"
    };

    setRequests(prev => [...prev, newRequest]);
    setSelectedItem(null);
    setQty(0);

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
                s.name === r.sparepart && s.location === r.from
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

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <main className="max-w-7xl mx-auto p-5">

        {/* HEADER */}
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <FileText className="text-blue-600"/> Request Mutasi Sparepart
        </h2>

        {/* ================= REQUEST ================= */}
        <div className="bg-white rounded-xl border p-6 mb-8">

          <h3 className="text-sm font-bold text-slate-400 mb-4 flex gap-2">
            <Settings size={16}/> Request Sparepart
          </h3>

          <div className="flex gap-2 mb-4">
            <Search size={16}/>
            <input className="border p-2 text-sm w-full rounded" placeholder="Search..." />
          </div>

          <table className="w-full text-xs border">
            <thead className="bg-slate-100">
              <tr>
                <th className="p-2">Part Code</th>
                <th className="p-2">Part Name</th>
                <th className="p-2">Part Category</th>
                <th className="p-2">Category Code</th>
                <th className="p-2">Location</th>
                <th className="p-2">Stock</th>
                <th className="p-2">Unit</th>
                <th className="p-2">ETA</th>
                <th className="p-2">Action</th>
              </tr>
            </thead>

            <tbody className="text-center">
              {spareparts.map(item => (
                <tr key={item.id} className="border-t">
                  <td className="p-2">{item.code}</td>
                  <td className="p-2">{item.name}</td>
                  <td className="p-2">{item.category}</td>
                  <td className="p-2">{item.category_code}</td>
                  <td className="p-2">{item.location}</td>
                  <td className={`p-2 font-bold ${item.stock === 0 ? "text-red-500" : "text-green-600"}`}>
                    {item.stock}
                  </td>
                  <td className="p-2">{item.satuan}</td>
                  <td className="p-2">
                    <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-[10px]">
                      ⏱ {item.eta}
                    </span>
                  </td>
                  <td className="p-2">
                    <button onClick={() => setSelectedItem(item)} disabled={item.stock === 0}
                      className="bg-blue-500 text-white px-2 py-1 rounded text-[10px] disabled:opacity-50">
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
            List Pengajuan Keluar Mutasi Sparepart
          </div>
          <table className="w-full text-xs">
            <thead className="bg-slate-100">
              <tr>
                <th className="p-2">No Mutasi</th>
                <th className="p-2">Part Code</th>
                <th className="p-2">Part Name</th>
                <th className="p-2">Part Category</th>
                <th className="p-2">Category Code</th>
                <th className="p-2">To</th>
                <th className="p-2">Qty</th>
                <th className="p-2">Unit</th>
                <th className="p-2">Status</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {requests.map(item => (
                <tr key={item.id} className="border-t">
                  <td className="p-2">{item.id}</td>
                  <td className="p-2">{item.code}</td>
                  <td className="p-2">{item.sparepart}</td>
                  <td className="p-2">{item.category}</td>
                  <td className="p-2">{item.category_code}</td>
                  <td className="p-2">{item.to}</td>
                  <td className="p-2 font-bold">{item.qty}</td>
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
          <FileText className="text-blue-600"/> List Request Mutasi Sparepart
        </h2>

        {/* ================= REQUEST LIST FOR APPROVERS ================= */}
        <div className="bg-white rounded-xl border">
          <div className="p-4 font-bold text-sm text-slate-500 border-b">
            List Pengajuan Masuk Mutasi Sparepart
          </div>
          <table className="w-full text-xs">
            <thead className="bg-slate-100">
              <tr>
                <th className="p-2">No Mutasi</th>
                <th className="p-2">Part Name</th>
                <th className="p-2">Part Category</th>
                <th className="p-2">From</th>
                <th className="p-2">Qty</th>
                <th className="p-2">Unit</th>
                <th className="p-2">Process</th>
                <th className="p-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {requests.map(item => (
                <tr key={item.id} className="border-t">
                  <td className="p-2">{item.id}</td>
                  <td className="p-2">{item.sparepart}</td>
                  <td className="p-2">{item.category}</td>
                  <td className="p-2">{item.from}</td>
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

      {/* ================= MODAL ================= */}
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

      {/* ================= TOAST ================= */}
      {toast && (
        <div className="fixed bottom-5 left-5 bg-black text-white px-4 py-2 rounded text-sm shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
};

export default MutationSparepart;