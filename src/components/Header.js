 "use client";
import React from "react";
import { usePathname } from "next/navigation";
import {Navbar} from "@/components";;

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
<header className="sticky bg-cyan-600 text-white py-5">
     <div className="md:hidden absolute top-0 -left-4 z-55">
      <Navbar first="icon" />
     </div>
      <div className="hidden md:block absolute top-5 right-0 z-55">
      <Navbar second="plain" />
     </div>
      <div className=" text-center md:text-left md:pl-5 ">
        <h1 className="text-xl md:text-3xl font-bold tracking-wide">
          {pageName}
        </h1>
      </div>
    </header>
</>  );
}
