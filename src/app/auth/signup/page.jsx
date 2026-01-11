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
       relative bg-cyan-600 dark:bg-cyan-950">
    <main className="relative rounded-4xl overflow-hidden  h-120 w-[87%] max-w-4xl dark:shadow-[0_0_20px_rgba(255,255,255,0.1)] shadow-[0_0_20px_rgba(0,0,0,0.5)]"> 
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

         <section className="absolute md:w-1/2 w-full h-full right-0 bg-white dark:bg-black/90 text-gray-900 dark:text-white p-10 ">
          <h1 className="md:text-3xl text-2xl font-semibold text-center mt-3 ">
            Create Account
          </h1>
         <SignupForm  />
          <div className="text-white dark:text-black pt-12 flex flex-col justify-center text-sm space-y-4">
  <a href="/api/auth/google">
  <button className="w-full cursor-pointer h-9 bg-cyan-700 dark:bg-cyan-950 hover:bg-cyan-600 text-white dark:text-slate-100 rounded-xl text-sm md:text-base xl:text-lg justify-center items-center flex">
   <FcGoogle  className="mr-3 text-lg"/>Sign up using Google 
      <FcGoogle  className="ml-3 text-lg"/>
  </button>
  </a>
  <a href="/api/auth/twitter">
  <button className="w-full cursor-pointer h-9 bg-cyan-700 dark:bg-cyan-950 hover:bg-cyan-600 text-white dark:text-slate-100 rounded-xl text-sm md:text-base xl:text-lg justify-center items-center flex">
    <FaXTwitter className="mr-3 text-lg"/>Sign up using X
      <FaXTwitter className="ml-3 text-lg"/>
  </button>
    </a>
  {/* Uncomment when Apple OAuth is configured
  <li className="w-[27.43px] h-[27.43px] bg-[#313030] rounded-full text-gray-300 justify-center items-center flex">
    <a href="/api/auth/apple">
      <FaApple />
    </a>
  </li>
  */}
</div>
        </section>
    </main>
    </div>
  );
}
