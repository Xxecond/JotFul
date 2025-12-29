"use client";
import Link from "next/link";
import Image from "next/image";
import {SignupForm} from "@/components/forms";
import {FcGoogle} from "react-icons/fc" 
import { FaFacebook, FaApple} from "react-icons/fa"; 
import {Button} from "@/components/ui";
import {BackwardIcon} from "@heroicons/react/24/solid"

export default function SignupPage() {

  return (
    <div className="flex h-dvh items-center justify-center
       relative bg-cyan-600">
    <main className="relative rounded-4xl overflow-hidden  h-160  md:h-165  bg-red-900 w-5/6 max-w-4xl"> 
        <Button variant="secondary" className="absolute left-4 top-5 z-20 w-5 md:w-12"><Link href="/"><BackwardIcon /></Link></Button>
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

         <section className="absolute md:w-1/2 w-full h-full right-0  bg-white text-black shadow-2xl p-10 ">
          <h1 className="md:text-3xl text-2xl font-semibold text-center mt-3 ">
            Create Account
          </h1>
         <SignupForm  />
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
