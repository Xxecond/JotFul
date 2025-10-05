import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-100 text-gray-700 py-8 px-6 md:px-16 mt-12">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Brand */}
        <Link href="/" className="text-2xl font-bold text-indigo-600">
          MyBlog
        </Link>

        {/* Links */}
        <div className="flex gap-6 text-sm">
          <Link href="/about" className="hover:text-indigo-600 transition">
            About
          </Link>
          <Link href="/home" className="hover:text-indigo-600 transition">
            Home
          </Link>
          <Link href="/create" className="hover:text-indigo-600 transition">
            Create Blog
          </Link>
          <Link href="/login" className="hover:text-indigo-600 transition">
            Login
          </Link>
        </div>

        {/* Copyright */}
        <p className="text-sm text-gray-500 text-center md:text-right">
          © {year} MyBlog. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
