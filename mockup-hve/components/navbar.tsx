"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Navbar = () => {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <header className="bg-white border-b border-slate-200 px-6 py-3 flex justify-between items-center sticky top-0 z-50">
      <div className="flex items-center gap-8">
        <h1 className="text-xl font-bold text-blue-900 tracking-tight">HEAVY EQUIPMENT</h1>
        <nav className="flex gap-4">
          <Link 
            href="/" 
            className={`text-sm font-semibold pb-1 transition-colors ${
              isActive('/') 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-slate-500 hover:text-slate-800 border-b-2 border-transparent'
            }`}>
            TRANSAKSI
          </Link>
          <Link 
            href="#" 
            className={`text-sm font-semibold pb-1 transition-colors ${
              isActive('#') 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-slate-500 hover:text-slate-800 border-b-2 border-transparent'
            }`}>
            REPORT
          </Link>
          <Link 
            href="/monitoring" 
            className={`text-sm font-semibold pb-1 transition-colors ${
              isActive('/monitoring') 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-slate-500 hover:text-slate-800 border-b-2 border-transparent'
            }`}>
            MONITORING & ANALYSIS (SRT)
          </Link>
        </nav>
      </div>
      <div className="flex items-center gap-3 text-sm">
        <span className="text-slate-500 font-medium">Login As <span className="text-slate-900">user_id</span></span>
        <button className="text-red-500 hover:underline">Logout</button>
      </div>
    </header>
  );
};

export default Navbar;