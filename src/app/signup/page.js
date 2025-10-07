"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { signupUser } from "@/lib/api"; // ✅ frontend API call

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");

  // ✅ Prefill saved email if "Remember Me" was checked before
  useEffect(() => {
    const savedEmail = localStorage.getItem("userEmail");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  // ✅ Signup handler
  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const result = await signupUser(email, password);

      if (!result.error) {
        // Remember email only (not password)
        if (rememberMe) localStorage.setItem("userEmail", email);
        else localStorage.removeItem("userEmail");

        setMessage("✅ Signup successful! Check your email to verify.");
        setTimeout(() => router.push("/login?signup=true"), 3000);
      } else {
        setMessage(`❌ ${result.error}`);
      }
    } catch (err) {
      console.error("Signup error:", err);
      setMessage("❌ Something went wrong. Try again.");
    }
  };

  return (
    <main className="flex min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 items-center justify-center px-4">
      <div className="flex flex-col md:flex-row bg-white rounded-2xl shadow-2xl overflow-hidden w-full max-w-4xl">
        {/* Left section – Illustration */}
        <div className="hidden md:flex flex-col justify-center items-center bg-blue-600 text-white p-10 w-1/2">
          <h2 className="text-4xl font-bold mb-4">Join Blogger Web</h2>
          <p className="text-sm text-blue-100 text-center leading-relaxed">
            Create your account, share your stories, and inspire your readers — all in one place.
          </p>
          <Image
            src="/images/signup-illustration.png"
            alt="Signup Illustration"
            className="mt-8 w-64 h-64 object-cover rounded-xl shadow-lg"
            width={256}
            height={256}
          />
        </div>

        {/* Right section – Form */}
        <div className="flex-1 p-8 md:p-12">
          <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">
            Create an Account ✨
          </h1>

          <form onSubmit={handleSignup} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-gray-600 text-sm mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                required
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-gray-600 text-sm mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between text-sm text-gray-600">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                Remember me
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Sign Up
            </button>

            {/* Footer */}
            <p className="text-center text-sm text-gray-600 mt-4">
              Already have an account?{" "}
              <Link href="/login" className="text-blue-600 hover:underline">
                Log In
              </Link>
            </p>

            {/* Message */}
            {message && (
              <p
                className={`text-center mt-3 text-sm ${
                  message.startsWith("✅") ? "text-green-600" : "text-red-500"
                }`}
              >
                {message}
              </p>
            )}

            <p className="text-center text-sm text-gray-600 mt-4">
              ←{" "}
              <Link href="/" className="text-blue-600 hover:underline">
                Back to Home
              </Link>
            </p>
          </form>
        </div>
      </div>
    </main>
  );
}
