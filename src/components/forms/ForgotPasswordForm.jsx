"use client"

import {Button} from "@/components/ui";
import {useState} from "react";

export default function ForgotPasswordForm(){

 const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(`❌ ${data.error || "Something went wrong"}`);
      } else {
        setMessage("✅ Password reset link sent to your email!");
      }
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setMessage("❌ Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };
return(
           <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-gray-600 text-sm mb-2">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@email.com"
                  required
                  className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
    
              <Button
                type="submit"
                disabled={loading}
               variant="special"
               className="w-full"
              >
                
                {loading ? (<span className="flex  items-center justify-center gap-3">Reseting...<Spinner size="sm" /></span>) :(<>Reset Link</>)}
              </Button>
    
              {message && (
                <p
                  className={`text-center mt-3 text-sm ${
                    message.startsWith("✅") ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {message}
                </p>
              )}
            </form>
    
)}
 