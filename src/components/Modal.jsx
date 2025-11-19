"use client"

import Button from "@/components";


export default function Modal({ message, onCancel, onConfirm,onOpen}){
return(
  
<section >

  {open &&(
    <>
    <div className="fixed bg-black/60 justify-center flex items-center
 inset-0  z-3"  onClick={onOpen} >
  </div>
<div className= "fixed top-1/2 rounded-xl -translate-y-1/2 left-1/2 w-[36%] max-w-md  -translate-x-1/2  bg-cyan-700 z-10 space-y-4 ">
 <p className="text-white p-4">{message}</p>
 <div className="relative  flex justify-around">
  <button className="text-white p-2 w-1/2 hover:bg-black/20 border-t-2 border-white"  onClick={onConfirm} >
    yes
</button>
  <button  className="text-white p-2 w-1/2 hover:bg-black/20 border-l-2 border-t-2 border-white" onClick={onCancel} >
    no
</button>
</div>
</div>
</>)}
</section>
)
}