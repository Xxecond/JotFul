"use client";

import { Button } from "@/components/ui";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
export default function LandingPage() {
const pathname = usePathname();

  return (
    <div>
    <nav className="bg-white shadow-xl px-6 md:px-16 py-4 flex justify-end ">
    <div className="flex items-center gap-6 text-gray-700 font-medium">
              <Link href="/auth/login" className={(pathname, "/auth/login")}>
              Login
            </Link>
            <Link href="/auth/signup" className={(pathname, "/auth/signup")}>
              Sign Up
            </Link>
      </div>
    </nav>
      <section className=" flex h-185 justify-center text-center bg-white">
        <div className="md:w-1/2 py-30 ">
        <h1 className="text-5xl font-light leading-loose  ">Capture ideas✨,<br />Stay Organised 📁,<br /> Be JotFul✍️</h1>
        <div className="flex pt-15 gap-4 justify-center">
          <Link href="/auth/signup">
            <Button variant="special">Enter Jot</Button>
          </Link>
          <Link href="/auth/login">
            <Button variant="outline" className={"hover:bg-cyan-600 hover:text-white border-cyan-700"}>Log In</Button>
          </Link>
        </div>
        </div>
          <div className="w-1/2 relative md:block hidden">
            <Image
            alt="land-pic"
            src="/assets/b.jpg"
            fill className="object-cover" />
          </div>
 </section>       
 <footer className=" h-50  bg-cyan-600 text-gray-100">
  <section className="flex p-9 gap-9">
    <div className="relative h-10 md:h-20 w-30">
    <Image src="/assets/b.jpg"
    alt="logo"
    fill
     />
    </div>
  <p className="">Jotful helps you note, plan and manage your thoughts all in one simple beautiful space. <br className="hidden md:block" />Write freely, sync instantly, and stay productive wherever you go</p>
</section>
<div className="border-t border-t-white">
  <p className="text-center py-4 
text-sm text-right font-light pr-5">
        © {new Date().getFullYear()} Jotful. All rights reserved.
      </p>

</div>
 </footer>
    </div>
  );
}