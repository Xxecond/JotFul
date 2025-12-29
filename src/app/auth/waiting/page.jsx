"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function WaitingAuthContent() {
  const [sessionId, setSessionId] = useState("");
  const [status, setStatus] = useState("waiting");
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Get sessionId from URL params
    const id = searchParams.get('sessionId');
    if (!id) {
      // Generate new sessionId if not provided
      const newId = Math.random().toString(36).substring(7);
      setSessionId(newId);
    } else {
      setSessionId(id);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!sessionId) return;
    
    // Start polling for auth status
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/auth/check-session?sessionId=${sessionId}`);
        const data = await res.json();
        
        if (data.authenticated) {
          setStatus("authenticated");
          clearInterval(interval);
          router.push("/home");
        } else if (data.denied) {
          setStatus("denied");
          clearInterval(interval);
          alert("Login request was denied.");
        }
      } catch (err) {
        console.error("Polling error:", err);
      }
    }, 2000); // Check every 2 seconds

    return () => clearInterval(interval);
  }, [router, sessionId]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h1 className="text-2xl mb-4">Check Your Email</h1>
        <p className="text-gray-600 mb-6">
          Click "Yes, it's me" in your email to authenticate
        </p>
        
        <div className="mb-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
        </div>
        
        <p className="text-sm text-gray-500">
          Session ID: {sessionId}
        </p>
        <p className="text-xs text-gray-400 mt-2">
          This page will automatically redirect when you authenticate
        </p>
      </div>
    </div>
  );
}

export default function WaitingAuth() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
        </div>
      </div>
    }>
      <WaitingAuthContent />
    </Suspense>
  );
}