"use client";

export default function SkeletonLoader({ width = "w-full", height = "h-4", className = "" }) {
  return (
    <div
      className={`animate-pulse bg-gray-300 dark:bg-gray-700 rounded ${width} ${height} ${className}`}
      role="status"
      aria-label="loading"
    />
  );
}
