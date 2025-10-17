"use client";

import { useEffect, useState } from "react";
import  Link  from "next/link";

function Spin({open, setOpen, className}){
  return(
    <button onClick={()=> setOpen(!open)}
    className={`md:hidden w-8.5 h-8 flex flex-col justify-center items-center gap-1.5 
          ml-9 mt-3 transform transition-transform duration-900 
  ${open ? "border-2  border-cyan-500":""}  ${className}`}>
        <span
        className={`block w-5 h-0.5 bg-cyan-500 transition-transform duration-300 ${
          open ? "rotate-45 translate-y-2" : ""
        }`}
      />
      <span
        className={`block w-5 h-0.5 bg-cyan-500 transition-opacity duration-300 ${
          open ? "opacity-0" : ""
        }`}
      />
      <span
        className={`block w-5 h-0.5  bg-cyan-500 transition-transform duration-300 ${
          open ? "-rotate-45 -translate-y-2" : ""
        }`}
      />
    </button>

  )
}
export default function Navbar({first, second} ) {
  const [open, setOpen] = useState(false);
const [textColor, setTextColor] =useState(false);

    const navMenu = [
    { id: 1, href: "/home", text: "Home" },
    { id: 2, href: "/create", text: "Create Blog" },
    { id: 3, href: "/about",  text: "About" },
    { id: 4, href: "/logout", text: "Logout" },
  ];

useEffect(()=>{
  if(open){
    setTextColor("text-cyan-500");
  const timer =setTimeout(() => 
    setTextColor("text-white")
  , 1000);
  return () => clearTimeout(timer);
}
}, [open]);
        
          if(first ==="icon"){
        return(
           <>
  <Spin setOpen={setOpen}  open={open}
   className={`z-50 relative transition-all duration-1000`} />
    <div
        className={`fixed inset-0 bg-gradient-to-b from-black/70 to-black/70 
          z-40 transition-opacity duration-300 md:hidden ${
            open ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        onClick={() => setOpen(false)}
      >
        <div
          className={`fixed left-0 top-0 h-full w-64 bg-gray-950 shadow-xl transform 
            transition-transform duration-300 ${
              open ? "-translate-x-0" : "-translate-x-full"
            }`}
          onClick={(e) => e.stopPropagation()}
        >
        
            <nav className="space-y-5">
              <ul
          className="slidein mt-20 flex flex-col px-7 space-y-4 justify-center">
              {navMenu.map((item) => 
                <li
                  key={item.id}
                   className=" bg-black/70 rounded-md p-2 
                  transition-all durbation-300 hover:bg-black/50 hover:pl-5  ">
                <Link 
                href={item.href}
                  onClick={()=> setOpen((false))}
                 className={` text-2xl transform-all duration-1000 hover:text-cyan-500 ${textColor} block` }>
                  {item.text}
                  </Link>
                  </li>
              )}
              </ul>
            </nav>

          </div>
        </div>
        </>)}

         if(second==="plain"){
        return(<>
    <nav>
      <ul className="flex space-x-4 px-5">
      {navMenu.map((item)=> 
      <li key={item.id} className="text-lg tracking-tight text-white">
        <Link href={item.href}>{item.text}
        </Link>
        </li>)}
    </ul>
    </nav>
      </>)}}
