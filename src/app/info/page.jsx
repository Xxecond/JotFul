 "use client";

import Image from "next/image";
import {useEffect} from "react";
import Header from "@/components/Header";
import {useRouter} from "next/navigation";

export default function Info() {
  const router = useRouter();

 useEffect(()=>{
   // removed protected-route redirect; Info is public now
 }, [])
  const features = [
    { title: "Daily Football News", desc: "Stay updated with the latest happenings in the football world." },
    { title: "Live Match Updates", desc: "Follow live scores, match highlights, and results." },
    { title: "Transfer Rumors & Confirmations", desc: "Get the latest on player transfers and deals." },
    { title: "Expert Analysis & Opinions", desc: "Read in-depth articles from football analysts." },
    { title: "Fan Community & Discussions", desc: "Join the conversation and share your views." },
  ];

  return (<>
  <div className="bg-white min-h-dvh">
    <Header />
    <section className="max-w-4xl mx-auto p-6 mt-10 bg-white shadow-md rounded-xl text-center">
          </section>
  </div>
    </>
  );
}
