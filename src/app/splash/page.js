// src/app/page.js
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function SplashPage() {
  const router = useRouter();
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      router.push("/home");
    }, 2500); // 2.5 seconds splash
    return () => clearTimeout(timer);
  }, [router]);

  if (!show) return null;

  return (
    <div className="flex items-center justify-center min-h-screen bg-indigo-500 text-white flex-col">
      <h1 className="text-5xl font-bold mb-4">My Blogger App</h1>
      <p className="text-xl">Loading your experience...</p>
    </div>
  );
}
