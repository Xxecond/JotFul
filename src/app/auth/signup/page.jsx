"use client";
import Link from "next/link";
import Image from "next/image";
import {SignupForm} from "@/components/forms";
import {FcGoogle} from "react-icons/fc" 
import { FaApple} from "react-icons/fa"; 
import { FaXTwitter } from "react-icons/fa6";
import {Button} from "@/components/ui";
import {BackwardIcon} from "@heroicons/react/24/solid"

export default function SignupPage() {

  return (
    <div className="flex h-dvh items-center justify-center
       relative bg-cyan-600 dark:bg-cyan-900">
    <main className="relative rounded-4xl overflow-hidden  h-105 w-5/6 max-w-4xl"> 
        <Button variant="secondary" className="absolute left-4  dark:text-white top-5 z-20 w-5 md:w-12"><Link href="/"><BackwardIcon /></Link></Button>
        <section  className=" absolute w-1/2 h-full left-0 bg-black text-white hidden md:block">
          <h2 className="text-4xl font-bold mb-4">Join Blogger Web</h2>
          <p className="text-sm text-cyan-100 text-center leading-relaxed">
            Create your account, share your stories, and inspire your readers — all in one place.
          </p>
          <Image
            src="/images/signup-illustration.png"
            alt="Signup Illustration"
            className="mt-8 w-64 h-64 object-cover rounded-xl shadow-lg"
            width={256}
            height={256}
          />
        </section>

         <section className="absolute md:w-1/2 w-full h-full right-0 bg-white dark:bg-black/50 text-gray-900 dark:text-white shadow-2xl p-10 ">
          <h1 className="md:text-3xl text-2xl font-semibold text-center mt-3 ">
            Create Account
          </h1>
         <SignupForm  />
          <ul className="pt-8 flex justify-center text-sm space-x-2">
  <li className="w-[27.43px] h-[27.43px] bg-[#313030] rounded-full justify-center items-center flex">
    <a href="/api/auth/google">
      <FcGoogle />
    </a>
  </li>
  <li className="w-[27.43px] h-[27.43px] bg-[#313030] rounded-full text-white justify-center items-center flex">
    <a href="/api/auth/twitter">
      <FaXTwitter />
    </a>
  </li>
  {/* Uncomment when Apple OAuth is configured
  <li className="w-[27.43px] h-[27.43px] bg-[#313030] rounded-full text-gray-300 justify-center items-center flex">
    <a href="/api/auth/apple">
      <FaApple />
    </a>
  </li>
  */}
</ul>
        </section>
    </main>
    </div>
  );
}
