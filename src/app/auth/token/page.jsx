"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function TokenLogin() {
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch(`/api/auth/magic-callback?token=${token}`);
      if (res.redirected) {
        router.push("/home");
      } else {
        alert("Invalid or expired token");
      }
    } catch (err) {
      alert("Error verifying token");
    }
    
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl mb-4">Enter Magic Token</h1>
        <p className="text-sm text-gray-600 mb-4">
          Copy the token from your magic link URL and paste it here
        </p>
        
        <input
          type="text"
          placeholder="Paste token here..."
          value={token}
          onChange={(e) => setToken(e.target.value)}
          className="w-full p-2 border rounded mb-4"
          required
        />
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white p-2 rounded"
        >
          {loading ? "Verifying..." : "Login"}
        </button>
      </form>
    </div>
  );
}