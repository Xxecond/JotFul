"use client";
import Link from "next/link";
import Image from "next/image";
import {Button} from "@/components/ui";
import {BackwardIcon} from "@heroicons/react/24/solid"

export default function VerifyEmail() {

  return (
    <div className="flex h-dvh items-center justify-center px-5 md:px-15
       relative bg-cyan-600">
    <main className="relative rounded-4xl overflow-hidden  h-100  bg-red-900 w-full"> 
        <Button variant="secondary" className="absolute left-4 top-5 z-20 w-5 md:w-12"><Link href="/auth/signup"><BackwardIcon /></Link></Button>
        <section  className=" absolute w-1/2 h-full left-0 bg-black text-white hidden md:block">
          <Image
            src="/images/signup-illustration.png"
            alt="Signup Illustration"
            className="mt-8 w-64 h-64 object-cover rounded-xl shadow-lg"
            width={256}
            height={256}
          />
        </section>

         <section className="absolute md:w-1/2 w-full h-full right-0  bg-white text-black shadow-2xl p-10 ">
        </section>
    </main>
    </div>
  );
}
