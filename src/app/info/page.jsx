 "use client";

import Image from "next/image";
import {useEffect} from "react";
import Header from "@/components/Header";
import {useAuth} from "@/hooks";
import {useRouter} from "next/navigation";

export default function Info() {
  const {user, loading:authLoading} =useAuth();
  const router = useRouter();

 useEffect (()=>{
   if (authLoading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if(!user) router.push("/auth/login")

}, [user, router, authLoading])
  const features = [
    { title: "Daily Football News", desc: "Stay updated with the latest happenings in the football world." },
    { title: "Live Match Updates", desc: "Follow live scores, match highlights, and results." },
    { title: "Transfer Rumors & Confirmations", desc: "Get the latest on player transfers and deals." },
    { title: "Expert Analysis & Opinions", desc: "Read in-depth articles from football analysts." },
    { title: "Fan Community & Discussions", desc: "Join the conversation and share your views." },
  ];

  return (<>
  <div className="bg-white">
    <Header />
    <section className="max-w-4xl mx-auto p-6 mt-10 bg-white shadow-md rounded-xl text-center">
         <div className="space-y-3 mb-6 text-left">
        {features.map(({ title, desc }, i) => (
          <p key={i}>✅ <strong>{title}</strong> – {desc}</p>
        ))}
      </div>

      <div className="flex flex-col items-center">
        <Image
          src="/assets/PIC.jpg"
          alt="Profile picture"
          width={160}
          height={160}
          className="rounded-full object-cover mb-4 shadow-md"
        />
        <h6 className="text-gray-700 leading-relaxed text-lg">
          Created by <span className="font-semibold">Manerss</span>,<br />
          a passionate football enthusiast<br />
          dedicated to bringing fans closer<br />
          to the game.
        </h6>
      </div>

      <p className="mt-6 text-lg font-medium">
        <mark className="bg-yellow-200 px-2 rounded">Never miss an update!!</mark>
      </p>
      <p className="text-gray-700 mt-2">
        Subscribe now and follow us for daily football news and insights. Stay ahead of the game!
      </p>
    </section>
   </div>
    </>
  );
}
