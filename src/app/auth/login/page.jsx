"use client";

import Link from "next/link";
import Image from "next/image";
import { LoginForm } from "@/components/forms";
import {FcGoogle} from "react-icons/fc" 
import { FaFacebook, FaApple} from "react-icons/fa" 
import { Button } from "@/components/ui";
import {BackwardIcon} from "@heroicons/react/24/solid"

export default function LoginPage() {
  
  return (
    <div className="flex h-dvh items-center justify-center
       relative bg-cyan-600">
      <main className="relative rounded-4xl overflow-hidden  h-150 max-h-150  bg-red-900 w-5/6 max-w-4xl">
       <Button variant="secondary" className="absolute left-8 top-5 z-20 md:w-12 w-5"><Link href="/"><BackwardIcon /></Link></Button>
       <section  className=" absolute w-1/2 h-full left-0 bg-black text-white hidden md:block">
          <h2 className="text-4xl text-center mt-15 my-10 font-bold ">JotFul✍️</h2>
          <p className=" text-sm text-center leading-relaxed">
            Sign in to manage your posts, connect with your readers, and keep your thoughts flowing.
          </p>
          <div className="h-50 w-50 mx-auto mt-10 relative  bg-white rounded-xl">
            <Image
              src="/assets/green.jpg"
              alt="QR code placeholder"
              fill
              className="object-cover absolute"
            />
          </div>
        </section>

        <section className="absolute md:w-1/2 w-full h-full right-0  bg-white text-black shadow-2xl p-10 ">
   <h1 className="md:text-3xl text-2xl font-semibold text-center  mt-3">
            Welcome Back 
          </h1>
<LoginForm />
 <ul className="pt-8 flex justify-center text-sm space-x-2">
  <li className="w-[27.43px] h-[27.43px] bg-[#313030] rounded-full justify-center items-center flex">
    <a href="https://accounts.google.com/" target="_blank" rel="noopener noreferrer">
      <FcGoogle />
    </a>
  </li>
  <li className="w-[27.43px] h-[27.43px] bg-[#313030] rounded-full text-[#1877F2] justify-center items-center flex">
    <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer">
      <FaFacebook />
    </a>
  </li>
  <li className="w-[27.43px] h-[27.43px] bg-[#313030] rounded-full text-gray-300 justify-center items-center flex">
    <a href="https://www.apple.com/" target="_blank" rel="noopener noreferrer">
      <FaApple />
    </a>
  </li>
</ul>
     </section>
      </main>
    </div>
  );
}
//so after installing any dependencies make sure to run npm install
//so button instead of Button