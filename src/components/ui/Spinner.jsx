"use client";

export default function Spinner({ size = "md", color = "text-white" }) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  };

  return (
    <div
      className={`animate-spin rounded-full border-2 border-current border-t-transparent ${sizeClasses[size]} ${color}`}
      role="status"
      aria-label="loading"
    />
  );
}
