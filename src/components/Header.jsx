 "use client";
import React from "react";
import { usePathname } from "next/navigation";
import {Navbar} from "@/components";

export default function Header() {
  const pathname = usePathname();

  const headings = {
    "/home": "JOTFUL",
    "/create": "New Jot",
    "/edit": "Edit Jot",
    "/info": "Info",
  };

  const pageName = headings[pathname] || "Page";

  return (<>
<header className="sticky top-0 w-full bg-cyan-600 text-white py-3 xl:py-4 z-50">
     <div className="md:hidden absolute top-0 -left-4">
      <Navbar first="icon" />
     </div>
      <div className="hidden md:block absolute top-1 translate-y-1/2 right-0 ">
      <Navbar second="plain" />
     </div>
      <div className=" text-center md:text-left md:pl-5 ">
        <h1 className="text-xl md:text-2xl xl:3xl font-semibold tracking-wide">
          {pageName}
        </h1>
      </div>
    </header>
</>  );
}
