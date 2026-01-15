"use client";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center bg-gray-50 dark:bg-gray-950">
      <h1 className="text-5xl font-bold text-gray-800 dark:text-gray-50 mb-4">404 - Page Not Found</h1>
      <p className="text-gray-600 dark:text-gray-300 mb-6">
        Oops! The page you’re looking for doesn’t exist.
      </p>
      <Link
        href="/"
        className="px-5 py-2 bg-blue-600 dark:bg-blue-800 text-white rounded-lg hover:bg-blue-700 transition-all"
      >
        🔙 Back to Home
      </Link>
    </div>
  );
}
