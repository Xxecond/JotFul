"use client";

import Button from "@/components/Button";
import Link from "next/link";
import { usePathname } from "next/navigation";
export default function LandingPage() {
const pathname = usePathname();

  return (
    
    <div className="flex flex-col min-h-screen">
  <nav className="w-full bg-white shadow-md px-6 md:px-16 py-4 flex justify-end items-center">
    <div className="flex items-center gap-6 text-gray-700 font-medium">
          
    
              <Link href="/login" className={(pathname, "/login")}>
              Login
            </Link>
            <Link href="/signup" className={(pathname, "/signup")}>
              Sign Up
            </Link>
      </div>
    </nav>

      <main className="flex flex-col justify-center items-center flex-grow text-center px-6 bg-gradient-to-b from-indigo-100 to-white">
        <h1 className="text-5xl font-bold mb-4">Welcome to My Blog</h1>
        <p className="text-lg text-gray-700 mb-8 max-w-xl">
          Share your stories, inspire others, and explore amazing ideas — all in one place.
        </p>

        <div className="flex gap-4">
          <Link href="/signup">
            <Button>Get Started</Button>
          </Link>
          <Link href="/login">
            <Button variant="outline">Log In</Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
