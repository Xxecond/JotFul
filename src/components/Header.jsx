 "use client";
import React from "react";
import { usePathname } from "next/navigation";
import {Navbar} from "@/components";

export default function Header() {
  const pathname = usePathname();
  console.log('Current pathname:', pathname);

  const headings = {
    "/home": "JOTFUL",
    "/create": "New Jot",
    "/edit": "Edit Jot",
    "/settings": "Settings",
  };

  const getPageName = (path) => {
    if (headings[path]) return headings[path];
    if (path.startsWith('/edit') || path.includes('/edit/')) return 'Edit Jot';
    return 'Page';
  };

  const pageName = getPageName(pathname);

  return (<>
<header className="sticky top-0 w-full bg-cyan-600 dark:bg-cyan-950 text-white dark:text-cyan-50 py-3 xl:py-4 z-50">
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
