"use client";
import MonitoringSRT from '@/components/MonitoringSRT';
import MonitoringPerforma from '@/components/MonitoringPerforma';
import MonitoringKomparasi from '@/components/MonitoringKomparasi';
import { useRouter, useSearchParams } from "next/navigation";

const MonitoringPage = () => { 
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab") || "srt";
  const tabs = [
    { key: "srt", label: "1. Monitoring SRT (Log Activity)" },
    { key: "performa", label: "2. Monitoring Performa (MTTR & Availability)" },
    { key: "komparasi", label: "3. Komparasi Unit" }
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      <div className="bg-[#005a32] shadow-md sticky top-0 z-30 font-bold">
        <div className="max-w-[1600px] mx-auto flex px-6 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => router.push(`/monitoring?tab=${tab.key}`)}
              className={`py-4 px-6 text-[10px] md:text-xs uppercase tracking-wider whitespace-nowrap transition-all border-b-4 ${
                currentTab === tab.key
                  ? "border-white bg-white/10 text-white"
                  : "border-transparent text-white/70 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-2 p-5">
      <select className="bg-[#0b6b3a] text-white px-3 py-1 text-xs font-bold"
        onChange={(e) => {
        const val = e.target.value;

        if (val === "spk") router.push("/spk");
        if (val === "transaction") router.push("/");
        if (val === "fuel") router.push("/fuel");
        if (val === "oil") router.push("/oil");
        if (val === "monitoring") router.push("/monitoring");
      }}>
        <option value="transaction">TRANSAKSI</option>
        <option value="spk">Create SPK</option>
      </select>

      <select className="bg-[#0b6b3a] text-white px-3 py-1 text-xs font-bold">
        <option>REPORT</option>
      </select>

      <select className="bg-[#0b6b3a] text-white px-3 py-1 text-xs font-bold"
        onChange={(e) => {
        const val = e.target.value;

        if (val === "srt") router.push("/monitoring?tab=srt");
        if (val === "performa") router.push("/monitoring?tab=performa");
        if (val === "komparasi") router.push("/monitoring?tab=komparasi");
        if (val === "oil") router.push("/oil");
        if (val === "fuel") router.push("/fuel");
      }}>
        <option value="">MONITORING</option> 
        {/* Monitoring is default */}
        <option value="srt">Monitoring SRT</option>
        <option value="performa">Monitoring Performa</option>
        <option value="komparasi">Komparasi Unit</option>
        <option value="oil">Oil Monitoring</option>
        <option value="fuel">Fuel Monitoring</option>
      </select>
    </div>

      <main className="max-w-[1600px] mx-auto p-4 md:p-6">
        {currentTab === "srt" && <MonitoringSRT />}
        {currentTab === "performa" && <MonitoringPerforma />}
        {currentTab === "komparasi" && <MonitoringKomparasi />}
      </main>
    </div>
  );
};

export default MonitoringPage;