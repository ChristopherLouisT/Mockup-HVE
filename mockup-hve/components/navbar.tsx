"use client";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const router = useRouter();

  return (
    // <header className="bg-white border-b border-slate-200 px-6 py-3 flex justify-between items-center sticky top-0 z-50">
    //   <div className="flex items-center gap-8">
    //     <h1 className="text-xl font-bold text-blue-900 tracking-tight">HEAVY EQUIPMENT</h1>
    //     <nav className="flex gap-4">
    //       <Link 
    //         href="/spk" 
    //         className={`text-sm font-semibold pb-1 transition-colors ${
    //           isActive('/spk') 
    //             ? 'text-blue-600 border-b-2 border-blue-600' 
    //             : 'text-slate-500 hover:text-slate-800 border-b-2 border-transparent'
    //         }`}>
    //         CREATE SPK
    //       </Link>
    //       <Link 
    //         href="/" 
    //         className={`text-sm font-semibold pb-1 transition-colors ${
    //           isActive('/') 
    //             ? 'text-blue-600 border-b-2 border-blue-600' 
    //             : 'text-slate-500 hover:text-slate-800 border-b-2 border-transparent'
    //         }`}>
    //         TRANSACTION
    //       </Link>
    //       <Link 
    //         href="/monitoring" 
    //         className={`text-sm font-semibold pb-1 transition-colors ${
    //           isActive('/monitoring') 
    //             ? 'text-blue-600 border-b-2 border-blue-600' 
    //             : 'text-slate-500 hover:text-slate-800 border-b-2 border-transparent'
    //         }`}>
    //         MONITORING & ANALYSIS (SRT)
    //       </Link>
    //       <Link 
    //         href="/oil" 
    //         className={`text-sm font-semibold pb-1 transition-colors ${
    //           isActive('/oil') 
    //             ? 'text-blue-600 border-b-2 border-blue-600' 
    //             : 'text-slate-500 hover:text-slate-800 border-b-2 border-transparent'
    //         }`}>
    //         OIL MONITORING
    //       </Link>
    //       <Link 
    //         href="/fuel" 
    //         className={`text-sm font-semibold pb-1 transition-colors ${
    //           isActive('/fuel') 
    //             ? 'text-blue-600 border-b-2 border-blue-600' 
    //             : 'text-slate-500 hover:text-slate-800 border-b-2 border-transparent'
    //         }`}>
    //         FUEL MONITORING
    //       </Link>
    //     </nav>
    //   </div>
    //   <div className="flex items-center gap-3 text-sm">
    //     <span className="text-slate-500 font-medium">Login As <span className="text-slate-900">user_id</span></span>
    //     <button className="text-red-500 hover:underline">Logout</button>
    //   </div>
    // </header>

    <div className="flex gap-2 mb-5">
      <select className="bg-[#0b6b3a] text-white px-3 py-1 text-xs font-bold"
        onChange={(e) => {
        const val = e.target.value;

        if (val === "spk") router.push("/spk");
        if (val === "dailylog") router.push("/");
        if (val === "fuel") router.push("/fuel");
        if (val === "oil") router.push("/oil");
        if (val === "monitoring") router.push("/monitoring");
      }}>
        <option>TRANSAKSI</option>
        <option value="spk">Create SPK</option>
        <option value="dailylog">Daily Log</option>
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
  );
};

export default Navbar;