"use client";

import { usePathname } from "next/navigation";
import Navbar from "./navbar";

export default function NavbarWrapper() {
  const pathname = usePathname();
  const hideNavbar = pathname.startsWith("/monitoring");

  if (hideNavbar) return null;

  return (
    <div className="mx-auto ml-5">
      <Navbar />
    </div>
  );
}