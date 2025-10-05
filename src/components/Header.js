 "use client";
import React from "react";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

export default function Header() {
  const pathname = usePathname();

  const headings = {
    "/home": "FOOTBALL INSIDER",
    "/create": "New Blog",
    "/edit": "Edit Blog",
    "/about": "About",
  };

  const pageName = headings[pathname] || "Page";

  return (
    <header className="bg-gray-900 text-white">
      <Navbar />
      <div className="pt-20 text-center pb-6">
        <h1 className="text-3xl md:text-4xl font-bold tracking-wide">
          {pageName}
        </h1>
      </div>
    </header>
  );
}
