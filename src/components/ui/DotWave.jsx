"use client";

import { useEffect, useState } from "react";

export default function DotWave({ size = "md", color = "bg-cyan-600 dark:bg-cyan-400" }) {

const [active, setActive] =useState(0);

  const sizeClasses = {
    sm: "h-1.5 w-1.5",
    md: "h-2 w-2",
    lg: "h-3 w-3",
  };

 useEffect(()=> {
  const interval = setInterval(() =>{
    setActive((prev) => (prev + 1) % 3);
  }, 300);

  return () => clearInterval(interval);
 }, []);

  return (
    <div className="flex items-center gap-1" role="status" aria-label="loading">
     {[0,1, 2].map((i)=>{
      let opacity = "opacity-30";
      if(i === active) opacity= "opacity-100";
      else if (i === (active + 2) % 3) opacity="opacity-60";
     
     return (
      <div
        key={i}
        className={`${sizeClasses[size]} ${color} rounded-full transition-opacity duration-200 ${opacity}`}
      />
    );
      })}
        </div>
  );
}
  