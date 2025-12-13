"use client";
import Link from "next/link";
import Image from "next/image";
import {Button} from "@/components/ui";
import {BackwardIcon} from "@heroicons/react/24/solid"
import { Spinner } from "@/components/ui";
import { useState } from "react";
import { useSearchParams } from "next/navigation";

import { Suspense } from "react";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const paramEmail = searchParams?.get?.("email");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleResend = async () => {
    try {
      setMessage("");
      let email = paramEmail;

      if (!email) {
        try {
          const stored = localStorage.getItem("user");
          if (stored) {
            const parsed = JSON.parse(stored);
            if (parsed && parsed.email) email = parsed.email;
          }
        } catch (e) {
          // ignore parse errors
        }
      }

      if (!email) {
        email = prompt("Enter your email to resend verification:");
      }

      if (!email) {
        setMessage("Email is required to resend verification.");
        return;
      }

      setLoading(true);

      // Note: the API filename currently is `resend-verifaction.js` (typo),
      // so we POST to that path. If you rename the API file, update this path.
      const res = await fetch("/api/auth/resend-verifaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage(data.message || "Verification email sent. Check your inbox.");
      } else {
        setMessage(data.message || "Failed to resend verification.");
      }
    } catch (err) {
      console.error("Resend error:", err);
      setMessage("Server error. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-dvh items-center justify-center px-5 md:px-15
       relative bg-cyan-600">
    <main className="relative rounded-4xl overflow-hidden  h-100  bg-red-900 w-5/6"> 
        <Button variant="secondary" className="absolute left-4 top-5 z-20 w-5 md:w-12"><Link href="/auth/signup"><BackwardIcon /></Link></Button>
        <section  className=" absolute w-1/2 h-full left-0 bg-black text-white hidden md:block mx-auto">
          <Image
            src="/images/signup-illustration.png"
            alt="Signup Illustration"
            className="mt-8 w-64 h-64 object-cover rounded-xl shadow-lg"
            width={256}
            height={256}
          />
        </section>

        <section className="absolute md:w-1/2 w-full h-full right-0
           bg-white text-black grid grid-cols-1 gap-1 justify-center items-center">
  <h1 className="text-xl md:2xl font-semibold text-center">
    Verify Your Email
  </h1>

  <p className="text-gray-600 text-center block mx-auto max-w-sm ">
    We've sent a verification link to your email.  
    Please check your inbox and click the link to continue.
  </p>

  <div className=" mx-auto">
    <Spinner size="lg" color="text-black" />
  </div>
  <Button
    variant="special"
    className="max-w-sm mx-auto"
    onClick={handleResend}
    disabled={loading}
  >
    {loading ? "Sending..." : "Resend Verification Email"}
  </Button>

  {message && (
    <p className="text-center mt-4 text-sm text-gray-700">{message}</p>
  )}
     </section>
    </main>
    </div>
  );
}

export default function VerifyEmail() {
  return (
    <Suspense>
      <VerifyEmailContent />
    </Suspense>
  );
}
