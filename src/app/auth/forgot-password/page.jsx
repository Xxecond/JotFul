"use client";

import Link from "next/link";
import {Button} from "@/components/ui"
import { BackwardIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import {ForgotPasswordForm} from "@/components/forms" 

export default function ForgotPasswordPage() {
 
  return (
   <div className="flex h-dvh relative bg-cyan-600">
      <main className="absolute -translate-x-1/2 left-1/2 -translate-y-1/2 top-1/2 rounded-4xl overflow-hidden  h-80 max-h-150  bg-red-900 w-5/6 max-w-4xl"> 
          <Button variant="secondary" className="absolute left-2 top-5 z-20 w-5 md:w-12"><Link href="/auth/login"><BackwardIcon /></Link></Button>
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
      <section className="absolute grid items-center md:w-1/2 w-full h-full right-0 bg-white text-black  p-10 ">
      <ForgotPasswordForm />      
         </section>
    </main>
</div>  );
}
