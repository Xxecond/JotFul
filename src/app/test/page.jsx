"use client"

import { SkeletonLoader } from "@/components/ui"

export default function Test (){
    return(
        <>
        <div className="flex flex-col justify-center items-center bg-red-600 min-h-dvh">
            <SkeletonLoader   size="lg" height="h-9"/>               
            <p className="">hello</p>
            </div></>
    )
}