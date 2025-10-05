"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Simulated auth check (replace with real token logic)
  useEffect(() => {
    const user = localStorage.getItem("user");
    setIsLoggedIn(!!user);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    router.push("/login");
  };

  // Hide navbar on login/signup pages
  if (pathname === "/login" || pathname === "/signup") return null;

  return (
    <nav className="w-full bg-white shadow-md px-6 md:px-16 py-4 flex justify-between items-center">
      {/* Logo */}
      <Link href="/" className="text-2xl font-bold text-indigo-600">
        MyBlog
      </Link>

      {/* Links */}
      <div className="flex items-center gap-6 text-gray-700 font-medium">
        {isLoggedIn ? (
          <>
            <Link href="/home" className={linkStyle(pathname, "/home")}>
              Home
            </Link>
            <Link href="/create" className={linkStyle(pathname, "/create")}>
              Create Blog
            </Link>
            <Link href="/about" className={linkStyle(pathname, "/about")}>
              About
            </Link>
            <button
              onClick={handleLogout}
              className="text-red-500 hover:text-red-600 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className={linkStyle(pathname, "/login")}>
              Login
            </Link>
            <Link href="/signup" className={linkStyle(pathname, "/signup")}>
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

// Helper function to highlight active page
function linkStyle(pathname, href) {
  const isActive = pathname === href;
  return isActive
    ? "text-indigo-600 font-semibold border-b-2 border-indigo-600 pb-1"
    : "hover:text-indigo-600 transition";
}
