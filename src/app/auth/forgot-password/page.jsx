"use client";

import Link from "next/link";
import {Button} from "@/components/ui"
import { BackwardIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import {ForgotPasswordForm} from "@/components/forms" 

export default function ForgotPasswordPage() {
 
  return (
   <div className="flex h-dvh items-center justify-center px-5 md:px-15
         relative bg-cyan-600">
      <main className="relative rounded-4xl overflow-hidden  h-150 max-h-150  bg-red-900 w-5/6 mt-5 md:mt-15"> 
          <Button variant="secondary" className="absolute left-4 top-5 z-20 w-5 md:w-12"><Link href="/auth/login"><BackwardIcon /></Link></Button>
          <section  className=" absolute w-1/2 h-full left-0 bg-black text-white hidden md:block">
        <p className="text-center text-sm text-gray-600 mt-6"></p>
       <h1>forgot password</h1> 
            <Image
                    src="/images/signup-illustration.png"
                    alt="Signup Illustration"
                    className="mt-8 w-64 h-64 object-cover rounded-xl shadow-lg"
                    width={256}
                    height={256}
                  />
      </section>
      <section className="absolute md:w-1/2 w-full h-full right-0 bg-white text-black shadow-2xl p-10 ">
      <ForgotPasswordForm />      
         </section>
    </main>
</div>  );
}
