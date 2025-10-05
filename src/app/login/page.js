"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginUser } from "@/lib/db"; // your backend call

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const savedEmail = localStorage.getItem("userEmail");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const data = await loginUser(email, password);
      if (!data.error) {
        if (rememberMe) localStorage.setItem("userEmail", email);
        else localStorage.removeItem("userEmail");
        router.push("/home");
      } else setMessage(`❌ ${data.error}`);
    } catch {
      setMessage("❌ Something went wrong. Try again.");
    }
  };

  return (
    <main className="flex min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 items-center justify-center px-4">
      <div className="flex flex-col md:flex-row bg-white rounded-2xl shadow-2xl overflow-hidden w-full max-w-4xl">
        
        {/* Left section – QR / Illustration */}
        <div className="hidden md:flex flex-col justify-center items-center bg-blue-600 text-white p-10 w-1/2">
          <h2 className="text-4xl font-bold mb-4">Blogger Web</h2>
          <p className="text-sm text-blue-100 text-center leading-relaxed">
            Sign in to manage your posts, connect with your readers, and keep your thoughts flowing.
          </p>
          <div className="mt-8 bg-white rounded-xl p-4">
            <img
              src="/images/qr-placeholder.png"
              alt="QR code placeholder"
              className="w-40 h-40 object-cover"
            />
          </div>
        </div>

        {/* Right section – Form */}
        <div className="flex-1 p-8 md:p-12">
          <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">
            Welcome Back 👋
          </h1>
          <form onSubmit={handleLogin} className="space-y-5">
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
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center text-sm text-gray-600">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                Remember me
              </label>
              <Link href="/forgot-password" className="text-blue-600 hover:underline">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Sign In
            </button>

            <p className="text-center text-sm text-gray-600 mt-4">
              New here?{" "}
              <Link href="/signup" className="text-blue-600 hover:underline">
                Create account
              </Link>
            </p>

            {message && (
              <p
                className={`text-center mt-3 text-sm ${
                  message.startsWith("❌") ? "text-red-500" : "text-green-600"
                }`}
              >
                {message}
              </p>
            )}
            <p className="text-center text-sm text-gray-600 mt-4">
  ← <Link href="/" className="text-blue-600 hover:underline">Back to Home</Link>
</p>
          </form>
        </div>
      </div>
    </main>
  );
}
