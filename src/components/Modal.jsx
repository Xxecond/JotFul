"use client"

export default function Modal({ message, onCancel, onConfirm,onOpen}){
return(
  
<section >

  {open &&(
    <>
    <div className="fixed bg-black/60 justify-center flex items-center
 inset-0  z-30 " onClick={onCancel}>
  </div>
<div className= "fixed top-1/2 rounded-xl -translate-y-1/2 left-1/2 w-3/5 max-w-sm -translate-x-1/2  bg-cyan-700 z-10 space-y-4  z-50">
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