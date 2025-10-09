 "use client";
import React from "react";
import { usePathname } from "next/navigation";
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
    <header className="bg-cyan-500 py-3 text-white">
      <div className=" text-center ">
        <h1 className="text-xl md:text-3xl font-bold tracking-wide">
          {pageName}
        </h1>
      </div>
    </header>
  );
}
